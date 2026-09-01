"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function rateRecipe(
  recipeId: string,
  score: number,
) {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("You must be signed in.");
  }

  if (
    !Number.isInteger(score) ||
    score < 1 ||
    score > 5
  ) {
    throw new Error("Invalid rating.");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  const recipe = await prisma.recipe.findUnique({
    where: {
      id: recipeId,
    },
    select: {
      id: true,
    },
  });

  if (!recipe) {
    throw new Error("Recipe not found.");
  }

  await prisma.rating.upsert({
    where: {
      userId_recipeId: {
        userId: user.id,
        recipeId,
      },
    },

    update: {
      score,
    },

    create: {
      userId: user.id,
      recipeId,
      score,
    },
  });

  revalidatePath(`/recipes/${recipeId}`);
}