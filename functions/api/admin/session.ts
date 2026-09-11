import { getCorsHeaders, hasValidServerConfiguration, hasValidSession, unauthorized } from "../../_shared/auth";
import type { PagesContext } from "../../_shared/types";

export async function onRequestGet(context: PagesContext) {
  const { request, env } = context;
  if (!hasValidServerConfiguration(env) || !(await hasValidSession(request, env))) {
    return unauthorized(request, env);
  }

  return new Response(JSON.stringify({ authenticated: true }), {
    headers: getCorsHeaders(request, env),
  });
}
