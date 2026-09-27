import { PGlite } from '@electric-sql/pglite';
import { readdir, readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const db = new PGlite();
const migrations = '../../prisma/migrations/';
for (const dir of (await readdir(new URL(migrations, import.meta.url))).filter(x => /^\d/.test(x)).sort()) {
 await db.exec(await readFile(new URL(`${migrations}${dir}/migration.sql`, import.meta.url), 'utf8'));
}
await db.exec(`
 INSERT INTO "User" (id, email, "updatedAt") VALUES ('owner', 'fixture@example.test', now());
 INSERT INTO "Category" (id, "nameZh", "nameEn") VALUES ('cat', '海鲜', 'Seafood');
 INSERT INTO "Ingredient" (id, "nameZh", "nameEn") VALUES ('ing', '虾', 'Shrimp');
 INSERT INTO "Recipe" (id, "titleZh", "titleEn", "instructionsZh", "instructionsEn", "userId", "categoryId", "updatedAt")
 VALUES ('r1', '蒸虾', 'Steamed shrimp', '蒸熟', 'Steam', 'owner', 'cat', now()),
 ('r2', '简单菜', 'Simple meal', '煮熟', 'Cook', 'owner', NULL, now());
 INSERT INTO "RecipeIngredient" (id,"recipeId","ingredientId",quantity,unit) VALUES ('ri','r1','ing',2.5,'g');
 INSERT INTO "Rating" (id,score,"userId","recipeId","updatedAt") VALUES ('rating',4,'owner','r1',now());
`);
const sql = await readFile(new URL('../src/main/resources/recipe-select.sql',import.meta.url),'utf8');
const decode = row => JSON.parse(Object.values(row)[0]);
const detail = decode((await db.query(sql + ' WHERE r.id = $1',['r1'])).rows[0]);
assert.equal(detail.titleZh,'蒸虾'); assert.equal(detail.category.nameEn,'Seafood');
assert.equal(detail.ingredients[0].quantity,2.5);assert.equal(detail.ingredients[0].ingredient.nameZh,'虾');
assert.equal(detail.averageRating,4);assert.equal(detail.ratingCount,1);assert.equal(detail.descriptionEn,null);
const nullable = decode((await db.query(sql + ' WHERE r.id = $1',['r2'])).rows[0]);
assert.equal(nullable.category,null);assert.deepEqual(nullable.ingredients,[]);assert.equal(nullable.averageRating,0);
assert.equal((await db.query(sql + ' WHERE r.id = $1',["r1' OR 1=1 --"])).rows.length,0);
const page = await db.query(sql + ' ORDER BY r."createdAt" DESC,r.id ASC LIMIT $1 OFFSET $2',[1,1]);
assert.equal(decode(page.rows[0]).id,'r2');
await db.close();
console.log('SQL checks passed against Prisma migrations in PGlite: bilingual, nullable, ingredients, ratings, pagination, parameter binding.');
