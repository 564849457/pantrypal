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

export default function EditRecipeForm({
  recipe,
  categories,
}: Props) {
  const language = useLanguage();

  const [ingredients, setIngredients] =
    useState<IngredientRow[]>(
      recipe.ingredients.length > 0
        ? recipe.ingredients.map((item) => ({
            nameEn: item.ingredient.nameEn,
            nameZh: item.ingredient.nameZh,
            quantity:
              item.quantity?.toString() ?? "",
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
    setIngredients((current) =>
      current.filter((_, i) => i !== index),
    );
  };

  const action = updateRecipe.bind(
    null,
    recipe.id,
  );

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <Link
          href={`/recipes/${recipe.id}`}
          className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
        >
          ←{" "}
          {language === "zh"
            ? "返回菜谱"
            : "Back to recipe"}
        </Link>

        <div className="mt-6 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-zinc-900">
            {language === "zh"
              ? "编辑菜谱"
              : "Edit Recipe"}
          </h1>

          <form
            action={action}
            className="mt-8 space-y-8"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                name="titleEn"
                defaultValue={recipe.titleEn}
                required
                className="rounded-xl border border-zinc-300 px-4 py-3"
              />

              <input
                name="titleZh"
                defaultValue={recipe.titleZh}
                required
                className="rounded-xl border border-zinc-300 px-4 py-3"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <textarea
                name="descriptionEn"
                defaultValue={
                  recipe.descriptionEn ?? ""
                }
                rows={4}
                className="rounded-xl border border-zinc-300 px-4 py-3"
              />

              <textarea
                name="descriptionZh"
                defaultValue={
                  recipe.descriptionZh ?? ""
                }
                rows={4}
                className="rounded-xl border border-zinc-300 px-4 py-3"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <textarea
                name="instructionsEn"
                defaultValue={
                  recipe.instructionsEn
                }
                required
                rows={9}
                className="rounded-xl border border-zinc-300 px-4 py-3"
              />

              <textarea
                name="instructionsZh"
                defaultValue={
                  recipe.instructionsZh
                }
                required
                rows={9}
                className="rounded-xl border border-zinc-300 px-4 py-3"
              />
            </div>

            <select
              name="categoryId"
              defaultValue={
                recipe.categoryId ?? ""
              }
              required
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3"
            >
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

            <div className="grid gap-4 sm:grid-cols-3">
              <input
                name="prepTime"
                type="number"
                min="0"
                defaultValue={
                  recipe.prepTime ?? ""
                }
                className="rounded-xl border border-zinc-300 px-4 py-3"
              />

              <input
                name="cookTime"
                type="number"
                min="0"
                defaultValue={
                  recipe.cookTime ?? ""
                }
                className="rounded-xl border border-zinc-300 px-4 py-3"
              />

              <input
                name="servings"
                type="number"
                min="1"
                defaultValue={
                  recipe.servings ?? ""
                }
                className="rounded-xl border border-zinc-300 px-4 py-3"
              />
            </div>

            <input
              name="imageUrl"
              defaultValue={
                recipe.imageUrl ?? ""
              }
              placeholder="/recipes/example.jpg"
              className="w-full rounded-xl border border-zinc-300 px-4 py-3"
            />

            <section className="border-t border-zinc-200 pt-8">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  {language === "zh"
                    ? "食材"
                    : "Ingredients"}
                </h2>

                <button
                  type="button"
                  onClick={addIngredient}
                  className="rounded-lg border px-4 py-2 text-sm"
                >
                  +{" "}
                  {language === "zh"
                    ? "添加食材"
                    : "Add ingredient"}
                </button>
              </div>

              <div className="space-y-4">
                {ingredients.map(
                  (ingredient, index) => (
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

                        {ingredients.length >
                          1 && (
                          <button
                            type="button"
                            onClick={() =>
                              removeIngredient(
                                index,
                              )
                            }
                            className="text-sm text-red-500"
                          >
                            {language === "zh"
                              ? "删除"
                              : "Remove"}
                          </button>
                        )}
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <input
                          value={
                            ingredient.nameEn
                          }
                          onChange={(e) =>
                            updateIngredient(
                              index,
                              "nameEn",
                              e.target.value,
                            )
                          }
                          placeholder="Garlic"
                          className="rounded-lg border px-3 py-2.5"
                        />

                        <input
                          value={
                            ingredient.nameZh
                          }
                          onChange={(e) =>
                            updateIngredient(
                              index,
                              "nameZh",
                              e.target.value,
                            )
                          }
                          placeholder="大蒜"
                          className="rounded-lg border px-3 py-2.5"
                        />
                      </div>

                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <input
                          type="number"
                          step="any"
                          min="0"
                          value={
                            ingredient.quantity
                          }
                          onChange={(e) =>
                            updateIngredient(
                              index,
                              "quantity",
                              e.target.value,
                            )
                          }
                          placeholder="20"
                          className="rounded-lg border px-3 py-2.5"
                        />

                        <input
                          value={
                            ingredient.unit
                          }
                          onChange={(e) =>
                            updateIngredient(
                              index,
                              "unit",
                              e.target.value,
                            )
                          }
                          placeholder="g"
                          className="rounded-lg border px-3 py-2.5"
                        />
                      </div>
                    </div>
                  ),
                )}
              </div>

              <input
                type="hidden"
                name="ingredients"
                value={JSON.stringify(
                  ingredients,
                )}
              />
            </section>

            <button
              type="submit"
              className="w-full rounded-xl bg-zinc-900 px-5 py-3.5 font-semibold text-white hover:bg-zinc-700"
            >
              {language === "zh"
                ? "保存修改"
                : "Save changes"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}