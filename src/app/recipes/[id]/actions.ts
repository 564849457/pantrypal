"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function deleteRecipe(recipeId: string) {
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

  const recipe = await prisma.recipe.findUnique({
    where: {
      id: recipeId,
    },
  });

  if (!recipe) {
    throw new Error("Recipe not found.");
  }

  if (recipe.userId !== user.id) {
    throw new Error(
      "You are not allowed to delete this recipe.",
    );
  }

  await prisma.recipe.delete({
    where: {
      id: recipeId,
    },
  });

  redirect("/recipes");
}