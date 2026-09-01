import type { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://pantrypal-neon-rho.vercel.app";

  const recipes = await prisma.recipe.findMany({
    select: {
      id: true,
      updatedAt: true,
    },
  });

  const recipePages: MetadataRoute.Sitemap =
    recipes.map((recipe) => ({
      url: `${baseUrl}/recipes/${recipe.id}`,
      lastModified: recipe.updatedAt,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },

    {
      url: `${baseUrl}/recipes`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },

    ...recipePages,
  ];
}