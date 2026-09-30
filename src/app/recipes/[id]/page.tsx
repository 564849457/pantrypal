import { javaApiEnabled, javaRecipeAccess } from "@/lib/java-session";
import { readRecipe } from "@/lib/recipe-reader";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import RecipeDetailClient from "./RecipeDetailClient";

type RecipePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function RecipePage({ params }: RecipePageProps) {
  const { id } = await params;

  // ------------------------------------------------
  // Recipe
  // ------------------------------------------------

  const recipe = await readRecipe(id);

  if (!recipe) {
    notFound();
  }

  // ------------------------------------------------
  // Current user
  // ------------------------------------------------

  const session = await auth();

  let isOwner = false;
  let isFavorited = false;
  let userRating: number | null = null;

  let isLoggedIn = Boolean(session?.user);
  if (javaApiEnabled) {
    const access = await javaRecipeAccess(id);
    isLoggedIn = access !== null;
    if (access) ({ isOwner, isFavorited, userRating } = access);
  } else if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },

      select: {
        id: true,
      },
    });

    if (user) {
      // Owner
      isOwner = user.id === recipe.userId;

      // Favorite
      const favorite = await prisma.favorite.findUnique({
        where: {
          userId_recipeId: {
            userId: user.id,
            recipeId: recipe.id,
          },
        },
      });

      isFavorited = Boolean(favorite);

      // Current user's rating
      const rating = await prisma.rating.findUnique({
        where: {
          userId_recipeId: {
            userId: user.id,
            recipeId: recipe.id,
          },
        },
      });

      userRating = rating?.score ?? null;
    }
  }

  // ------------------------------------------------
  // Rating statistics
  // ------------------------------------------------

  const { ratingCount, averageRating } = recipe;

  // ------------------------------------------------
  // Client
  // ------------------------------------------------

  return (
    <RecipeDetailClient
      recipe={recipe}
      isOwner={isOwner}
      isLoggedIn={isLoggedIn}
      isFavorited={isFavorited}
      averageRating={averageRating}
      ratingCount={ratingCount}
      userRating={userRating}
    />
  );
}
