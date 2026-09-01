import prisma from "@/lib/prisma";
import RecipesClient from "./RecipesClient";

export default async function RecipesPage() {
  const recipes = await prisma.recipe.findMany({
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

  return <RecipesClient recipes={recipes} />;
}