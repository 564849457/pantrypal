SELECT (r."userId" = :userId) AS "isOwner",
 EXISTS(SELECT 1 FROM "Favorite" f WHERE f."recipeId" = r.id AND f."userId" = :userId) AS "isFavorited",
 (SELECT score FROM "Rating" v WHERE v."recipeId" = r.id AND v."userId" = :userId) AS "userRating"
FROM "Recipe" r WHERE r.id = :recipeId
