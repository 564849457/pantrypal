import { unstable_cache } from "next/cache";

import prisma from "@/lib/prisma";
import RecipesClient from "./RecipesClient";

const getRecipes = unstable_cache(
  async () => {
    return prisma.recipe.findMany({
      include: {
        category: true,

        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  },
  ["recipes-list"],
  {
    revalidate: 300,
    tags: ["recipes"],
  },
);

export default async function RecipesPage() {
  const recipes = await getRecipes();

  return <RecipesClient recipes={recipes} />;
}