package com.pantrypal.recipes;
import java.util.List;
public record RecipeDto(String id, String titleZh, String titleEn,
 String descriptionZh, String descriptionEn, String instructionsZh, String instructionsEn,
 String imageUrl, Integer prepTime, Integer cookTime, Integer servings, String userId,
 Category category, List<RecipeIngredient> ingredients, double averageRating, int ratingCount) {
 public record Category(String id, String nameZh, String nameEn) {}
 public record Ingredient(String id, String nameZh, String nameEn) {}
 public record RecipeIngredient(String id, Double quantity, String unit, Ingredient ingredient) {}
}
