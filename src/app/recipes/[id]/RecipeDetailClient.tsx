"use client";

import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import { translations } from "@/lib/i18n";
import Image from "next/image";

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
};

export default function RecipeDetailClient({
  recipe,
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
    <main className="min-h-screen bg-zinc-50 px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/recipes"
          className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
        >
          ← {t.backToRecipes}
        </Link>

        {recipe.imageUrl && (
          <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-2xl bg-zinc-100">
            <Image
              src={recipe.imageUrl}
              alt={title}
              fill
              priority
              className="object-cover"
            />
          </div>
        )}

        <article className="mt-6 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-600">
              {category ??
                (language === "zh"
                  ? "未分类"
                  : "Uncategorised")}
            </span>

            <span className="text-sm text-zinc-500">
              {t.prep}: {recipe.prepTime ?? "-"} min
            </span>

            <span className="text-sm text-zinc-500">
              {t.cook}: {recipe.cookTime ?? "-"} min
            </span>

            <span className="text-sm text-zinc-500">
              {t.servings}: {recipe.servings ?? "-"}
            </span>
          </div>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-zinc-900">
            {title}
          </h1>

          {description && (
            <p className="mt-4 text-lg leading-8 text-zinc-600">
              {description}
            </p>
          )}

          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-zinc-900">
              {t.ingredients}
            </h2>

            {recipe.ingredients.length === 0 ? (
              <p className="mt-4 text-zinc-500">
                {language === "zh"
                  ? "暂未添加食材。"
                  : "No ingredients have been added yet."}
              </p>
            ) : (
              <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-200">
                {recipe.ingredients.map((item) => {
                  const ingredientName =
                    language === "zh"
                      ? item.ingredient.nameZh
                      : item.ingredient.nameEn;

                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between border-b border-zinc-100 px-5 py-3 last:border-b-0"
                    >
                      <span className="font-medium text-zinc-800">
                        {ingredientName}
                      </span>

                      <span className="text-sm text-zinc-500">
                        {item.quantity ?? ""}{" "}
                        {item.unit ?? ""}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-zinc-900">
              {t.instructions}
            </h2>

            <div className="mt-4 whitespace-pre-line leading-8 text-zinc-700">
              {instructions}
            </div>
          </section>
        </article>
      </div>
    </main>
  );
}