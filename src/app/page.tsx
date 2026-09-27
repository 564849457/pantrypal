import { unstable_cache } from "next/cache";

import { readRecipes } from "@/lib/recipe-reader";
import HomeClient from "./HomeClient";

const getFeaturedRecipes = unstable_cache(
  async () => readRecipes(3),
  ["home-featured-recipes", process.env.RECIPE_API_URL || "prisma"],
  {
    revalidate: 300,
    tags: ["recipes"],
  },
);

export default async function HomePage() {
  const recipes = await getFeaturedRecipes();

  return <HomeClient recipes={recipes} />;
}
