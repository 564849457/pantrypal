SELECT jsonb_build_object(
 'id', r.id, 'titleZh', r."titleZh", 'titleEn', r."titleEn",
 'descriptionZh', r."descriptionZh", 'descriptionEn', r."descriptionEn",
 'instructionsZh', r."instructionsZh", 'instructionsEn', r."instructionsEn",
 'imageUrl', r."imageUrl", 'prepTime', r."prepTime", 'cookTime', r."cookTime",
 'servings', r.servings, 'userId', r."userId",
 'category', CASE WHEN c.id IS NULL THEN NULL ELSE jsonb_build_object(
   'id', c.id, 'nameZh', c."nameZh", 'nameEn', c."nameEn") END,
 'ingredients', COALESCE((SELECT jsonb_agg(jsonb_build_object(
   'id', ri.id, 'quantity', ri.quantity, 'unit', ri.unit,
   'ingredient', jsonb_build_object('id', i.id, 'nameZh', i."nameZh", 'nameEn', i."nameEn")
 ) ORDER BY ri.id) FROM "RecipeIngredient" ri JOIN "Ingredient" i ON i.id = ri."ingredientId"
 WHERE ri."recipeId" = r.id), '[]'::jsonb),
 'averageRating', COALESCE((SELECT avg(score) FROM "Rating" WHERE "recipeId" = r.id), 0),
 'ratingCount', (SELECT count(*) FROM "Rating" WHERE "recipeId" = r.id)
)::text
FROM "Recipe" r LEFT JOIN "Category" c ON c.id = r."categoryId"
