"use client";

import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { createRecipe } from "./actions";

type Category = {
  id: string;
  nameEn: string;
  nameZh: string;
};

type IngredientRow = {
  nameEn: string;
  nameZh: string;
  quantity: string;
  unit: string;
};

type NewRecipeFormProps = {
  categories: Category[];
};

export default function NewRecipeForm({
  categories,
}: NewRecipeFormProps) {
  const language = useLanguage();

  const [ingredients, setIngredients] = useState<IngredientRow[]>([
    {
      nameEn: "",
      nameZh: "",
      quantity: "",
      unit: "",
    },
  ]);

  const t =
    language === "zh"
      ? {
          title: "新增菜谱",
          subtitle: "创建一份新的 PantryPal 菜谱。",
          titleEn: "英文菜名",
          titleZh: "中文菜名",
          descriptionEn: "英文简介",
          descriptionZh: "中文简介",
          instructionsEn: "英文做法",
          instructionsZh: "中文做法",
          category: "分类",
          selectCategory: "请选择分类",
          prepTime: "准备时间",
          cookTime: "烹饪时间",
          servings: "份量",
          imageUrl: "图片路径",
          ingredients: "食材",
          ingredientsSubtitle: "添加这道菜所需的食材和用量。",
          addIngredient: "+ 添加食材",
          ingredientNameEn: "英文食材名",
          ingredientNameZh: "中文食材名",
          quantity: "数量",
          unit: "单位",
          remove: "删除",
          create: "创建菜谱",
          back: "返回菜谱",
        }
      : {
          title: "Create Recipe",
          subtitle: "Add a new recipe to PantryPal.",
          titleEn: "English title",
          titleZh: "Chinese title",
          descriptionEn: "English description",
          descriptionZh: "Chinese description",
          instructionsEn: "English instructions",
          instructionsZh: "Chinese instructions",
          category: "Category",
          selectCategory: "Select a category",
          prepTime: "Prep time",
          cookTime: "Cook time",
          servings: "Servings",
          imageUrl: "Image path",
          ingredients: "Ingredients",
          ingredientsSubtitle:
            "Add the ingredients and quantities for this recipe.",
          addIngredient: "+ Add ingredient",
          ingredientNameEn: "Ingredient name (EN)",
          ingredientNameZh: "Ingredient name (中文)",
          quantity: "Quantity",
          unit: "Unit",
          remove: "Remove",
          create: "Create recipe",
          back: "Back to recipes",
        };

  const addIngredient = () => {
    setIngredients((current) => [
      ...current,
      {
        nameEn: "",
        nameZh: "",
        quantity: "",
        unit: "",
      },
    ]);
  };

  const removeIngredient = (index: number) => {
    setIngredients((current) =>
      current.filter((_, i) => i !== index),
    );
  };

  const updateIngredient = (
    index: number,
    field: keyof IngredientRow,
    value: string,
  ) => {
    setIngredients((current) =>
      current.map((ingredient, i) =>
        i === index
          ? {
              ...ingredient,
              [field]: value,
            }
          : ingredient,
      ),
    );
  };

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/recipes"
          className="text-sm font-medium text-zinc-600 transition hover:text-zinc-900"
        >
          ← {t.back}
        </Link>

        <div className="mt-6 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
              {t.title}
            </h1>

            <p className="mt-2 text-zinc-600">
              {t.subtitle}
            </p>
          </div>

          <form
            action={createRecipe}
            className="mt-8 space-y-8"
          >
            {/* Titles */}
            <section>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700">
                    {t.titleEn}
                  </label>

                  <input
                    name="titleEn"
                    required
                    placeholder="Mapo Tofu"
                    className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 outline-none transition focus:border-zinc-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700">
                    {t.titleZh}
                  </label>

                  <input
                    name="titleZh"
                    required
                    placeholder="麻婆豆腐"
                    className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 outline-none transition focus:border-zinc-500"
                  />
                </div>
              </div>
            </section>

            {/* Descriptions */}
            <section>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700">
                    {t.descriptionEn}
                  </label>

                  <textarea
                    name="descriptionEn"
                    rows={4}
                    placeholder="A classic Sichuan-style tofu dish..."
                    className="w-full resize-none rounded-xl border border-zinc-300 bg-white px-4 py-3 outline-none transition focus:border-zinc-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700">
                    {t.descriptionZh}
                  </label>

                  <textarea
                    name="descriptionZh"
                    rows={4}
                    placeholder="经典川味家常菜..."
                    className="w-full resize-none rounded-xl border border-zinc-300 bg-white px-4 py-3 outline-none transition focus:border-zinc-500"
                  />
                </div>
              </div>
            </section>

            {/* Instructions */}
            <section>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700">
                    {t.instructionsEn}
                  </label>

                  <textarea
                    name="instructionsEn"
                    required
                    rows={9}
                    placeholder={"1. Prepare the ingredients...\n2. Heat the pan..."}
                    className="w-full resize-y rounded-xl border border-zinc-300 bg-white px-4 py-3 outline-none transition focus:border-zinc-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700">
                    {t.instructionsZh}
                  </label>

                  <textarea
                    name="instructionsZh"
                    required
                    rows={9}
                    placeholder={"1. 准备食材...\n2. 锅中加热..."}
                    className="w-full resize-y rounded-xl border border-zinc-300 bg-white px-4 py-3 outline-none transition focus:border-zinc-500"
                  />
                </div>
              </div>
            </section>

            {/* Category */}
            <section>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                {t.category}
              </label>

              <select
                name="categoryId"
                required
                defaultValue=""
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 outline-none transition focus:border-zinc-500"
              >
                <option value="" disabled>
                  {t.selectCategory}
                </option>

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {language === "zh"
                      ? category.nameZh
                      : category.nameEn}
                  </option>
                ))}
              </select>
            </section>

            {/* Time & servings */}
            <section>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700">
                    {t.prepTime}
                  </label>

                  <div className="relative">
                    <input
                      name="prepTime"
                      type="number"
                      min="0"
                      placeholder="15"
                      className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 pr-14 outline-none transition focus:border-zinc-500"
                    />

                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-zinc-400">
                      min
                    </span>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700">
                    {t.cookTime}
                  </label>

                  <div className="relative">
                    <input
                      name="cookTime"
                      type="number"
                      min="0"
                      placeholder="20"
                      className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 pr-14 outline-none transition focus:border-zinc-500"
                    />

                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-zinc-400">
                      min
                    </span>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700">
                    {t.servings}
                  </label>

                  <input
                    name="servings"
                    type="number"
                    min="1"
                    placeholder="2"
                    className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 outline-none transition focus:border-zinc-500"
                  />
                </div>
              </div>
            </section>

            {/* Image */}
            <section>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                {t.imageUrl}
              </label>

              <input
                name="imageUrl"
                placeholder="/recipes/example.jpg"
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 outline-none transition focus:border-zinc-500"
              />

              <p className="mt-2 text-xs text-zinc-500">
                {language === "zh"
                  ? "目前可填写 public 目录中的图片路径，例如 /recipes/mapo-tofu.jpg。"
                  : "For now, use an image path from public, for example /recipes/mapo-tofu.jpg."}
              </p>
            </section>

            {/* Ingredients */}
            <section className="border-t border-zinc-200 pt-8">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-zinc-900">
                    {t.ingredients}
                  </h2>

                  <p className="mt-1 text-sm text-zinc-500">
                    {t.ingredientsSubtitle}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addIngredient}
                  className="self-start rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 sm:self-auto"
                >
                  {t.addIngredient}
                </button>
              </div>

              <div className="space-y-4">
                {ingredients.map((ingredient, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-sm font-semibold text-zinc-700">
                        {language === "zh"
                          ? `食材 ${index + 1}`
                          : `Ingredient ${index + 1}`}
                      </span>

                      {ingredients.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            removeIngredient(index)
                          }
                          className="text-sm font-medium text-red-500 transition hover:text-red-700"
                        >
                          {t.remove}
                        </button>
                      )}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-zinc-500">
                          {t.ingredientNameEn}
                        </label>

                        <input
                          type="text"
                          placeholder="Garlic"
                          value={ingredient.nameEn}
                          onChange={(event) =>
                            updateIngredient(
                              index,
                              "nameEn",
                              event.target.value,
                            )
                          }
                          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 outline-none transition focus:border-zinc-500"
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-zinc-500">
                          {t.ingredientNameZh}
                        </label>

                        <input
                          type="text"
                          placeholder="大蒜"
                          value={ingredient.nameZh}
                          onChange={(event) =>
                            updateIngredient(
                              index,
                              "nameZh",
                              event.target.value,
                            )
                          }
                          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 outline-none transition focus:border-zinc-500"
                        />
                      </div>
                    </div>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-zinc-500">
                          {t.quantity}
                        </label>

                        <input
                          type="number"
                          min="0"
                          step="any"
                          placeholder="20"
                          value={ingredient.quantity}
                          onChange={(event) =>
                            updateIngredient(
                              index,
                              "quantity",
                              event.target.value,
                            )
                          }
                          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 outline-none transition focus:border-zinc-500"
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-zinc-500">
                          {t.unit}
                        </label>

                        <input
                          type="text"
                          placeholder="g"
                          value={ingredient.unit}
                          onChange={(event) =>
                            updateIngredient(
                              index,
                              "unit",
                              event.target.value,
                            )
                          }
                          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 outline-none transition focus:border-zinc-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <input
                type="hidden"
                name="ingredients"
                value={JSON.stringify(ingredients)}
              />
            </section>

            {/* Submit */}
            <div className="border-t border-zinc-200 pt-6">
              <button
                type="submit"
                className="w-full rounded-xl bg-zinc-900 px-5 py-3.5 font-semibold text-white transition hover:bg-zinc-700"
              >
                {t.create}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}