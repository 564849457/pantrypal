"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { useLanguage } from "@/hooks/useLanguage";
import SparkCanvasBackground from "@/components/SparkCanvasBackground";
import BurnRecipeLink from "@/components/BurnRecipeLink";

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
    id: string;

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

  const [searchTerm, setSearchTerm] =
    useState("");

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("all");

  const content = {
    en: {
      eyebrow: "Discover & cook",
      title: "Recipes",

      subtitle:
        "Browse, search and discover recipes from the PantryPal community.",

      searchPlaceholder:
        "Search recipes, descriptions or ingredients...",

      allCategories:
        "All categories",

      addRecipe:
        "Add recipe",

      viewRecipe:
        "View recipe",

      minutes:
        "min",

      servings:
        "servings",

      noRecipes:
        "No recipes found.",

      noRecipesSubtitle:
        "Try changing your search or category filter.",

      results:
        "recipes",
    },

    zh: {
      eyebrow:
        "发现你的下一道料理",

      title:
        "菜谱",

      subtitle:
        "浏览、搜索并发现 PantryPal 社区中的菜谱。",

      searchPlaceholder:
        "搜索菜谱、描述或食材...",

      allCategories:
        "全部分类",

      addRecipe:
        "新增菜谱",

      viewRecipe:
        "查看菜谱",

      minutes:
        "分钟",

      servings:
        "份",

      noRecipes:
        "没有找到菜谱。",

      noRecipesSubtitle:
        "尝试修改搜索内容或分类筛选。",

      results:
        "个菜谱",
    },
  } as const;

  const t =
    content[language];

  // ---------------------------------------------
  // Categories
  // ---------------------------------------------

  const categories =
    useMemo(() => {
      const categoryMap =
        new Map<
          string,
          {
            value: string;
            label: string;
          }
        >();

      recipes.forEach(
        (recipe) => {
          if (!recipe.category) {
            return;
          }

          const value =
            recipe.category
              .nameEn;

          const label =
            language === "zh"
              ? recipe.category
                  .nameZh
              : recipe.category
                  .nameEn;

          categoryMap.set(
            value,
            {
              value,
              label,
            },
          );
        },
      );

      return Array.from(
        categoryMap.values(),
      );
    }, [
      recipes,
      language,
    ]);

  // ---------------------------------------------
  // Filtered recipes
  // ---------------------------------------------

  const filteredRecipes =
    useMemo(() => {
      const search =
        searchTerm
          .trim()
          .toLowerCase();

      return recipes.filter(
        (recipe) => {
          const matchesCategory =
            selectedCategory ===
              "all" ||
            recipe.category
              ?.nameEn ===
              selectedCategory;

          if (
            !matchesCategory
          ) {
            return false;
          }

          if (!search) {
            return true;
          }

          const searchableValues =
            [
              recipe.titleEn,
              recipe.titleZh,

              recipe.descriptionEn ??
                "",

              recipe.descriptionZh ??
                "",

              recipe.category
                ?.nameEn ??
                "",

              recipe.category
                ?.nameZh ??
                "",

              ...recipe.ingredients.flatMap(
                (item) => [
                  item
                    .ingredient
                    .nameEn,

                  item
                    .ingredient
                    .nameZh,
                ],
              ),
            ];

          return searchableValues.some(
            (value) =>
              value
                .toLowerCase()
                .includes(
                  search,
                ),
          );
        },
      );
    }, [
      recipes,
      searchTerm,
      selectedCategory,
    ]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* =========================================
          GLOBAL FIRE BACKGROUND
      ========================================== */}

      <div className="pointer-events-none fixed inset-0 z-0">
        <SparkCanvasBackground />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_8%,rgba(255,125,25,0.17),transparent_28%),radial-gradient(circle_at_10%_70%,rgba(255,70,0,0.07),transparent_28%)]" />

        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/20 to-black/40" />
      </div>

      {/* =========================================
          PAGE
      ========================================== */}

      <section className="relative z-10">
        <div className="mx-auto max-w-6xl px-6 py-14 sm:py-16">
          {/* Header */}

          <div className="flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <span className="h-px w-7 bg-orange-400" />

                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-300/80">
                  {
                    t.eyebrow
                  }
                </p>
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                {t.title}
              </h1>

              <p className="mt-3 max-w-xl text-zinc-400">
                {
                  t.subtitle
                }
              </p>
            </div>

            {/* Add Recipe */}

            <Link
              href="/recipes/new"
              className="group inline-flex w-fit items-center gap-2 rounded-xl border border-orange-300/20 bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_0_25px_rgba(249,115,22,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-orange-400 hover:shadow-[0_0_35px_rgba(249,115,22,0.32)]"
            >
              <span className="text-lg leading-none">
                +
              </span>

              {
                t.addRecipe
              }

              <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </div>

          {/* =====================================
              FILTERS
          ====================================== */}

          <div className="mt-9 rounded-2xl border border-white/10 bg-zinc-950/55 p-4 shadow-xl backdrop-blur-xl">
            <div className="flex flex-col gap-3 md:flex-row">
              {/* Search */}

              <div className="relative flex-1">
                <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-4 w-4 text-zinc-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle
                      cx="11"
                      cy="11"
                      r="7"
                    />

                    <path d="m20 20-3.5-3.5" />
                  </svg>
                </div>

                <input
                  type="search"
                  value={
                    searchTerm
                  }
                  onChange={(
                    event,
                  ) =>
                    setSearchTerm(
                      event
                        .target
                        .value,
                    )
                  }
                  placeholder={
                    t.searchPlaceholder
                  }
                  aria-label={
                    t.searchPlaceholder
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/[0.05] py-3 pl-11 pr-4 text-sm text-white outline-none backdrop-blur-xl transition placeholder:text-zinc-500 hover:bg-white/[0.07] focus:border-orange-400/40 focus:bg-white/[0.08] focus:ring-2 focus:ring-orange-500/10"
                />
              </div>

              {/* Category */}

              <select
                value={
                  selectedCategory
                }
                onChange={(
                  event,
                ) =>
                  setSelectedCategory(
                    event
                      .target
                      .value,
                  )
                }
                aria-label={
                  t.allCategories
                }
                className="min-w-[180px] cursor-pointer rounded-xl border border-white/10 bg-[#171310] px-4 py-3 text-sm font-medium text-zinc-300 outline-none transition hover:border-orange-300/20 hover:bg-[#211914] focus:border-orange-400/40 focus:ring-2 focus:ring-orange-500/10"
              >
                <option value="all">
                  {
                    t.allCategories
                  }
                </option>

                {categories.map(
                  (
                    category,
                  ) => (
                    <option
                      key={
                        category.value
                      }
                      value={
                        category.value
                      }
                    >
                      {
                        category.label
                      }
                    </option>
                  ),
                )}
              </select>
            </div>
          </div>

          {/* Results */}

          <div className="mt-7 flex items-center justify-between">
            <p className="text-sm text-zinc-500">
              <span className="font-medium text-zinc-300">
                {
                  filteredRecipes.length
                }
              </span>{" "}
              {t.results}
            </p>
          </div>

          {/* =====================================
              RECIPE GRID
          ====================================== */}

          {filteredRecipes.length >
          0 ? (
            <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredRecipes.map(
                (recipe) => {
                  const title =
                    language ===
                    "zh"
                      ? recipe.titleZh
                      : recipe.titleEn;

                  const description =
                    language ===
                    "zh"
                      ? recipe
                          .descriptionZh
                      : recipe
                          .descriptionEn;

                  const category =
                    language ===
                    "zh"
                      ? recipe
                          .category
                          ?.nameZh
                      : recipe
                          .category
                          ?.nameEn;

                  const totalTime =
                    (recipe.prepTime ??
                      0) +
                    (recipe.cookTime ??
                      0);

                  const recipeHref =
                    `/recipes/${recipe.id}`;

                  return (
                    <article
                      key={recipe.id}
                      data-recipe-card
                      className="group relative isolate overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/70 shadow-xl backdrop-blur-md transition duration-300 hover:border-orange-400/30 hover:shadow-[0_18px_50px_rgba(80,30,5,0.28)]"
                    >
                      {/* =====================================================
                          FULL CARD CLICK AREA
                          点击卡片任意位置都会触发燃烧
                      ====================================================== */}

                      <BurnRecipeLink
                        href={recipeHref}
                        className="absolute inset-0 z-30"
                      >
                        <span className="sr-only">
                          {t.viewRecipe}: {title}
                        </span>
                      </BurnRecipeLink>

                      {/* =====================================================
                          HOVER GLOW
                      ====================================================== */}

                      <div className="pointer-events-none absolute -inset-10 z-0 bg-orange-500/0 blur-3xl transition duration-500 group-hover:bg-orange-500/[0.06]" />

                      <div className="pointer-events-none absolute inset-x-10 top-0 z-20 h-px bg-gradient-to-r from-transparent via-orange-300/0 to-transparent transition duration-500 group-hover:via-orange-300/50" />

                      {/* =====================================================
                          IMAGE
                      ====================================================== */}

                      {recipe.imageUrl && (
                        <div className="relative z-10 aspect-[4/3] overflow-hidden bg-zinc-900">
                          <Image
                            src={recipe.imageUrl}
                            alt={title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition duration-700 group-hover:scale-[1.045]"
                          />

                          {/* dark fade */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

                          {/* warm hover */}
                          <div className="absolute inset-0 bg-orange-500/0 transition duration-500 group-hover:bg-orange-500/[0.04]" />
                        </div>
                      )}

                      {/* =====================================================
                          CONTENT
                      ====================================================== */}

                      <div className="relative z-10 p-5">
                        {/* Meta */}

                        <div className="flex items-center justify-between gap-3">
                          <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-medium text-zinc-300 backdrop-blur-xl transition duration-300 group-hover:border-orange-300/20 group-hover:bg-orange-500/[0.07]">
                            {category ??
                              (language === "zh"
                                ? "未分类"
                                : "Uncategorised")}
                          </span>

                          {totalTime > 0 && (
                            <span className="whitespace-nowrap text-xs text-zinc-500 transition duration-300 group-hover:text-zinc-400">
                              {totalTime} {t.minutes}
                            </span>
                          )}
                        </div>

                        {/* Title */}

                        <h2 className="mt-4 text-xl font-semibold tracking-tight text-white transition duration-300 group-hover:text-orange-50">
                          {title}
                        </h2>

                        {/* Description */}

                        {description && (
                          <p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-zinc-400">
                            {description}
                          </p>
                        )}

                        {/* Footer */}

                        <div className="mt-5 flex items-center justify-between gap-4">
                          {recipe.servings ? (
                            <span className="text-xs text-zinc-500">
                              {recipe.servings} {t.servings}
                            </span>
                          ) : (
                            <span />
                          )}

                          {/* 这里只做视觉，不再单独套 Link */}
                          <span className="group/link inline-flex items-center gap-1 text-sm font-semibold text-zinc-300 transition duration-300 group-hover:text-orange-300">
                            {t.viewRecipe}

                            <span className="transition-transform duration-300 group-hover:translate-x-1">
                              →
                            </span>
                          </span>
                        </div>
                      </div>

                      {/* =====================================================
                          BOTTOM GLOW
                      ====================================================== */}

                      <div className="pointer-events-none absolute inset-x-10 bottom-0 z-20 h-px bg-gradient-to-r from-transparent via-orange-500/0 to-transparent transition duration-500 group-hover:via-orange-500/30" />
                    </article>
                  );
                },
              )}
            </div>
          ) : (
            /* Empty state */

            <div className="mt-12 rounded-3xl border border-white/10 bg-zinc-950/60 px-6 py-20 text-center backdrop-blur-xl">
              <div className="mx-auto h-2 w-2 rounded-full bg-orange-400 shadow-[0_0_22px_6px_rgba(251,146,60,0.45)]" />

              <h2 className="mt-7 text-xl font-semibold text-white">
                {
                  t.noRecipes
                }
              </h2>

              <p className="mt-2 text-sm text-zinc-400">
                {
                  t.noRecipesSubtitle
                }
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}