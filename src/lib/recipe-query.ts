export type CatalogQuery = {
  q: string;
  category: string;
  page: number;
  size: number;
};
export function parseRecipeQuery(
  params: Record<string, string | string[] | undefined>,
): CatalogQuery {
  const one = (key: string) =>
    typeof params[key] === "string" ? (params[key] as string) : "";
  const integer = (key: string, fallback: number, min: number, max: number) => {
    const raw = one(key);
    if (!/^\d+$/.test(raw)) return fallback;
    const n = Number(raw);
    return Number.isSafeInteger(n) && n >= min && n <= max ? n : fallback;
  };
  return {
    q: one("q").trim().slice(0, 120),
    category: one("category").trim().slice(0, 128),
    page: integer("page", 0, 0, 100000),
    size: integer("size", 12, 1, 100),
  };
}
export function recipeListUrl(query: CatalogQuery) {
  const params = new URLSearchParams();
  if (query.q) params.set("q", query.q);
  if (query.category) params.set("category", query.category);
  if (query.page) params.set("page", String(query.page));
  if (query.size !== 12) params.set("size", String(query.size));
  return `/recipes${params.size ? `?${params}` : ""}`;
}
