import { PGlite } from '@electric-sql/pglite';
import { readdir, readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const db = new PGlite();
const migrations = new URL('../../prisma/migrations/', import.meta.url);
for (const dir of (await readdir(migrations)).filter(x => /^\d/.test(x)).sort()) {
 await db.exec(await readFile(new URL(`${dir}/migration.sql`, migrations), 'utf8'));
}
await db.exec(`
 INSERT INTO "User" (id,email,name,"updatedAt") VALUES
 ('owner','owner@example.test','Owner',now()),('other','other@example.test','Other',now());
 INSERT INTO "Session" (id,"sessionToken","userId",expires) VALUES
 ('s1','active-token','owner',(CURRENT_TIMESTAMP AT TIME ZONE 'UTC') + interval '1 day'),
 ('s2','expired-token','owner',(CURRENT_TIMESTAMP AT TIME ZONE 'UTC') - interval '1 second'),
 ('s3','other-token','other',(CURRENT_TIMESTAMP AT TIME ZONE 'UTC') + interval '1 day');
 INSERT INTO "Recipe" (id,"titleZh","titleEn","instructionsZh","instructionsEn","userId","updatedAt")
 VALUES ('r','菜','Dish','煮','Cook','owner',now());
 INSERT INTO "Favorite" (id,"userId","recipeId") VALUES ('f','other','r');
 INSERT INTO "Rating" (id,score,"userId","recipeId","updatedAt") VALUES ('v',4,'other','r',now());
`);
const sessionSql=(await readFile(new URL('../src/main/resources/session-user.sql',import.meta.url),'utf8')).replaceAll(':token','$1');
const accessSql=(await readFile(new URL('../src/main/resources/recipe-access.sql',import.meta.url),'utf8')).replaceAll(':userId','$1').replaceAll(':recipeId','$2');
const session=async token=>(await db.query(sessionSql,[token])).rows;
assert.equal((await session('active-token'))[0].id,'owner');
assert.equal((await session('other-token'))[0].id,'other');
assert.equal((await session('expired-token')).length,0);
assert.equal((await session('fake')).length,0);
assert.equal((await session("' OR 1=1 --")).length,0);
// Prisma dates are UTC timestamps without zone; validation must stay correct
// even if the connection's database timezone differs from UTC.
await db.exec("SET TIME ZONE 'Australia/Sydney'");
assert.equal((await session('active-token'))[0].id,'owner');
assert.equal((await session('expired-token')).length,0);
const owner=(await db.query(accessSql,['owner','r'])).rows[0];
const other=(await db.query(accessSql,['other','r'])).rows[0];
assert.deepEqual(owner,{isOwner:true,isFavorited:false,userRating:null});
assert.deepEqual(other,{isOwner:false,isFavorited:true,userRating:4});
assert.equal((await db.query(accessSql,['owner','missing'])).rows.length,0);
await db.exec(`DELETE FROM "Session" WHERE id='s1'`);
assert.equal((await session('active-token')).length,0);
await db.exec(`DELETE FROM "User" WHERE id='other'`);
assert.equal((await session('other-token')).length,0);
await db.close();
console.log('PASS auth SQL: expiry, timezone, revocation, deleted user, bound token, ownership and per-user isolation.');
