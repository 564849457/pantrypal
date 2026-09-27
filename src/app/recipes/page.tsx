import { unstable_cache } from "next/cache";

import { readRecipes } from "@/lib/recipe-reader";
import RecipesClient from "./RecipesClient";

const getRecipes = unstable_cache(
  async () => readRecipes(),
  ["recipes-list", process.env.RECIPE_API_URL || "prisma"],
  {
    revalidate: 300,
    tags: ["recipes"],
  },
);

export default async function RecipesPage() {
  const recipes = await getRecipes();

  return <RecipesClient recipes={recipes} />;
}
