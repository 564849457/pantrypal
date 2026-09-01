"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

import { redirect } from "next/navigation";
import { revalidateTag } from "next/cache";

export async function deleteRecipe(
  recipeId: string,
) {
  // ---------------------------------------------
  // Authentication
  // ---------------------------------------------

  const session = await auth();

  if (!session?.user?.email) {
    throw new Error(
      "You must be signed in.",
    );
  }

  // ---------------------------------------------
  // Current user
  // ---------------------------------------------

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

  // ---------------------------------------------
  // Recipe
  // ---------------------------------------------

  const recipe = await prisma.recipe.findUnique({
    where: {
      id: recipeId,
    },

    select: {
      id: true,
      userId: true,
    },
  });

  if (!recipe) {
    throw new Error("Recipe not found.");
  }

  // ---------------------------------------------
  // Ownership
  // ---------------------------------------------

  if (recipe.userId !== user.id) {
    throw new Error(
      "You are not allowed to delete this recipe.",
    );
  }

  // ---------------------------------------------
  // Delete
  // ---------------------------------------------

  await prisma.recipe.delete({
    where: {
      id: recipeId,
    },
  });

  // ---------------------------------------------
  // Clear cache
  // ---------------------------------------------

  revalidateTag("recipes", "max");

  // ---------------------------------------------
  // Redirect
  // ---------------------------------------------

  redirect("/recipes");
}