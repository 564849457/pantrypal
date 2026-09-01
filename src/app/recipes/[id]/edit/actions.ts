"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

type IngredientInput = {
  nameEn: string;
  nameZh: string;
  quantity: string;
  unit: string;
};

export async function updateRecipe(
  recipeId: string,
  formData: FormData,
) {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("You must be signed in.");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  const existingRecipe = await prisma.recipe.findUnique({
    where: {
      id: recipeId,
    },
  });

  if (!existingRecipe) {
    throw new Error("Recipe not found.");
  }

  if (existingRecipe.userId !== user.id) {
    throw new Error(
      "You are not allowed to edit this recipe.",
    );
  }

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

  if (
    !titleEn ||
    !titleZh ||
    !instructionsEn ||
    !instructionsZh ||
    !categoryId
  ) {
    throw new Error("Missing required fields.");
  }

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

  const prepTime = prepTimeValue
    ? Number(prepTimeValue)
    : null;

  const cookTime = cookTimeValue
    ? Number(cookTimeValue)
    : null;

  const servings = servingsValue
    ? Number(servingsValue)
    : null;

  await prisma.$transaction(async (tx) => {
    await tx.recipe.update({
      where: {
        id: recipeId,
      },
      data: {
        titleEn,
        titleZh,

        descriptionEn:
          descriptionEn || null,

        descriptionZh:
          descriptionZh || null,

        instructionsEn,
        instructionsZh,

        categoryId,

        prepTime,
        cookTime,
        servings,

        imageUrl:
          imageUrl || null,
      },
    });

    await tx.recipeIngredient.deleteMany({
      where: {
        recipeId,
      },
    });

    for (const item of validIngredients) {
      const nameEn = item.nameEn.trim();
      const nameZh = item.nameZh.trim();

      const quantity =
        item.quantity.trim() !== ""
          ? Number(item.quantity)
          : null;

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
          recipeId,
          ingredientId: ingredient.id,
          quantity,
          unit: item.unit.trim() || null,
        },
      });
    }
  });

  redirect(`/recipes/${recipeId}`);
}