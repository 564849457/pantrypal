package com.pantrypal.recipes;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
class RecipeDtoTest {
 @Test void decodesPostgresJsonResult() throws Exception {
  try (var json = getClass().getResourceAsStream("/recipe-result.json")) {
   var recipe = new ObjectMapper().readValue(json, RecipeDto.class);
   assertEquals("蒸虾", recipe.titleZh());
   assertEquals("Shrimp", recipe.ingredients().get(0).ingredient().nameEn());
   assertEquals(2.5, recipe.ingredients().get(0).quantity());
   assertEquals(4, recipe.averageRating());
   assertEquals(1, recipe.ratingCount());
   assertNull(recipe.descriptionEn());
  }
 }
}
