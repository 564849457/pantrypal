import "server-only";
import prisma from "@/lib/prisma";
import type { RecipeCardData } from "@/components/RecipeCard";

type Recipe = RecipeCardData & {
  userId: string;
  instructionsZh: string;
  instructionsEn: string;
  servings: number | null;
  ingredients: {
    id: string;
    quantity: number | null;
    unit: string | null;
    ingredient: { id: string; nameZh: string; nameEn: string };
  }[];
  averageRating: number;
  ratingCount: number;
};
type RecipePage = {
  items: Recipe[];
  page: number;
  size: number;
  hasNext: boolean;
};
const baseUrl = process.env.RECIPE_API_URL?.replace(/\/$/, "");

async function api<T>(path: string): Promise<T | null> {
  const response = await fetch(`${baseUrl}/api/v1/recipes${path}`, {
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Recipe API returned ${response.status}`);
  return response.json() as Promise<T>;
}

export async function readRecipes(limit?: number) {
  if (!baseUrl) {
    return prisma.recipe.findMany({
      include: {
        category: true,
        ingredients: { include: { ingredient: true } },
      },
      orderBy: [{ createdAt: "desc" }, { id: "asc" }],
      take: limit,
    });
  }
  // The current UI filters locally, so load all pages instead of silently
  // hiding recipes beyond the API's first page. Move filters server-side later.
  const recipes: Recipe[] = [];
  const size = limit ? Math.min(limit, 100) : 100;
  for (let page = 0; page <= 100000; page++) {
    const result = await api<RecipePage>(`?page=${page}&size=${size}`);
    if (!result || !Array.isArray(result.items))
      throw new Error("Invalid recipe API response");
    recipes.push(...result.items);
    if (!result.hasNext || (limit && recipes.length >= limit)) {
      return limit ? recipes.slice(0, limit) : recipes;
    }
  }
  throw new Error("Recipe API pagination limit exceeded");
}

export async function readRecipe(id: string): Promise<Recipe | null> {
  if (baseUrl) return api<Recipe>(`/${encodeURIComponent(id)}`);
  const recipe = await prisma.recipe.findUnique({
    where: { id },
    include: {
      category: true,
      ingredients: { include: { ingredient: true } },
      ratings: { select: { score: true } },
    },
  });
  if (!recipe) return null;
  const { ratings, ...data } = recipe;
  return {
    ...data,
    ratingCount: ratings.length,
    averageRating: ratings.length
      ? ratings.reduce((total, rating) => total + rating.score, 0) /
        ratings.length
      : 0,
  };
}
