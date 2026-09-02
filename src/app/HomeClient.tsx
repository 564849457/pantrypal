"use client";

import Image from "next/image";
import Link from "next/link";

import BurnRecipeLink from "@/components/BurnRecipeLink";
import SparkCanvasBackground from "@/components/SparkCanvasBackground";
import { useLanguage } from "@/hooks/useLanguage";

type Recipe = {
  id: string;
  imageUrl: string | null;

  titleZh: string;
  titleEn: string;

  descriptionZh: string | null;
  descriptionEn: string | null;

  prepTime: number | null;
  cookTime: number | null;

  category: {
    nameZh: string;
    nameEn: string;
  } | null;
};

type HomeClientProps = {
  recipes: Recipe[];
};

export default function HomeClient({
  recipes,
}: HomeClientProps) {
  const language = useLanguage();

  const content = {
    en: {
      eyebrow:
        "Your personal recipe companion",

      title:
        "Cook smarter with PantryPal.",

      subtitle:
        "Save your favourite recipes, discover meals by ingredients, and keep everything organised in one place.",

      browse:
        "Browse recipes",

      featured:
        "Featured recipes",

      featuredSubtitle:
        "A few recipes to get you started.",

      viewAll:
        "View all recipes",

      viewRecipe:
        "View recipe",

      minutes:
        "min",

      featureTitle:
        "Built for everyday cooking",

      featureSubtitle:
        "Simple tools to make finding and organising recipes easier.",

      features: [
        {
          title:
            "Search by ingredients",

          description:
            "Find recipes using ingredients you already have at home.",
        },
        {
          title:
            "English & 中文",

          description:
            "Switch between English and Chinese recipes instantly.",
        },
        {
          title:
            "Meal planning",

          description:
            "Plan meals and organise your week. More planning tools are coming soon.",
        },
      ],

      ctaTitle:
        "Start exploring your next meal.",

      ctaSubtitle:
        "Browse community recipes, save favourites, and build your own cooking collection.",

      ctaButton:
        "Explore PantryPal",
    },

    zh: {
      eyebrow:
        "你的个人菜谱助手",

      title:
        "用 PantryPal，让做饭更简单。",

      subtitle:
        "保存喜欢的菜谱，根据现有食材寻找料理，并把所有内容整理在一个地方。",

      browse:
        "浏览菜谱",

      featured:
        "精选菜谱",

      featuredSubtitle:
        "从这些菜谱开始探索 PantryPal。",

      viewAll:
        "查看全部菜谱",

      viewRecipe:
        "查看菜谱",

      minutes:
        "分钟",

      featureTitle:
        "为日常做饭而设计",

      featureSubtitle:
        "用简单实用的功能，更轻松地寻找和管理菜谱。",

      features: [
        {
          title:
            "按食材搜索",

          description:
            "根据家里已有的食材快速找到可以制作的菜谱。",
        },
        {
          title:
            "English & 中文",

          description:
            "菜谱和界面支持中英文即时切换。",
        },
        {
          title:
            "膳食计划",

          description:
            "规划每周饮食并管理菜谱，更多计划功能即将加入。",
        },
      ],

      ctaTitle:
        "开始寻找你的下一道料理。",

      ctaSubtitle:
        "浏览社区菜谱、收藏喜欢的内容，并建立自己的菜谱库。",

      ctaButton:
        "进入 PantryPal",
    },
  } as const;

  const t =
    content[language];

  const heroRecipe =
    recipes[0];

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* =====================================================
          GLOBAL ANIMATED BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none fixed inset-0 z-0">
        <SparkCanvasBackground />

        {/* Warm ambient glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_10%,rgba(255,135,45,0.18),transparent_30%),radial-gradient(circle_at_12%_70%,rgba(255,70,0,0.08),transparent_28%)]" />

        {/* Global dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/15 to-black/35" />
      </div>

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative z-10 overflow-hidden bg-black/15">
        {/* Dark warm top transition */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-48 bg-gradient-to-b from-orange-950/20 via-black/5 to-transparent" />

        {/* Soft warm haze */}
        <div className="pointer-events-none absolute left-1/2 top-[-100px] z-[1] h-64 w-[75%] -translate-x-1/2 rounded-full bg-orange-500/[0.08] blur-[110px]" />

        <div className="relative z-10 mx-auto grid min-h-[600px] max-w-6xl gap-14 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
          {/* -------------------------------------
              HERO TEXT
          -------------------------------------- */}

          <div className="max-w-2xl">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-8 bg-orange-400" />

              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-200/80 sm:text-sm">
                {t.eyebrow}
              </p>
            </div>

            <h1 className="max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
              {t.title}
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-zinc-300">
              {t.subtitle}
            </p>

            <div className="mt-9">
              <Link
                href="/recipes"
                className="group inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_30px_rgba(249,115,22,0.24)] transition duration-300 hover:bg-orange-400 hover:shadow-[0_0_40px_rgba(249,115,22,0.38)]"
              >
                {t.browse}

                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </div>

          {/* -------------------------------------
              HERO RECIPE
          -------------------------------------- */}

          {heroRecipe?.imageUrl && (
            <div className="relative">
              {/* Background glow */}
              <div className="pointer-events-none absolute -inset-10 rounded-full bg-orange-500/10 blur-3xl" />

              <article
                data-recipe-card
                className="group relative isolate aspect-[4/3] overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-900/60 shadow-2xl shadow-black/50 backdrop-blur-md transition duration-300 hover:border-orange-400/30 hover:shadow-[0_20px_70px_rgba(110,40,5,0.35)]"
              >
                {/* Hover glow */}
                <div className="pointer-events-none absolute -inset-16 z-0 bg-orange-500/0 blur-3xl transition duration-500 group-hover:bg-orange-500/[0.07]" />

                {/* Top edge glow */}
                <div className="pointer-events-none absolute inset-x-16 top-0 z-30 h-px bg-gradient-to-r from-transparent via-orange-300/0 to-transparent transition duration-500 group-hover:via-orange-300/60" />

                <BurnRecipeLink
                  href={`/recipes/${heroRecipe.id}`}
                  className="relative z-10 block h-full w-full"
                >
                  <div className="relative h-full w-full overflow-hidden">
                    <Image
                      src={
                        heroRecipe.imageUrl
                      }
                      alt={
                        language === "zh"
                          ? heroRecipe.titleZh
                          : heroRecipe.titleEn
                      }
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 48vw"
                      className="object-cover transition duration-700 group-hover:scale-[1.035]"
                    />

                    {/* Image dark fade */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-transparent" />

                    {/* Warm hover tint */}
                    <div className="absolute inset-0 bg-orange-500/0 transition duration-500 group-hover:bg-orange-500/[0.035]" />

                    {/* Recipe info */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-300">
                        {language === "zh"
                          ? heroRecipe
                              .category
                              ?.nameZh
                          : heroRecipe
                              .category
                              ?.nameEn}
                      </p>

                      <div className="mt-2 flex items-end justify-between gap-4">
                        <p className="text-xl font-semibold text-white">
                          {language === "zh"
                            ? heroRecipe.titleZh
                            : heroRecipe.titleEn}
                        </p>

                        <span className="shrink-0 text-sm text-orange-200/0 transition duration-300 group-hover:text-orange-200/80">
                          →
                        </span>
                      </div>
                    </div>
                  </div>
                </BurnRecipeLink>

                {/* Bottom edge glow */}
                <div className="pointer-events-none absolute inset-x-16 bottom-0 z-30 h-px bg-gradient-to-r from-transparent via-orange-500/0 to-transparent transition duration-500 group-hover:via-orange-500/35" />
              </article>
            </div>
          )}
        </div>

        {/* Hero bottom blend */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-24 bg-gradient-to-b from-transparent to-black/15" />
      </section>

      {/* =====================================================
          FEATURED RECIPES
      ====================================================== */}

      <section className="relative z-10 border-b border-white/10 bg-black/38 backdrop-blur-[2px]">
        <div className="mx-auto max-w-6xl px-6 py-20">
          {/* Section heading */}

          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-white">
                {t.featured}
              </h2>

              <p className="mt-2 text-zinc-400">
                {t.featuredSubtitle}
              </p>
            </div>

            <Link
              href="/recipes"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-zinc-300 transition hover:text-orange-300"
            >
              {t.viewAll}

              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>

          {/* Recipe grid */}

          <div className="grid gap-6 md:grid-cols-3">
            {recipes.map(
              (recipe) => {
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
                    ? recipe.category
                        ?.nameZh
                    : recipe.category
                        ?.nameEn;

                const recipeHref =
                  `/recipes/${recipe.id}`;

                const totalTime =
                  (recipe.prepTime ??
                    0) +
                  (recipe.cookTime ??
                    0);

                return (
                  <article
                    key={
                      recipe.id
                    }
                    data-recipe-card
                    className="group relative isolate overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/68 shadow-xl backdrop-blur-md transition duration-300 hover:border-orange-400/30 hover:shadow-[0_18px_55px_rgba(80,30,5,0.32)]"
                  >
                    {/* Ambient hover glow */}

                    <div className="pointer-events-none absolute -inset-16 z-0 bg-orange-500/0 blur-3xl transition duration-500 group-hover:bg-orange-500/[0.07]" />

                    {/* Top glowing edge */}

                    <div className="pointer-events-none absolute inset-x-10 top-0 z-30 h-px bg-gradient-to-r from-transparent via-orange-300/0 to-transparent transition duration-500 group-hover:via-orange-300/50" />

                    {/* =============================
                        IMAGE
                    ============================== */}

                    {recipe.imageUrl && (
                      <BurnRecipeLink
                        href={
                          recipeHref
                        }
                        className="relative z-10 block"
                      >
                        <div className="relative aspect-[4/3] overflow-hidden bg-zinc-900">
                          <Image
                            src={
                              recipe.imageUrl
                            }
                            alt={
                              title
                            }
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover transition duration-700 group-hover:scale-[1.045]"
                          />

                          {/* Dark image fade */}

                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                          {/* Warm hover tint */}

                          <div className="absolute inset-0 bg-orange-500/0 transition duration-500 group-hover:bg-orange-500/[0.04]" />
                        </div>
                      </BurnRecipeLink>
                    )}

                    {/* =============================
                        CONTENT
                    ============================== */}

                    <div className="relative z-10 p-6">
                      {/* Meta */}

                      <div className="mb-3 flex items-center justify-between gap-3">
                        <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-medium text-zinc-300 backdrop-blur-xl transition duration-300 group-hover:border-orange-300/20 group-hover:bg-orange-500/[0.07]">
                          {category ??
                            (language ===
                            "zh"
                              ? "未分类"
                              : "Uncategorised")}
                        </span>

                        {totalTime >
                          0 && (
                          <span className="whitespace-nowrap text-sm text-zinc-500 transition duration-300 group-hover:text-zinc-400">
                            {
                              totalTime
                            }{" "}
                            {
                              t.minutes
                            }
                          </span>
                        )}
                      </div>

                      {/* Title */}

                      <h3 className="text-xl font-semibold text-white transition duration-300 group-hover:text-orange-50">
                        {title}
                      </h3>

                      {/* Description */}

                      {description && (
                        <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-400">
                          {
                            description
                          }
                        </p>
                      )}

                      {/* View recipe */}

                      <BurnRecipeLink
                        href={
                          recipeHref
                        }
                        className="group/link mt-5 inline-flex items-center gap-2 text-sm font-semibold text-zinc-300 transition duration-300 hover:text-orange-300"
                      >
                        {
                          t.viewRecipe
                        }

                        <span className="transition-transform duration-300 group-hover/link:translate-x-1">
                          →
                        </span>
                      </BurnRecipeLink>
                    </div>

                    {/* Bottom glowing edge */}

                    <div className="pointer-events-none absolute inset-x-10 bottom-0 z-30 h-px bg-gradient-to-r from-transparent via-orange-500/0 to-transparent transition duration-500 group-hover:via-orange-500/30" />
                  </article>
                );
              },
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          FEATURES
      ====================================================== */}

      <section className="relative z-10 border-b border-white/10 bg-black/48 backdrop-blur-[2px]">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-white">
              {
                t.featureTitle
              }
            </h2>

            <p className="mt-3 text-zinc-400">
              {
                t.featureSubtitle
              }
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {t.features.map(
              (
                feature,
                index,
              ) => (
                <div
                  key={
                    feature.title
                  }
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/62 p-6 backdrop-blur-md transition duration-300 hover:border-orange-400/30 hover:bg-zinc-900/72 hover:shadow-xl hover:shadow-orange-950/20"
                >
                  {/* Hover glow */}

                  <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-orange-500/0 blur-3xl transition duration-500 group-hover:bg-orange-500/[0.08]" />

                  {/* Number */}

                  <div className="relative z-10 mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white shadow-[0_0_18px_rgba(249,115,22,0.25)] transition duration-300 group-hover:bg-orange-400 group-hover:shadow-[0_0_25px_rgba(249,115,22,0.4)]">
                    {index + 1}
                  </div>

                  <h3 className="relative z-10 text-lg font-semibold text-white">
                    {
                      feature.title
                    }
                  </h3>

                  <p className="relative z-10 mt-2 text-sm leading-6 text-zinc-400">
                    {
                      feature.description
                    }
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          CTA
      ====================================================== */}

      <section className="relative z-10 bg-black/58 backdrop-blur-[2px]">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
          {/* Ember */}

          <div className="mx-auto mb-6 h-1.5 w-1.5 rounded-full bg-orange-300 shadow-[0_0_20px_6px_rgba(251,146,60,0.6)]" />

          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {
              t.ctaTitle
            }
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-zinc-300">
            {
              t.ctaSubtitle
            }
          </p>

          <div className="mt-8">
            <Link
              href="/recipes"
              className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white px-6 py-3 text-sm font-semibold text-zinc-950 shadow-lg transition duration-300 hover:border-orange-200 hover:bg-orange-100 hover:shadow-[0_0_30px_rgba(249,115,22,0.18)]"
            >
              {
                t.ctaButton
              }

              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}