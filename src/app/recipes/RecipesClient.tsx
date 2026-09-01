"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { translations } from "@/lib/i18n";
import Image from "next/image";

type Recipe = {
  id: string;

  imageUrl: string | null;

  titleZh: string;
  titleEn: string;

  descriptionZh: string | null;
  descriptionEn: string | null;

  prepTime: number | null;
  cookTime: number | null;
  servings: number | null;

  category: {
    nameZh: string;
    nameEn: string;
  } | null;

  ingredients: {
    ingredient: {
      nameZh: string;
      nameEn: string;
    };
  }[];
};

type RecipesClientProps = {
  recipes: Recipe[];
};

export default function RecipesClient({
  recipes,
}: RecipesClientProps) {
  const language = useLanguage();
  const t = translations[language];

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("all");

  const categories = useMemo(() => {
    const unique = new Map<
      string,
      {
        nameEn: string;
        nameZh: string;
      }
    >();

    recipes.forEach((recipe) => {
      if (!recipe.category) {
        return;
      }

      unique.set(recipe.category.nameEn, recipe.category);
    });

    return Array.from(unique.values());
  }, [recipes]);

  const filteredRecipes = useMemo(() => {
    const query = search.trim().toLowerCase();

    return recipes.filter((recipe) => {
      const matchesCategory =
        selectedCategory === "all" ||
        recipe.category?.nameEn === selectedCategory;

      const matchesIngredient =
        recipe.ingredients.some(({ ingredient }) => {
          return (
            ingredient.nameEn
              .toLowerCase()
              .includes(query) ||
            ingredient.nameZh
              .toLowerCase()
              .includes(query)
          );
        });

      const matchesSearch =
        query.length === 0 ||
        recipe.titleEn.toLowerCase().includes(query) ||
        recipe.titleZh.toLowerCase().includes(query) ||
        recipe.descriptionEn
          ?.toLowerCase()
          .includes(query) ||
        recipe.descriptionZh
          ?.toLowerCase()
          .includes(query) ||
        matchesIngredient;

      return matchesCategory && matchesSearch;
    });
  }, [recipes, search, selectedCategory]);

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-zinc-900">
            {t.recipes}
          </h1>

          <p className="mt-2 text-zinc-600">
            {t.recipesSubtitle}
          </p>
        </div>

        <div className="mb-8 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder={t.searchRecipes}
            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-500 sm:flex-1"
          />

          <select
            value={selectedCategory}
            onChange={(event) =>
              setSelectedCategory(event.target.value)
            }
            className="rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-500"
          >
            <option value="all">
              {t.allCategories}
            </option>

            {categories.map((category) => (
              <option
                key={category.nameEn}
                value={category.nameEn}
              >
                {language === "zh"
                  ? category.nameZh
                  : category.nameEn}
              </option>
            ))}
          </select>
        </div>

        {filteredRecipes.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 bg-white px-6 py-12 text-center text-zinc-500">
            {t.noRecipesFound}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRecipes.map((recipe) => {
              const title =
                language === "zh"
                  ? recipe.titleZh
                  : recipe.titleEn;

              const description =
                language === "zh"
                  ? recipe.descriptionZh
                  : recipe.descriptionEn;

              const category =
                language === "zh"
                  ? recipe.category?.nameZh
                  : recipe.category?.nameEn;

              return (
                <article
                  key={recipe.id}
                  className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  {recipe.imageUrl && (
                    <div className="relative mb-5 aspect-[4/3] overflow-hidden rounded-xl bg-zinc-100">
                      <Image
                        src={recipe.imageUrl}
                        alt={title}
                        fill
                        className="object-cover transition duration-300 hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-600">
                      {category ??
                        (language === "zh"
                          ? "未分类"
                          : "Uncategorised")}
                    </span>

                    <span className="text-sm text-zinc-500">
                      {(recipe.prepTime ?? 0) +
                        (recipe.cookTime ?? 0)}{" "}
                      min
                    </span>
                  </div>

                  <h2 className="text-xl font-semibold text-zinc-900">
                    {title}
                  </h2>

                  {description && (
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-600">
                      {description}
                    </p>
                  )}

                  <div className="mt-6 flex items-center justify-between text-sm text-zinc-500">
                    <span>
                      {recipe.servings ?? "-"}{" "}
                      {language === "zh"
                        ? "份"
                        : "servings"}
                    </span>

                    <Link
                      href={`/recipes/${recipe.id}`}
                      className="font-medium text-zinc-700 hover:text-zinc-950"
                    >
                      {t.viewRecipe} →
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}