import { createSessionCookie, getCorsHeaders, hasValidServerConfiguration } from "../../_shared/auth";
import type { PagesContext } from "../../_shared/types";

export async function onRequestPost(context: PagesContext) {
  const { request, env } = context;
  const headers = getCorsHeaders(request, env);

  if (!hasValidServerConfiguration(env)) {
    return new Response(JSON.stringify({ error: "Service is not configured" }), { status: 503, headers });
  }

  try {
    const body = (await request.json()) as { username?: unknown; password?: unknown };
    const isValid = body.username === env.ADMIN_USERNAME && body.password === env.ADMIN_PASSWORD;
    if (!isValid) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401, headers });
    }

    headers.set("Set-Cookie", await createSessionCookie(env.SESSION_SECRET));
    return new Response(JSON.stringify({ authenticated: true }), { headers });
  } catch {
    return new Response(JSON.stringify({ error: "Unable to sign in" }), { status: 400, headers });
  }
}
