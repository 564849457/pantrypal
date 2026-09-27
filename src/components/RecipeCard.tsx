import Image from "next/image";
import Link from "next/link";
import type { Language } from "@/hooks/useLanguage";

export type RecipeCardData = {
  id: string;
  imageUrl: string | null;
  titleZh: string;
  titleEn: string;
  descriptionZh: string | null;
  descriptionEn: string | null;
  prepTime: number | null;
  cookTime: number | null;
  servings?: number | null;
  category: { nameZh: string; nameEn: string } | null;
};

export default function RecipeCard({
  recipe,
  language,
  eager = false,
}: {
  recipe: RecipeCardData;
  language: Language;
  eager?: boolean;
}) {
  const zh = language === "zh";
  const title = zh ? recipe.titleZh : recipe.titleEn;
  const description = zh ? recipe.descriptionZh : recipe.descriptionEn;
  const category = zh ? recipe.category?.nameZh : recipe.category?.nameEn;
  const minutes = (recipe.prepTime ?? 0) + (recipe.cookTime ?? 0);
  return (
    <article className="pp-card">
      <Link href={`/recipes/${recipe.id}`} className="pp-card-link">
        <div className="pp-card-image">
          {recipe.imageUrl ? (
            <Image
              src={recipe.imageUrl}
              alt={title}
              fill
              sizes="(max-width: 639px) calc(100vw - 40px), (max-width: 959px) 46vw, 360px"
              loading={eager ? "eager" : "lazy"}
              className="object-cover"
            />
          ) : (
            <div className="pp-image-placeholder">
              <span aria-hidden="true">◒</span>
              {zh ? "好味道，待你发现" : "Something good is cooking"}
            </div>
          )}
          {category && <span className="pp-image-label">{category}</span>}
        </div>
        <div className="pp-card-body">
          <div className="pp-card-meta">
            <span>
              {minutes > 0
                ? `${minutes} ${zh ? "分钟" : "min"}`
                : zh
                  ? "日常料理"
                  : "Everyday cooking"}
            </span>
            {recipe.servings != null && recipe.servings > 0 && (
              <span>
                {recipe.servings} {zh ? "人份" : "servings"}
              </span>
            )}
          </div>
          <h3>{title}</h3>
          {description && <p className="pp-card-description">{description}</p>}
          <span className="pp-card-action">
            {zh ? "查看菜谱" : "Let's cook"}
            <span aria-hidden="true">↗</span>
          </span>
        </div>
      </Link>
    </article>
  );
}
