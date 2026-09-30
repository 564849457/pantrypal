"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import RecipeCard, { type RecipeCardData } from "@/components/RecipeCard";
import SiteFooter from "@/components/SiteFooter";
import { recipeListUrl, type CatalogQuery } from "@/lib/recipe-query";

type Category = { id: string; nameZh: string; nameEn: string };
export default function CatalogClient({
  recipes,
  categories,
  query,
  hasNext,
}: {
  recipes: RecipeCardData[];
  categories: Category[];
  query: CatalogQuery;
  hasNext: boolean;
}) {
  const language = useLanguage();
  const zh = language === "zh";
  const router = useRouter();
  const [search, setSearch] = useState(query.q);
  const [pending, startTransition] = useTransition();
  const filtered = Boolean(query.q || query.category);
  function navigate(next: CatalogQuery) {
    startTransition(() => router.push(recipeListUrl(next), { scroll: false }));
  }
  return (
    <>
      <main
        id="main-content"
        className="pp-container pp-list-page"
        aria-busy={pending}
      >
        <div className="pp-page-heading">
          <div>
            <p className="pp-eyebrow">
              {zh ? "发现你的下一道料理" : "DISCOVER & COOK"}
            </p>
            <h1>{zh ? "今天，想吃点什么？" : "What sounds good today?"}</h1>
            <p className="pp-page-description">
              {zh
                ? "按食材找灵感，按心情选一道。让下一餐简单一点。"
                : "Search by ingredient, find a new favourite, and make yourself something good."}
            </p>
          </div>
          <Link href="/recipes/new" className="pp-button">
            + {zh ? "分享菜谱" : "Add a recipe"}
          </Link>
        </div>
        <div className="pp-search-panel">
          <form
            action="/recipes"
            onSubmit={(event) => {
              event.preventDefault();
              navigate({ ...query, q: search.trim(), page: 0 });
            }}
            className="flex flex-wrap items-center gap-3"
          >
            <label className="pp-search flex-1 min-w-0">
              <span className="sr-only">
                {zh ? "搜索菜谱或食材" : "Search recipes or ingredients"}
              </span>
              <input
                type="search"
                name="q"
                maxLength={120}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={
                  zh
                    ? "搜索菜名、描述或食材…"
                    : "Search dishes, descriptions or ingredients…"
                }
              />
            </label>
            <input type="hidden" name="category" value={query.category} />
            <input type="hidden" name="size" value={query.size} />
            <button
              className="pp-button disabled:opacity-50"
              type="submit"
              disabled={pending}
            >
              {zh ? "搜索" : "Search"}
            </button>
          </form>
          <div
            className="pp-filter-row"
            role="group"
            aria-label={zh ? "菜谱分类" : "Recipe categories"}
          >
            {[
              { id: "", nameZh: "全部菜谱", nameEn: "All recipes" },
              ...categories,
            ].map((category) => (
              <button
                key={category.id}
                type="button"
                disabled={pending}
                aria-pressed={query.category === category.id}
                onClick={() =>
                  navigate({
                    ...query,
                    q: search.trim(),
                    category: category.id,
                    page: 0,
                  })
                }
              >
                {zh ? category.nameZh : category.nameEn}
              </button>
            ))}
          </div>
        </div>
        <div className="pp-results-bar">
          <p role="status" aria-live="polite">
            {pending
              ? zh
                ? "正在加载…"
                : "Loading…"
              : zh
                ? `第 ${query.page + 1} 页 · 本页 ${recipes.length} 道菜谱`
                : `Page ${query.page + 1} · ${recipes.length} recipes on this page`}
          </p>
          {filtered && (
            <button
              type="button"
              disabled={pending}
              className="pp-text-link"
              onClick={() =>
                navigate({ ...query, q: "", category: "", page: 0 })
              }
            >
              {zh ? "清除筛选" : "Clear filters"} ×
            </button>
          )}
        </div>
        {recipes.length ? (
          <div className="pp-recipe-grid">
            {recipes.map((recipe, index) => (
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
            <h2>{zh ? "这一页没有菜谱。" : "No recipes on this page."}</h2>
            <p>
              {zh
                ? "试试其他关键词，或返回第一页。"
                : "Try another search or return to the first page."}
            </p>
            <button
              type="button"
              className="pp-button"
              disabled={pending}
              onClick={() =>
                navigate({
                  ...query,
                  page: 0,
                  ...(query.page === 0 ? { q: "", category: "" } : {}),
                })
              }
            >
              {query.page > 0
                ? zh
                  ? "返回第一页"
                  : "First page"
                : zh
                  ? "重置筛选"
                  : "Reset filters"}
            </button>
          </div>
        )}
        <nav
          className="flex flex-wrap items-center justify-center gap-4 py-8"
          aria-label={zh ? "菜谱分页" : "Recipe pagination"}
        >
          <button
            type="button"
            className="pp-button disabled:opacity-40"
            disabled={pending || query.page === 0}
            onClick={() => navigate({ ...query, page: query.page - 1 })}
          >
            {zh ? "上一页" : "Previous"}
          </button>
          <span aria-current="page">{query.page + 1}</span>
          <button
            type="button"
            className="pp-button disabled:opacity-40"
            disabled={pending || !hasNext || query.page >= 100000}
            onClick={() => navigate({ ...query, page: query.page + 1 })}
          >
            {zh ? "下一页" : "Next"}
          </button>
        </nav>
      </main>
      <SiteFooter />
    </>
  );
}
