"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useLanguage } from "@/hooks/useLanguage";
import { rateRecipe } from "./rating-actions";

type RatingStarsProps = {
  recipeId: string;
  averageRating: number;
  ratingCount: number;
  userRating: number | null;
  isLoggedIn: boolean;
};

export default function RatingStars({
  recipeId,
  averageRating,
  ratingCount,
  userRating,
  isLoggedIn,
}: RatingStarsProps) {
  const language = useLanguage();
  const router = useRouter();

  const [selectedRating, setSelectedRating] =
    useState<number | null>(userRating);

  const [hoverRating, setHoverRating] =
    useState<number | null>(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const displayRating =
    hoverRating ?? selectedRating ?? 0;

  const handleRating = async (score: number) => {
    if (!isLoggedIn) {
      router.push("/api/auth/signin");
      return;
    }

    if (isSubmitting) {
      return;
    }

    const previousRating = selectedRating;

    setSelectedRating(score);
    setIsSubmitting(true);

    try {
      await rateRecipe(recipeId, score);

      router.refresh();
    } catch (error) {
      console.error("Failed to rate recipe:", error);

      setSelectedRating(previousRating);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <div
          className="flex items-center"
          onMouseLeave={() =>
            setHoverRating(null)
          }
        >
          {[1, 2, 3, 4, 5].map((score) => (
            <button
              key={score}
              type="button"
              disabled={isSubmitting}
              onMouseEnter={() =>
                setHoverRating(score)
              }
              onFocus={() =>
                setHoverRating(score)
              }
              onBlur={() =>
                setHoverRating(null)
              }
              onClick={() =>
                handleRating(score)
              }
              aria-label={
                language === "zh"
                  ? `评分 ${score} 星`
                  : `Rate ${score} stars`
              }
              className="p-0.5 text-2xl transition hover:scale-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span
                className={
                  score <= displayRating
                    ? "text-yellow-500"
                    : "text-zinc-300"
                }
              >
                ★
              </span>
            </button>
          ))}
        </div>

        <span className="text-sm font-medium text-zinc-700">
          {ratingCount > 0
            ? `${averageRating.toFixed(1)} / 5`
            : language === "zh"
              ? "暂无评分"
              : "No ratings"}
        </span>

        {ratingCount > 0 && (
          <span className="text-sm text-zinc-500">
            {language === "zh"
              ? `${ratingCount} 人评分`
              : `${ratingCount} ${
                  ratingCount === 1
                    ? "rating"
                    : "ratings"
                }`}
          </span>
        )}
      </div>

      <p className="mt-2 text-xs text-zinc-500">
        {!isLoggedIn
          ? language === "zh"
            ? "登录后即可评分"
            : "Sign in to rate this recipe"
          : selectedRating
            ? language === "zh"
              ? `你的评分：${selectedRating} 星`
              : `Your rating: ${selectedRating} stars`
            : language === "zh"
              ? "点击星星进行评分"
              : "Click a star to rate"}
      </p>
    </div>
  );
}