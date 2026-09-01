"use client";

import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { toggleFavorite } from "./favorite-actions";
import Link from "next/link";

type FavoriteButtonProps = {
  recipeId: string;
  initialFavorited: boolean;
  isLoggedIn: boolean;
};

export default function FavoriteButton({
  recipeId,
  initialFavorited,
  isLoggedIn,
}: FavoriteButtonProps) {
  const language = useLanguage();
  const [favorited, setFavorited] =
    useState(initialFavorited);

  const action = toggleFavorite.bind(null, recipeId);

  if (!isLoggedIn) {
    return (
        <Link
        href="/api/auth/signin"
        className="rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
        >
        {language === "zh"
            ? "登录后收藏"
            : "Sign in to favorite"}
        </Link>
    );
  }

  return (
    <form
      action={async () => {
        setFavorited((current) => !current);

        await action();
      }}
    >
      <button
        type="submit"
        className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
          favorited
            ? "border-zinc-900 bg-zinc-900 text-white"
            : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50"
        }`}
      >
        {favorited
          ? language === "zh"
            ? "★ 已收藏"
            : "★ Favorited"
          : language === "zh"
            ? "☆ 收藏"
            : "☆ Favorite"}
      </button>
    </form>
  );
}