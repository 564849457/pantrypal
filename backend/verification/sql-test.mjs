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

// Execute the exact production WHERE fragment, with bound parameters.
const filter = (await readFile(new URL('../src/main/resources/recipe-filter.sql', import.meta.url), 'utf8'))
 .replaceAll(':category', '$1').replaceAll(':q', '$2');
async function search(q = '', category = '', limit = 10, offset = 0) {
 return (await db.query(sql + filter + ' ORDER BY r."createdAt" DESC, r.id ASC LIMIT $3 OFFSET $4',
  [category, q, limit, offset])).rows.map(decode);
}
assert.equal((await search('虾'))[0].id, 'r1');
assert.equal((await search('SHRIMP'))[0].id, 'r1');
assert.equal((await search('海鲜'))[0].id, 'r1');
assert.equal((await search('', 'cat')).length, 1);
assert.equal((await search('Simple', 'cat')).length, 0);
assert.equal((await search('', 'missing')).length, 0);
assert.equal((await search("' OR 1=1 --")).length, 0);
assert.equal((await search('%')).length, 0);
assert.equal((await search('_')).length, 0);
await db.exec(`UPDATE "Recipe" SET "descriptionEn"='100% tasty_value' WHERE id='r2';
 INSERT INTO "Ingredient" (id,"nameZh","nameEn") VALUES ('ing2','海盐','Sea Salt');
 INSERT INTO "RecipeIngredient" (id,"recipeId","ingredientId") VALUES ('ri2','r1','ing2');`);
assert.equal((await search('salt'))[0].id, 'r1'); // Ingredient-only match.
assert.equal((await search('%'))[0].id, 'r2'); // Literal wildcard characters.
assert.equal((await search('_'))[0].id, 'r2');
assert.equal((await search('sea')).length, 1); // Category and ingredient matches do not duplicate rows.
assert.equal((await search('', '', 1, 1))[0].id, 'r2');
assert.equal((await search('', '', 1, 2)).length, 0);
await db.close();
console.log('SQL checks passed: schema compatibility, bilingual search, ingredients, combined filters, literal wildcards, injection strings, stable pagination, empty pages.');
