import { unstable_cache } from "next/cache";

import prisma from "@/lib/prisma";
import HomeClient from "./HomeClient";

const getFeaturedRecipes = unstable_cache(
  async () => {
    return prisma.recipe.findMany({
      include: {
        category: true,
      },

      orderBy: {
        createdAt: "desc",
      },

      take: 3,
    });
  },
  ["home-featured-recipes"],
  {
    revalidate: 300,
    tags: ["recipes"],
  },
);

export default async function HomePage() {
  const recipes = await getFeaturedRecipes();

  return <HomeClient recipes={recipes} />;
}