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
        className="pp-button pp-button-secondary"
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
        className={`pp-button ${
          favorited
            ? "pp-button-dark"
            : "pp-button-secondary"
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