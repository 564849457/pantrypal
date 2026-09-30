import { readRecipeCategories, readRecipePage } from "@/lib/recipe-reader";
import { parseRecipeQuery } from "@/lib/recipe-query";
import CatalogClient from "./CatalogClient";

export default async function RecipesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = parseRecipeQuery(await searchParams);
  const [result, categories] = await Promise.all([
    readRecipePage(query),
    readRecipeCategories(),
  ]);
  return (
    <CatalogClient
      key={JSON.stringify(query)}
      query={query}
      recipes={result.items}
      hasNext={result.hasNext}
      categories={categories}
    />
  );
}
