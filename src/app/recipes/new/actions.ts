"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

type IngredientInput = {
  nameEn: string;
  nameZh: string;
  quantity: string;
  unit: string;
};

export async function createRecipe(formData: FormData) {
  const titleEn = String(
    formData.get("titleEn") ?? "",
  ).trim();

  const titleZh = String(
    formData.get("titleZh") ?? "",
  ).trim();

  const descriptionEn = String(
    formData.get("descriptionEn") ?? "",
  ).trim();

  const descriptionZh = String(
    formData.get("descriptionZh") ?? "",
  ).trim();

  const instructionsEn = String(
    formData.get("instructionsEn") ?? "",
  ).trim();

  const instructionsZh = String(
    formData.get("instructionsZh") ?? "",
  ).trim();

  const categoryId = String(
    formData.get("categoryId") ?? "",
  ).trim();

  const prepTimeValue = String(
    formData.get("prepTime") ?? "",
  ).trim();

  const cookTimeValue = String(
    formData.get("cookTime") ?? "",
  ).trim();

  const servingsValue = String(
    formData.get("servings") ?? "",
  ).trim();

  const imageUrl = String(
    formData.get("imageUrl") ?? "",
  ).trim();

  const ingredientsJson = String(
    formData.get("ingredients") ?? "[]",
  );

  // ------------------------------------------------
  // Basic validation
  // ------------------------------------------------

  if (
    !titleEn ||
    !titleZh ||
    !instructionsEn ||
    !instructionsZh ||
    !categoryId
  ) {
    throw new Error("Missing required fields.");
  }

  // ------------------------------------------------
  // Parse ingredients
  // ------------------------------------------------

  let ingredients: IngredientInput[] = [];

  try {
    ingredients = JSON.parse(
      ingredientsJson,
    ) as IngredientInput[];
  } catch {
    throw new Error("Invalid ingredient data.");
  }

  const validIngredients = ingredients.filter(
    (ingredient) =>
      ingredient.nameEn.trim() &&
      ingredient.nameZh.trim(),
  );

  // ------------------------------------------------
  // Validate numeric fields
  // ------------------------------------------------

  const prepTime = prepTimeValue
    ? Number(prepTimeValue)
    : null;

  const cookTime = cookTimeValue
    ? Number(cookTimeValue)
    : null;

  const servings = servingsValue
    ? Number(servingsValue)
    : null;

  if (
    (prepTime !== null &&
      (!Number.isFinite(prepTime) || prepTime < 0)) ||
    (cookTime !== null &&
      (!Number.isFinite(cookTime) || cookTime < 0)) ||
    (servings !== null &&
      (!Number.isFinite(servings) || servings < 1))
  ) {
    throw new Error("Invalid numeric values.");
  }

  // ------------------------------------------------
  // Demo user
  // ------------------------------------------------

  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("You must be signed in to create a recipe.");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  // ------------------------------------------------
  // Validate category
  // ------------------------------------------------

  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  if (!category) {
    throw new Error("Category not found.");
  }

  // ------------------------------------------------
  // Create Recipe + Ingredients in transaction
  // ------------------------------------------------

  const recipe = await prisma.$transaction(
    async (tx) => {
      const newRecipe = await tx.recipe.create({
        data: {
          titleEn,
          titleZh,

          descriptionEn:
            descriptionEn || null,

          descriptionZh:
            descriptionZh || null,

          instructionsEn,
          instructionsZh,

          prepTime,
          cookTime,
          servings,

          imageUrl:
            imageUrl || null,

          userId: user.id,
          categoryId,
        },
      });

      for (const item of validIngredients) {
        const nameEn = item.nameEn.trim();
        const nameZh = item.nameZh.trim();
        const unit = item.unit.trim();

        const quantityValue =
          item.quantity.trim() !== ""
            ? Number(item.quantity)
            : null;

        if (
          quantityValue !== null &&
          (!Number.isFinite(quantityValue) ||
            quantityValue < 0)
        ) {
          throw new Error(
            `Invalid quantity for ingredient: ${nameEn}`,
          );
        }

        const ingredient =
          await tx.ingredient.upsert({
            where: {
              nameEn,
            },
            update: {
              nameZh,
            },
            create: {
              nameEn,
              nameZh,
            },
          });

        await tx.recipeIngredient.create({
          data: {
            recipeId: newRecipe.id,
            ingredientId: ingredient.id,

            quantity: quantityValue,

            unit:
              unit || null,
          },
        });
      }

      return newRecipe;
    },
  );

  // ------------------------------------------------
  // Redirect to new recipe
  // ------------------------------------------------

  redirect(`/recipes/${recipe.id}`);
}