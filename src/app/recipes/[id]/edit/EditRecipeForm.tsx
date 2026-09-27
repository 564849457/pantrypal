"use client";

import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { updateRecipe } from "./actions";

type Category = {
  id: string;
  nameEn: string;
  nameZh: string;
};

type Recipe = {
  id: string;
  titleEn: string;
  titleZh: string;
  descriptionEn: string | null;
  descriptionZh: string | null;
  instructionsEn: string;
  instructionsZh: string;
  imageUrl: string | null;
  prepTime: number | null;
  cookTime: number | null;
  servings: number | null;
  categoryId: string | null;

  ingredients: {
    id: string;
    quantity: number | null;
    unit: string | null;

    ingredient: {
      nameEn: string;
      nameZh: string;
    };
  }[];
};

type Props = {
  recipe: Recipe;
  categories: Category[];
};

type IngredientRow = {
  nameEn: string;
  nameZh: string;
  quantity: string;
  unit: string;
};

export default function EditRecipeForm({ recipe, categories }: Props) {
  const language = useLanguage();

  const [ingredients, setIngredients] = useState<IngredientRow[]>(
    recipe.ingredients.length > 0
      ? recipe.ingredients.map((item) => ({
          nameEn: item.ingredient.nameEn,
          nameZh: item.ingredient.nameZh,
          quantity: item.quantity?.toString() ?? "",
          unit: item.unit ?? "",
        }))
      : [
          {
            nameEn: "",
            nameZh: "",
            quantity: "",
            unit: "",
          },
        ],
  );

  const updateIngredient = (
    index: number,
    field: keyof IngredientRow,
    value: string,
  ) => {
    setIngredients((current) =>
      current.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
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
    setIngredients((current) => current.filter((_, i) => i !== index));
  };

  const action = updateRecipe.bind(null, recipe.id);

  return (
    <main id="main-content" className="pp-form-page min-h-screen px-5 py-10">
      <div className="mx-auto max-w-4xl">
        <Link
          href={`/recipes/${recipe.id}`}
          className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
        >
          ← {language === "zh" ? "返回菜谱" : "Back to recipe"}
        </Link>

        <div className="mt-6 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-zinc-900">
            {language === "zh" ? "编辑菜谱" : "Edit Recipe"}
          </h1>

          <form action={action} className="mt-8 space-y-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block min-w-0">
                <span className="mb-2 block text-sm font-medium text-zinc-700">
                  {language === "zh"
                    ? "菜谱名称（英文）"
                    : "Recipe title (English)"}
                </span>
                <input
                  name="titleEn"
                  defaultValue={recipe.titleEn}
                  required
                  className="w-full min-w-0 rounded-xl border border-zinc-300 px-4 py-3"
                />
              </label>

              <label className="block min-w-0">
                <span className="mb-2 block text-sm font-medium text-zinc-700">
                  {language === "zh"
                    ? "菜谱名称（中文）"
                    : "Recipe title (Chinese)"}
                </span>
                <input
                  name="titleZh"
                  defaultValue={recipe.titleZh}
                  required
                  className="w-full min-w-0 rounded-xl border border-zinc-300 px-4 py-3"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block min-w-0">
                <span className="mb-2 block text-sm font-medium text-zinc-700">
                  {language === "zh" ? "简介（英文）" : "Description (English)"}
                </span>
                <textarea
                  name="descriptionEn"
                  defaultValue={recipe.descriptionEn ?? ""}
                  rows={4}
                  className="w-full min-w-0 rounded-xl border border-zinc-300 px-4 py-3"
                />
              </label>

              <label className="block min-w-0">
                <span className="mb-2 block text-sm font-medium text-zinc-700">
                  {language === "zh" ? "简介（中文）" : "Description (Chinese)"}
                </span>
                <textarea
                  name="descriptionZh"
                  defaultValue={recipe.descriptionZh ?? ""}
                  rows={4}
                  className="w-full min-w-0 rounded-xl border border-zinc-300 px-4 py-3"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block min-w-0">
                <span className="mb-2 block text-sm font-medium text-zinc-700">
                  {language === "zh"
                    ? "做法（英文）"
                    : "Instructions (English)"}
                </span>
                <textarea
                  name="instructionsEn"
                  defaultValue={recipe.instructionsEn}
                  required
                  rows={9}
                  className="w-full min-w-0 rounded-xl border border-zinc-300 px-4 py-3"
                />
              </label>

              <label className="block min-w-0">
                <span className="mb-2 block text-sm font-medium text-zinc-700">
                  {language === "zh"
                    ? "做法（中文）"
                    : "Instructions (Chinese)"}
                </span>
                <textarea
                  name="instructionsZh"
                  defaultValue={recipe.instructionsZh}
                  required
                  rows={9}
                  className="w-full min-w-0 rounded-xl border border-zinc-300 px-4 py-3"
                />
              </label>
            </div>

            <label className="block min-w-0">
              <span className="mb-2 block text-sm font-medium text-zinc-700">
                {language === "zh" ? "分类" : "Category"}
              </span>
              <select
                name="categoryId"
                defaultValue={recipe.categoryId ?? ""}
                required
                className="w-full min-w-0 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {language === "zh" ? category.nameZh : category.nameEn}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid gap-4 sm:grid-cols-3">
              <label className="block min-w-0">
                <span className="mb-2 block text-sm font-medium text-zinc-700">
                  {language === "zh" ? "准备时间（分钟）" : "Prep time (min)"}
                </span>
                <input
                  name="prepTime"
                  type="number"
                  min="0"
                  defaultValue={recipe.prepTime ?? ""}
                  className="w-full min-w-0 rounded-xl border border-zinc-300 px-4 py-3"
                />
              </label>

              <label className="block min-w-0">
                <span className="mb-2 block text-sm font-medium text-zinc-700">
                  {language === "zh" ? "烹饪时间（分钟）" : "Cook time (min)"}
                </span>
                <input
                  name="cookTime"
                  type="number"
                  min="0"
                  defaultValue={recipe.cookTime ?? ""}
                  className="w-full min-w-0 rounded-xl border border-zinc-300 px-4 py-3"
                />
              </label>

              <label className="block min-w-0">
                <span className="mb-2 block text-sm font-medium text-zinc-700">
                  {language === "zh" ? "人份" : "Servings"}
                </span>
                <input
                  name="servings"
                  type="number"
                  min="1"
                  defaultValue={recipe.servings ?? ""}
                  className="w-full min-w-0 rounded-xl border border-zinc-300 px-4 py-3"
                />
              </label>
            </div>

            <label className="block min-w-0">
              <span className="mb-2 block text-sm font-medium text-zinc-700">
                {language === "zh" ? "图片地址" : "Image URL"}
              </span>
              <input
                name="imageUrl"
                defaultValue={recipe.imageUrl ?? ""}
                placeholder="/recipes/example.jpg"
                className="w-full min-w-0 w-full rounded-xl border border-zinc-300 px-4 py-3"
              />
            </label>

            <section className="border-t border-zinc-200 pt-8">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-semibold">
                  {language === "zh" ? "食材" : "Ingredients"}
                </h2>

                <button
                  type="button"
                  onClick={addIngredient}
                  className="rounded-lg border px-4 py-2 text-sm"
                >
                  + {language === "zh" ? "添加食材" : "Add ingredient"}
                </button>
              </div>

              <div className="space-y-4">
                {ingredients.map((ingredient, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4"
                  >
                    <div className="mb-4 flex justify-between">
                      <span>
                        {language === "zh"
                          ? `食材 ${index + 1}`
                          : `Ingredient ${index + 1}`}
                      </span>

                      {ingredients.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeIngredient(index)}
                          className="text-sm text-red-500"
                        >
                          {language === "zh" ? "删除" : "Remove"}
                        </button>
                      )}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block min-w-0">
                        <span className="mb-2 block text-sm font-medium text-zinc-700">
                          {language === "zh"
                            ? "食材名称（英文）"
                            : "Ingredient (English)"}
                        </span>
                        <input
                          value={ingredient.nameEn}
                          onChange={(e) =>
                            updateIngredient(index, "nameEn", e.target.value)
                          }
                          placeholder="Garlic"
                          className="w-full min-w-0 rounded-lg border px-3 py-2.5"
                        />
                      </label>

                      <label className="block min-w-0">
                        <span className="mb-2 block text-sm font-medium text-zinc-700">
                          {language === "zh"
                            ? "食材名称（中文）"
                            : "Ingredient (Chinese)"}
                        </span>
                        <input
                          value={ingredient.nameZh}
                          onChange={(e) =>
                            updateIngredient(index, "nameZh", e.target.value)
                          }
                          placeholder="大蒜"
                          className="w-full min-w-0 rounded-lg border px-3 py-2.5"
                        />
                      </label>
                    </div>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <label className="block min-w-0">
                        <span className="mb-2 block text-sm font-medium text-zinc-700">
                          {language === "zh" ? "用量" : "Quantity"}
                        </span>
                        <input
                          type="number"
                          step="any"
                          min="0"
                          value={ingredient.quantity}
                          onChange={(e) =>
                            updateIngredient(index, "quantity", e.target.value)
                          }
                          placeholder="20"
                          className="w-full min-w-0 rounded-lg border px-3 py-2.5"
                        />
                      </label>

                      <label className="block min-w-0">
                        <span className="mb-2 block text-sm font-medium text-zinc-700">
                          {language === "zh" ? "单位" : "Unit"}
                        </span>
                        <input
                          value={ingredient.unit}
                          onChange={(e) =>
                            updateIngredient(index, "unit", e.target.value)
                          }
                          placeholder="g"
                          className="w-full min-w-0 rounded-lg border px-3 py-2.5"
                        />
                      </label>
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

            <button
              type="submit"
              className="w-full rounded-xl bg-[#ae421f] px-5 py-3.5 font-semibold text-white hover:bg-[#903419]"
            >
              {language === "zh" ? "保存修改" : "Save changes"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
