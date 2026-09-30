WHERE (:category = '' OR r."categoryId" = :category)
AND (:q = '' OR
 strpos(lower(r."titleZh"), lower(:q)) > 0 OR
 strpos(lower(r."titleEn"), lower(:q)) > 0 OR
 strpos(lower(coalesce(r."descriptionZh", '')), lower(:q)) > 0 OR
 strpos(lower(coalesce(r."descriptionEn", '')), lower(:q)) > 0 OR
 strpos(lower(coalesce(c."nameZh", '')), lower(:q)) > 0 OR
 strpos(lower(coalesce(c."nameEn", '')), lower(:q)) > 0 OR
 EXISTS (SELECT 1 FROM "RecipeIngredient" ri JOIN "Ingredient" i ON i.id = ri."ingredientId"
   WHERE ri."recipeId" = r.id AND (
    strpos(lower(i."nameZh"), lower(:q)) > 0 OR strpos(lower(i."nameEn"), lower(:q)) > 0)))
