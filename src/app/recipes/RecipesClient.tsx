"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import RecipeCard, { type RecipeCardData } from "@/components/RecipeCard";
import SiteFooter from "@/components/SiteFooter";

type Recipe = RecipeCardData & {
  servings: number | null;
  ingredients: { id: string; ingredient: { nameZh: string; nameEn: string } }[];
};
export default function RecipesClient({
  recipes,
  collection = "all",
}: {
  recipes: Recipe[];
  collection?: "all" | "favorites";
}) {
  const language = useLanguage();
  const zh = language === "zh";
  const saved = collection === "favorites";
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const categories = useMemo(() => {
    const unique = new Map<string, string>();
    for (const recipe of recipes) {
      if (recipe.category)
        unique.set(
          recipe.category.nameEn,
          zh ? recipe.category.nameZh : recipe.category.nameEn,
        );
    }
    return Array.from(unique, ([value, label]) => ({ value, label }));
  }, [recipes, zh]);
  const filteredRecipes = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    return recipes.filter((recipe) => {
      if (
        selectedCategory !== "all" &&
        recipe.category?.nameEn !== selectedCategory
      )
        return false;
      return (
        !search ||
        [
          recipe.titleEn,
          recipe.titleZh,
          recipe.descriptionEn ?? "",
          recipe.descriptionZh ?? "",
          recipe.category?.nameEn ?? "",
          recipe.category?.nameZh ?? "",
          ...recipe.ingredients.flatMap((item) => [
            item.ingredient.nameEn,
            item.ingredient.nameZh,
          ]),
        ].some((value) => value.toLowerCase().includes(search))
      );
    });
  }, [recipes, searchTerm, selectedCategory]);
  const hasFilters = searchTerm !== "" || selectedCategory !== "all";
  function clearFilters() {
    setSearchTerm("");
    setSelectedCategory("all");
  }
  return (
    <>
      <main id="main-content" className="pp-container pp-list-page">
        <div className="pp-page-heading">
          <div>
            <p className="pp-eyebrow">
              {saved
                ? zh
                  ? "你的私人菜谱集"
                  : "YOUR PERSONAL COOKBOOK"
                : zh
                  ? "发现你的下一道料理"
                  : "DISCOVER & COOK"}
            </p>
            <h1>
              {saved
                ? zh
                  ? "想再做一次的好味道。"
                  : "Keep the good ones."
                : zh
                  ? "今天，想吃点什么？"
                  : "What sounds good today?"}
            </h1>
            <p className="pp-page-description">
              {saved
                ? zh
                  ? "你收藏的菜谱，都在这里。"
                  : "All your saved recipes, ready when you are."
                : zh
                  ? "按食材找灵感，按心情选一道。让下一餐简单一点。"
                  : "Search by ingredient, find a new favourite, and make yourself something good."}
            </p>
          </div>
          <Link href="/recipes/new" className="pp-button">
            <span aria-hidden="true">+</span>
            {zh ? "分享菜谱" : "Add a recipe"}
          </Link>
        </div>
        <div className="pp-search-panel">
          <label className="pp-search">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <circle cx="10.5" cy="10.5" r="6.5" />
              <path d="m16 16 4 4" />
            </svg>
            <span className="sr-only">
              {zh
                ? "搜索菜谱、描述或食材"
                : "Search recipes, descriptions or ingredients"}
            </span>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder={
                zh
                  ? "试试搜索鸡肉、番茄，或你喜欢的菜…"
                  : "Try chicken, tomatoes, or a dish you love…"
              }
            />
          </label>
          <div
            className="pp-filter-row"
            role="group"
            aria-label={zh ? "菜谱分类" : "Recipe categories"}
          >
            <button
              type="button"
              aria-pressed={selectedCategory === "all"}
              onClick={() => setSelectedCategory("all")}
            >
              {zh ? "全部菜谱" : "All recipes"}
            </button>
            {categories.map((category) => (
              <button
                type="button"
                key={category.value}
                aria-pressed={selectedCategory === category.value}
                onClick={() => setSelectedCategory(category.value)}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
        <div className="pp-results-bar">
          <p role="status" aria-live="polite">
            <strong>{filteredRecipes.length}</strong>{" "}
            {zh
              ? "道菜谱，等你下厨"
              : filteredRecipes.length === 1
                ? "recipe to make your own"
                : "recipes to make your own"}
          </p>
          {hasFilters && (
            <button
              type="button"
              className="pp-text-link"
              onClick={clearFilters}
            >
              {zh ? "清除筛选" : "Clear filters"} ×
            </button>
          )}
        </div>
        {filteredRecipes.length > 0 ? (
          <div className="pp-recipe-grid">
            {filteredRecipes.map((recipe, index) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                language={language}
                eager={index < 3}
              />
            ))}
          </div>
        ) : (
          <div className="pp-empty">
            <span className="pp-empty-symbol" aria-hidden="true">
              ◒
            </span>
            <h2>
              {saved && recipes.length === 0
                ? zh
                  ? "把喜欢的菜谱收藏到这里。"
                  : "A home for your favourite recipes."
                : zh
                  ? "还没找到合适的菜谱。"
                  : "Nothing on the menu just yet."}
            </h2>
            <p>
              {saved && recipes.length === 0
                ? zh
                  ? "在菜谱详情页点击收藏，下次就能轻松找到。"
                  : "Save a recipe from its detail page and find it here next time."
                : zh
                  ? "试试其他食材，或换一个分类。"
                  : "Try another ingredient or a different category."}
            </p>
            {hasFilters ? (
              <button
                className="pp-button"
                type="button"
                onClick={clearFilters}
              >
                {zh ? "重置筛选" : "Reset filters"}
              </button>
            ) : (
              <Link
                className="pp-button"
                href={saved ? "/recipes" : "/recipes/new"}
              >
                {saved
                  ? zh
                    ? "浏览菜谱"
                    : "Explore recipes"
                  : zh
                    ? "分享第一道菜谱"
                    : "Share the first recipe"}{" "}
                ↗
              </Link>
            )}
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
