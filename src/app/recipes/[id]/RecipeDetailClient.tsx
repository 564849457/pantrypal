"use client";

import Image from "next/image";
import Link from "next/link";

import { useLanguage } from "@/hooks/useLanguage";
import { translations } from "@/lib/i18n";

import DeleteRecipeButton from "./DeleteRecipeButton";
import FavoriteButton from "./FavoriteButton";
import RatingStars from "./RatingStars";

import SparkCanvasBackground from "@/components/SparkCanvasBackground";

type RecipeDetail = {
  id: string;

  imageUrl: string | null;

  titleZh: string;
  titleEn: string;

  descriptionZh: string | null;
  descriptionEn: string | null;

  instructionsZh: string;
  instructionsEn: string;

  prepTime: number | null;
  cookTime: number | null;
  servings: number | null;

  category: {
    nameZh: string;
    nameEn: string;
  } | null;

  ingredients: {
    id: string;
    quantity: number | null;
    unit: string | null;

    ingredient: {
      nameZh: string;
      nameEn: string;
    };
  }[];
};

type RecipeDetailClientProps = {
  recipe: RecipeDetail;
  isOwner: boolean;
  isLoggedIn: boolean;
  isFavorited: boolean;

  averageRating: number;
  ratingCount: number;
  userRating: number | null;
};

export default function RecipeDetailClient({
  recipe,
  isOwner,
  isLoggedIn,
  isFavorited,
  averageRating,
  ratingCount,
  userRating,
}: RecipeDetailClientProps) {
  const language = useLanguage();
  const t = translations[language];

  const title =
    language === "zh"
      ? recipe.titleZh
      : recipe.titleEn;

  const description =
    language === "zh"
      ? recipe.descriptionZh
      : recipe.descriptionEn;

  const instructions =
    language === "zh"
      ? recipe.instructionsZh
      : recipe.instructionsEn;

  const category =
    language === "zh"
      ? recipe.category?.nameZh
      : recipe.category?.nameEn;

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <SparkCanvasBackground />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(255,125,25,0.16),transparent_30%),radial-gradient(circle_at_15%_75%,rgba(255,70,0,0.07),transparent_28%)]" />

        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/25 to-black/45" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 py-10 sm:py-14">
        {/* Back */}
        <Link
          href="/recipes"
          className="group inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-zinc-400 transition hover:bg-white/10 hover:text-white"
        >
          <span className="transition-transform group-hover:-translate-x-1">
            ←
          </span>

          {t.backToRecipes}
        </Link>

        {/* Main Card */}
        <article className="mt-6 overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950/70 shadow-2xl shadow-black/50 backdrop-blur-xl">
          {/* Hero image */}
          {recipe.imageUrl && (
            <div className="relative aspect-[16/9] overflow-hidden bg-zinc-900">
              <Image
                src={recipe.imageUrl}
                alt={title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 960px"
                className="object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-black/15 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-zinc-950 to-transparent" />
            </div>
          )}

          <div className="p-6 sm:p-8 lg:p-10">
            {/* Header */}
            <div className="flex flex-col gap-7 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 flex-1">
                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-orange-400/20 bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-200">
                    {category ??
                      (language === "zh"
                        ? "未分类"
                        : "Uncategorised")}
                  </span>

                  {recipe.prepTime !== null && (
                    <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs text-zinc-400">
                      {t.prep}: {recipe.prepTime} min
                    </span>
                  )}

                  {recipe.cookTime !== null && (
                    <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs text-zinc-400">
                      {t.cook}: {recipe.cookTime} min
                    </span>
                  )}

                  {recipe.servings !== null && (
                    <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs text-zinc-400">
                      {t.servings}: {recipe.servings}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                  {title}
                </h1>

                {/* Description */}
                {description && (
                  <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-400">
                    {description}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex shrink-0 flex-wrap items-center gap-2">
                <FavoriteButton
                  recipeId={recipe.id}
                  initialFavorited={isFavorited}
                  isLoggedIn={isLoggedIn}
                />

                {isOwner && (
                  <>
                    <Link
                      href={`/recipes/${recipe.id}/edit`}
                      className="rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2.5 text-sm font-medium text-zinc-300 backdrop-blur-xl transition hover:border-orange-300/30 hover:bg-white/10 hover:text-white"
                    >
                      {language === "zh"
                        ? "编辑菜谱"
                        : "Edit recipe"}
                    </Link>

                    <DeleteRecipeButton
                      recipeId={recipe.id}
                    />
                  </>
                )}
              </div>
            </div>

            {/* Rating */}
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
              <RatingStars
                recipeId={recipe.id}
                averageRating={averageRating}
                ratingCount={ratingCount}
                userRating={userRating}
                isLoggedIn={isLoggedIn}
              />
            </div>

            {/* Content grid */}
            <div className="mt-10 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
              {/* Ingredients */}
              <section>
                <div className="mb-5 flex items-center gap-3">
                  <span className="h-px w-6 bg-orange-400" />

                  <h2 className="text-2xl font-semibold text-white">
                    {t.ingredients}
                  </h2>
                </div>

                {recipe.ingredients.length === 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-sm text-zinc-500">
                    {language === "zh"
                      ? "暂未添加食材。"
                      : "No ingredients have been added yet."}
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl">
                    {recipe.ingredients.map((item) => {
                      const ingredientName =
                        language === "zh"
                          ? item.ingredient.nameZh
                          : item.ingredient.nameEn;

                      return (
                        <div
                          key={item.id}
                          className="flex items-center justify-between gap-5 border-b border-white/[0.07] px-5 py-4 last:border-b-0 transition hover:bg-white/[0.04]"
                        >
                          <div className="flex items-center gap-3">
                            <span className="h-1.5 w-1.5 rounded-full bg-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.65)]" />

                            <span className="font-medium text-zinc-200">
                              {ingredientName}
                            </span>
                          </div>

                          <span className="shrink-0 text-sm text-zinc-500">
                            {item.quantity ?? ""}{" "}
                            {item.unit ?? ""}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>

              {/* Instructions */}
              <section>
                <div className="mb-5 flex items-center gap-3">
                  <span className="h-px w-6 bg-orange-400" />

                  <h2 className="text-2xl font-semibold text-white">
                    {t.instructions}
                  </h2>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 leading-8 text-zinc-300 backdrop-blur-xl">
                  <div className="whitespace-pre-line">
                    {instructions}
                  </div>
                </div>
              </section>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}