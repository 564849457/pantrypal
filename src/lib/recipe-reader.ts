import "server-only";
import type { CatalogQuery } from "@/lib/recipe-query";
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


export type RecipeCategory = { id: string; nameZh: string; nameEn: string };

export async function readRecipePage(query: CatalogQuery) {
  const { q, category, page, size } = query;
  if (baseUrl) {
    const params = new URLSearchParams({
      q,
      category,
      page: String(page),
      size: String(size),
    });
    const result = await api<RecipePage>(`?${params}`);
    if (!result || !Array.isArray(result.items))
      throw new Error("Invalid recipe API response");
    return result;
  }
  // Prisma/Postgres contains uses LIKE: escape wildcard characters so search
  // has the same literal substring meaning as the Java API's strpos query.
  const contains = q.replace(/[\\%_]/g, "\\$&");
  const text = { contains, mode: "insensitive" as const };
  const rows = await prisma.recipe.findMany({
    where: {
      ...(category ? { categoryId: category } : {}),
      ...(q
        ? {
            OR: [
              { titleZh: text },
              { titleEn: text },
              { descriptionZh: text },
              { descriptionEn: text },
              {
                category: { is: { OR: [{ nameZh: text }, { nameEn: text }] } },
              },
              {
                ingredients: {
                  some: {
                    ingredient: { OR: [{ nameZh: text }, { nameEn: text }] },
                  },
                },
              },
            ],
          }
        : {}),
    },
    include: { category: true, ingredients: { include: { ingredient: true } } },
    orderBy: [{ createdAt: "desc" }, { id: "asc" }],
    skip: page * size,
    take: size + 1,
  });
  return {
    items: rows.slice(0, size),
    page,
    size,
    hasNext: rows.length > size,
  };
}

export async function readRecipeCategories(): Promise<RecipeCategory[]> {
  if (baseUrl) {
    const result = await api<RecipeCategory[]>("/categories");
    if (!Array.isArray(result))
      throw new Error(
        "Recipe API categories unavailable; update the Java backend first",
      );
    return result;
  }
  return prisma.category.findMany({
    where: { recipes: { some: {} } },
    select: { id: true, nameZh: true, nameEn: true },
    orderBy: [{ nameEn: "asc" }, { id: "asc" }],
  });
}

export async function readRecipes(limit = 3) {
  return (
    await readRecipePage({
      q: "",
      category: "",
      page: 0,
      size: Math.min(100, Math.max(1, limit)),
    })
  ).items;
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
