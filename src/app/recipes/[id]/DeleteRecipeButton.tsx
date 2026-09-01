"use client";

import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { deleteRecipe } from "./actions";

type DeleteRecipeButtonProps = {
  recipeId: string;
};

export default function DeleteRecipeButton({
  recipeId,
}: DeleteRecipeButtonProps) {
  const language = useLanguage();
  const [showConfirm, setShowConfirm] = useState(false);

  const action = deleteRecipe.bind(null, recipeId);

  if (!showConfirm) {
    return (
      <button
        type="button"
        onClick={() => setShowConfirm(true)}
        className="rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
      >
        {language === "zh"
          ? "删除菜谱"
          : "Delete recipe"}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => setShowConfirm(false)}
        className="rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
      >
        {language === "zh"
          ? "取消"
          : "Cancel"}
      </button>

      <form action={action}>
        <button
          type="submit"
          className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
        >
          {language === "zh"
            ? "确认删除"
            : "Confirm delete"}
        </button>
      </form>
    </div>
  );
}