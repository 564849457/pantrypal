"use client";

import Image from "next/image";
import Link from "next/link";
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
      eyebrow: "Your personal recipe companion",
      title: "Cook smarter with PantryPal.",
      subtitle:
        "Save your favourite recipes, discover meals by ingredients, and keep everything organised in one place.",
      browse: "Browse recipes",
      featured: "Featured recipes",
      featuredSubtitle:
        "A few recipes to get you started.",
      viewAll: "View all recipes",
      viewRecipe: "View recipe",
      minutes: "min",

      featureTitle: "Built for everyday cooking",
      featureSubtitle:
        "Simple tools to make finding and organising recipes easier.",

      features: [
        {
          title: "Search by ingredients",
          description:
            "Find recipes using ingredients you already have at home.",
        },
        {
          title: "English & 中文",
          description:
            "Switch between English and Chinese recipes instantly.",
        },
        {
          title: "Meal planning",
          description:
            "Plan meals and organise your week. More planning tools are coming soon.",
        },
      ],
    },

    zh: {
      eyebrow: "你的个人菜谱助手",
      title: "用 PantryPal，让做饭更简单。",
      subtitle:
        "保存喜欢的菜谱，根据现有食材寻找料理，并把所有内容整理在一个地方。",
      browse: "浏览菜谱",
      featured: "精选菜谱",
      featuredSubtitle:
        "从这些菜谱开始探索 PantryPal。",
      viewAll: "查看全部菜谱",
      viewRecipe: "查看菜谱",
      minutes: "分钟",

      featureTitle: "为日常做饭而设计",
      featureSubtitle:
        "用简单实用的功能，更轻松地寻找和管理菜谱。",

      features: [
        {
          title: "按食材搜索",
          description:
            "根据家里已有的食材快速找到可以制作的菜谱。",
        },
        {
          title: "English & 中文",
          description:
            "菜谱和界面支持中英文即时切换。",
        },
        {
          title: "膳食计划",
          description:
            "规划每周饮食并管理菜谱，更多计划功能即将加入。",
        },
      ],
    },
  } as const;

  const t = content[language];

  return (
    <main className="bg-zinc-50">
      {/* Hero */}
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
              {t.eyebrow}
            </p>

            <h1 className="max-w-3xl text-5xl font-bold tracking-tight text-zinc-950 sm:text-6xl">
              {t.title}
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-600">
              {t.subtitle}
            </p>

            <div className="mt-8">
              <Link
                href="/recipes"
                className="inline-flex items-center rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700"
              >
                {t.browse} →
              </Link>
            </div>
          </div>

          {recipes[0]?.imageUrl && (
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-zinc-100 shadow-lg">
              <Image
                src={recipes[0].imageUrl}
                alt={
                  language === "zh"
                    ? recipes[0].titleZh
                    : recipes[0].titleEn
                }
                fill
                priority
                className="object-cover"
              />
            </div>
          )}
        </div>
      </section>

      {/* Featured Recipes */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900">
              {t.featured}
            </h2>

            <p className="mt-2 text-zinc-600">
              {t.featuredSubtitle}
            </p>
          </div>

          <Link
            href="/recipes"
            className="text-sm font-semibold text-zinc-700 hover:text-zinc-950"
          >
            {t.viewAll} →
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {recipes.map((recipe) => {
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
                className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                {recipe.imageUrl && (
                  <Link href={`/recipes/${recipe.id}`}>
                    <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
                      <Image
                        src={recipe.imageUrl}
                        alt={title}
                        fill
                        className="object-cover transition duration-300 hover:scale-105"
                      />
                    </div>
                  </Link>
                )}

                <div className="p-6">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
                      {category}
                    </span>

                    <span className="text-sm text-zinc-500">
                      {(recipe.prepTime ?? 0) +
                        (recipe.cookTime ?? 0)}{" "}
                      {t.minutes}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-zinc-900">
                    {title}
                  </h3>

                  {description && (
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-600">
                      {description}
                    </p>
                  )}

                  <Link
                    href={`/recipes/${recipe.id}`}
                    className="mt-5 inline-block text-sm font-semibold text-zinc-800 hover:text-zinc-950"
                  >
                    {t.viewRecipe} →
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-zinc-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900">
              {t.featureTitle}
            </h2>

            <p className="mt-3 text-zinc-600">
              {t.featureSubtitle}
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {t.features.map((feature, index) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6"
              >
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-sm font-bold text-white">
                  {index + 1}
                </div>

                <h3 className="text-lg font-semibold text-zinc-900">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}