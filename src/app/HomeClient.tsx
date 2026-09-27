"use client";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import RecipeCard, { type RecipeCardData } from "@/components/RecipeCard";
import SiteFooter from "@/components/SiteFooter";

export default function HomeClient({ recipes }: { recipes: RecipeCardData[] }) {
  const language = useLanguage();
  const zh = language === "zh";
  const hero = recipes.find((recipe) => recipe.imageUrl);
  const title = hero ? (zh ? hero.titleZh : hero.titleEn) : "";
  const minutes = hero ? (hero.prepTime ?? 0) + (hero.cookTime ?? 0) : 0;
  const features = zh
    ? [
        ["01", "从现有食材出发", "输入冰箱里的食材，发现今天可以做的料理。"],
        ["02", "留住喜欢的味道", "收藏心仪的菜谱，下次做饭时轻松找到。"],
        ["03", "用熟悉的语言做饭", "中英文一键切换，让每一道菜都更容易上手。"],
      ]
    : [
        [
          "01",
          "Start with what you have",
          "Find a recipe for the ingredients already in your kitchen.",
        ],
        [
          "02",
          "Keep your favourites close",
          "Save the dishes you love and come back to them anytime.",
        ],
        [
          "03",
          "Cook in your own language",
          "Switch between English and Chinese, from ingredients to instructions.",
        ],
      ];
  return (
    <>
      <main id="main-content">
        <section className="pp-container pp-hero">
          <div className="pp-hero-copy">
            <p className="pp-eyebrow">
              <span aria-hidden="true" />
              {zh ? "你的日常厨房伙伴" : "YOUR EVERYDAY KITCHEN COMPANION"}
            </p>
            <h1>
              {zh ? (
                <>
                  今天，
                  <br />
                  做点<span>好吃的。</span>
                </>
              ) : (
                <>
                  A little inspiration.
                  <br />A really <span>good meal.</span>
                </>
              )}
            </h1>
            <p className="pp-hero-description">
              {zh
                ? "从手边的食材，到餐桌上的好味道。发现、收藏和分享让你想下厨的菜谱。"
                : "From what's in your pantry to what's on your plate. Discover, save and share recipes that make you want to cook."}
            </p>
            <div className="pp-hero-actions">
              <Link href="/recipes" className="pp-button">
                {zh ? "发现菜谱" : "Find your next recipe"}
                <span aria-hidden="true">↗</span>
              </Link>
              <Link href="/recipes/new" className="pp-text-link">
                {zh ? "分享我的拿手菜" : "Share a recipe"}
                <span aria-hidden="true">+</span>
              </Link>
            </div>
            <div className="pp-hero-note">
              <span aria-hidden="true">✳</span>
              {zh
                ? "日常食材 · 简单步骤 · 好好吃饭"
                : "Everyday ingredients. Meals worth making."}
            </div>
          </div>
          {hero?.imageUrl ? (
            <Link href={`/recipes/${hero.id}`} className="pp-hero-photo">
              <Image
                src={hero.imageUrl}
                alt={title}
                fill
                loading="eager"
                fetchPriority="high"
                sizes="(max-width: 799px) calc(100vw - 40px), 520px"
                className="object-cover"
              />
              <span className="pp-hero-photo-label">
                {zh ? "今日灵感" : "ON THE MENU"}
              </span>
              <div className="pp-hero-photo-caption">
                <div>
                  <p>
                    {minutes > 0
                      ? `${minutes} ${zh ? "分钟" : "MINUTES"}`
                      : zh
                        ? "一起来做饭"
                        : "MADE FOR YOUR TABLE"}
                  </p>
                  <h2>{title}</h2>
                </div>
                <span className="pp-round-arrow" aria-hidden="true">
                  ↗
                </span>
              </div>
            </Link>
          ) : (
            <div className="pp-hero-empty">
              <span aria-hidden="true">◒</span>
              <h2>
                {zh ? "每道菜，都有故事。" : "Every recipe starts somewhere."}
              </h2>
              <Link className="pp-text-link" href="/recipes/new">
                {zh ? "添加第一道菜谱" : "Add your first recipe"} ↗
              </Link>
            </div>
          )}
        </section>
        <section className="pp-featured">
          <div className="pp-container">
            <div className="pp-section-heading">
              <div>
                <p className="pp-eyebrow">
                  {zh ? "为你的餐桌寻找灵感" : "A LITTLE INSPIRATION"}
                </p>
                <h2>
                  {zh ? "下一餐，吃什么？" : "Something delicious starts here."}
                </h2>
              </div>
              <Link href="/recipes" className="pp-text-link">
                {zh ? "全部菜谱" : "All recipes"}{" "}
                <span aria-hidden="true">↗</span>
              </Link>
            </div>
            {recipes.length > 0 ? (
              <div className="pp-recipe-grid">
                {recipes.slice(0, 3).map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    language={language}
                  />
                ))}
              </div>
            ) : (
              <div className="pp-empty">
                <h3>
                  {zh
                    ? "你的菜谱故事，从这里开始。"
                    : "Your recipe collection starts here."}
                </h3>
                <Link href="/recipes/new" className="pp-button">
                  {zh ? "添加菜谱" : "Add a recipe"} +
                </Link>
              </div>
            )}
          </div>
        </section>
        <section
          className="pp-container pp-features"
          aria-label={
            zh ? "PantryPal 的功能" : "What you can do with PantryPal"
          }
        >
          {features.map(([number, heading, description]) => (
            <div key={number}>
              <span className="pp-feature-number">{number}</span>
              <h3>{heading}</h3>
              <p>{description}</p>
            </div>
          ))}
        </section>
        <section className="pp-container">
          <div className="pp-cta">
            <div>
              <p className="pp-eyebrow">
                {zh ? "把喜欢的味道留在身边" : "YOUR OWN LITTLE COOKBOOK"}
              </p>
              <h2>
                {zh
                  ? "值得再做一次的菜，收藏起来。"
                  : "Good recipes deserve a second helping."}
              </h2>
            </div>
            <Link href="/favorites" className="pp-button pp-button-dark">
              {zh ? "我的收藏" : "Your saved recipes"}
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
