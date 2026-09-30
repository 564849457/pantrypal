import { authenticatedJavaGet, javaApiEnabled, type JavaUser } from "@/lib/java-session";
export async function GET() {
  const headers = { "Cache-Control": "no-store, private", Vary: "Cookie" };
  if (!javaApiEnabled) return Response.json({ error: "java_api_not_configured" }, { status: 503, headers });
  try {
    const response = await authenticatedJavaGet("/api/v1/me");
    if (response.status === 401) return Response.json({ error: "unauthorized" }, { status: 401, headers });
    if (!response.ok) return Response.json({ error: "java_auth_unavailable" }, { status: 503, headers });
    const user: JavaUser = await response.json();
    // Whitelist public profile fields. Never proxy headers, tokens or full upstream bodies.
    return Response.json({ id: user.id, name: user.name, image: user.image }, { headers });
  } catch {
    return Response.json({ error: "java_auth_unavailable" }, { status: 503, headers });
  }
}
