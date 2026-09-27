"use client";

import Image from "next/image";
import Link from "next/link";

import { useLanguage } from "@/hooks/useLanguage";
import { translations } from "@/lib/i18n";

import DeleteRecipeButton from "./DeleteRecipeButton";
import FavoriteButton from "./FavoriteButton";
import RatingStars from "./RatingStars";
import SiteFooter from "@/components/SiteFooter";

type RecipeDetail = {
  id: string;

  imageUrl: string | null;

  titleZh: string;
  titleEn: string;

  descriptionZh: string | null;
  descriptionEn: string | null;

  instructionsZh: string;
  instructionsEn: string;

  prepTime: number | null;
  cookTime: number | null;
  servings: number | null;

  category: {
    nameZh: string;
    nameEn: string;
  } | null;

  ingredients: {
    id: string;
    quantity: number | null;
    unit: string | null;

    ingredient: {
      nameZh: string;
      nameEn: string;
    };
  }[];
};

type RecipeDetailClientProps = {
  recipe: RecipeDetail;
  isOwner: boolean;
  isLoggedIn: boolean;
  isFavorited: boolean;

  averageRating: number;
  ratingCount: number;
  userRating: number | null;
};

export default function RecipeDetailClient({
  recipe,
  isOwner,
  isLoggedIn,
  isFavorited,
  averageRating,
  ratingCount,
  userRating,
}: RecipeDetailClientProps) {
  const language = useLanguage();
  const t = translations[language];

  const title = language === "zh" ? recipe.titleZh : recipe.titleEn;

  const description =
    language === "zh" ? recipe.descriptionZh : recipe.descriptionEn;

  const instructions =
    language === "zh" ? recipe.instructionsZh : recipe.instructionsEn;

  const category =
    language === "zh" ? recipe.category?.nameZh : recipe.category?.nameEn;

  const minutesLabel = language === "zh" ? "分钟" : "min";
  return (
    <>
      <main id="main-content" className="pp-container pp-detail-page">
        <Link href="/recipes" className="pp-back-link">
          ← {t.backToRecipes}
        </Link>
        <article>
          <div className="pp-detail-hero">
            <div className="pp-detail-copy">
              <span className="pp-tag">
                {category ??
                  (language === "zh" ? "日常料理" : "Everyday cooking")}
              </span>
              <h1>{title}</h1>
              {description && (
                <p className="pp-detail-description">{description}</p>
              )}
              <dl className="pp-recipe-facts">
                <div>
                  <dt>{t.prep}</dt>
                  <dd>
                    {recipe.prepTime === null
                      ? "—"
                      : `${recipe.prepTime} ${minutesLabel}`}
                  </dd>
                </div>
                <div>
                  <dt>{t.cook}</dt>
                  <dd>
                    {recipe.cookTime === null
                      ? "—"
                      : `${recipe.cookTime} ${minutesLabel}`}
                  </dd>
                </div>
                <div>
                  <dt>{t.servings}</dt>
                  <dd>{recipe.servings ?? "—"}</dd>
                </div>
              </dl>
              <div className="pp-detail-actions">
                <FavoriteButton
                  recipeId={recipe.id}
                  initialFavorited={isFavorited}
                  isLoggedIn={isLoggedIn}
                />
                {isOwner && (
                  <>
                    <Link
                      href={`/recipes/${recipe.id}/edit`}
                      className="pp-button pp-button-secondary"
                    >
                      {language === "zh" ? "编辑菜谱" : "Edit recipe"}
                    </Link>
                    <DeleteRecipeButton recipeId={recipe.id} />
                  </>
                )}
              </div>
              <div className="pp-rating">
                <RatingStars
                  recipeId={recipe.id}
                  averageRating={averageRating}
                  ratingCount={ratingCount}
                  userRating={userRating}
                  isLoggedIn={isLoggedIn}
                />
              </div>
            </div>
            <div className="pp-detail-photo">
              {recipe.imageUrl ? (
                <Image
                  src={recipe.imageUrl}
                  alt={title}
                  fill
                  loading="eager"
                  fetchPriority="high"
                  sizes="(max-width: 799px) calc(100vw - 40px), 540px"
                  className="object-cover"
                />
              ) : (
                <div className="pp-image-placeholder">
                  <span aria-hidden="true">◒</span>
                  {language === "zh"
                    ? "好味道，待你发现"
                    : "Something good is cooking"}
                </div>
              )}
            </div>
          </div>
          <div className="pp-cooking-layout">
            <section className="pp-ingredients">
              <div className="pp-cooking-heading">
                <h2>{t.ingredients}</h2>
                <span>{recipe.ingredients.length}</span>
              </div>
              {recipe.ingredients.length === 0 ? (
                <p className="pp-muted">
                  {language === "zh"
                    ? "暂未添加食材。"
                    : "No ingredients have been added yet."}
                </p>
              ) : (
                <ul>
                  {recipe.ingredients.map((item) => (
                    <li key={item.id}>
                      <span>
                        {language === "zh"
                          ? item.ingredient.nameZh
                          : item.ingredient.nameEn}
                      </span>
                      <span className="pp-quantity">
                        {item.quantity ?? ""} {item.unit ?? ""}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
            <section className="pp-instructions">
              <p className="pp-eyebrow">
                {language === "zh"
                  ? "准备好了吗？开始做饭"
                  : "LET'S MAKE SOMETHING GOOD"}
              </p>
              <h2>{t.instructions}</h2>
              <div className="pp-instructions-text">
                {instructions ||
                  (language === "zh"
                    ? "暂未添加步骤。"
                    : "No instructions have been added yet.")}
              </div>
            </section>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
