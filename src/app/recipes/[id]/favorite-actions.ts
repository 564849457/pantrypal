"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleFavorite(recipeId: string) {
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

  const existingFavorite = await prisma.favorite.findUnique({
    where: {
      userId_recipeId: {
        userId: user.id,
        recipeId,
      },
    },
  });

  if (existingFavorite) {
    await prisma.favorite.delete({
      where: {
        id: existingFavorite.id,
      },
    });
  } else {
    await prisma.favorite.create({
      data: {
        userId: user.id,
        recipeId,
      },
    });
  }

  revalidatePath(`/recipes/${recipeId}`);
  revalidatePath("/favorites");
}