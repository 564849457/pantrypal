import "server-only";
import { cookies } from "next/headers";
import { sessionTokenFromCookies } from "@/lib/session-cookie";

export type JavaUser = { id: string; name: string | null; image: string | null };
export type RecipeAccess = { isOwner: boolean; isFavorited: boolean; userRating: number | null };
export const javaApiEnabled = Boolean(process.env.RECIPE_API_URL);

// Only called with fixed application paths, never an arbitrary client-provided URL.
export async function authenticatedJavaGet(path: string): Promise<Response> {
  const configured = process.env.RECIPE_API_URL;
  if (!configured) throw new Error("RECIPE_API_URL is not configured");
  const target = new URL(configured);
  if (target.username || target.password || target.search || target.hash)
    throw new Error("Invalid RECIPE_API_URL");
  if (target.protocol !== "https:" && !(target.protocol === "http:" && ["127.0.0.1", "localhost", "[::1]"].includes(target.hostname)))
    throw new Error("Authenticated Java requests require HTTPS outside localhost");
  const token = sessionTokenFromCookies((await cookies()).getAll());
  if (!token) return new Response(null, { status: 401 });
  return fetch(`${configured.replace(/\/$/, "")}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store", redirect: "error", signal: AbortSignal.timeout(10000),
  });
}

export async function javaRecipeAccess(id: string): Promise<RecipeAccess | null> {
  const response = await authenticatedJavaGet(`/api/v1/me/recipes/${encodeURIComponent(id)}`);
  if (response.status === 401) return null;
  if (!response.ok) throw new Error(`Java recipe access returned ${response.status}`);
  return response.json() as Promise<RecipeAccess>;
}
