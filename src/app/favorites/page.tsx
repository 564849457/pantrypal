import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import RecipesClient from "../recipes/RecipesClient";

export default async function FavoritesPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/api/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    redirect("/api/auth/signin");
  }

  const favorites = await prisma.favorite.findMany({
    where: {
      userId: user.id,
    },
    include: {
      recipe: {
        include: {
          category: true,
          ingredients: {
            include: {
              ingredient: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const recipes = favorites.map(
    (favorite) => favorite.recipe,
  );

  return <RecipesClient recipes={recipes} />;
}