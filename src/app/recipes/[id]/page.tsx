import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import RecipeDetailClient from "./RecipeDetailClient";

type RecipePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function RecipePage({
  params,
}: RecipePageProps) {
  const { id } = await params;

  // ------------------------------------------------
  // Recipe
  // ------------------------------------------------

  const recipe = await prisma.recipe.findUnique({
    where: {
      id,
    },

    include: {
      category: true,

      ingredients: {
        include: {
          ingredient: true,
        },
      },

      ratings: true,
    },
  });

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

  if (session?.user?.email) {
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
      const favorite =
        await prisma.favorite.findUnique({
          where: {
            userId_recipeId: {
              userId: user.id,
              recipeId: recipe.id,
            },
          },
        });

      isFavorited = Boolean(favorite);

      // Current user's rating
      const rating =
        await prisma.rating.findUnique({
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

  const ratingCount = recipe.ratings.length;

  const averageRating =
    ratingCount > 0
      ? recipe.ratings.reduce(
          (total, rating) =>
            total + rating.score,
          0,
        ) / ratingCount
      : 0;

  // ------------------------------------------------
  // Client
  // ------------------------------------------------

  return (
    <RecipeDetailClient
      recipe={recipe}
      isOwner={isOwner}
      isLoggedIn={Boolean(session?.user)}
      isFavorited={isFavorited}
      averageRating={averageRating}
      ratingCount={ratingCount}
      userRating={userRating}
    />
  );
}