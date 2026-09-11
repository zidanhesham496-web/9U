import { getCorsHeaders, hasValidServerConfiguration, hasValidSession, unauthorized } from "../_shared/auth";
import type { Env, PagesContext } from "../_shared/types";

type RegistrationBody = {
  name?: unknown;
  college?: unknown;
  phone?: unknown;
  talent?: unknown;
};

type RegistrationRow = {
  id: string;
  name: string;
  college: string;
  phone: string;
  talent: string;
  created_at: string;
};

const allowedTalents = new Set([
  "singing",
  "acting",
  "performance",
  "script-writing",
  "poetry-writing",
  "poetry-recitation",
]);

function jsonResponse(request: Request, env: Env, body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: getCorsHeaders(request, env) });
}

function validateBody(body: RegistrationBody) {
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const college = typeof body.college === "string" ? body.college.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const talent = typeof body.talent === "string" ? body.talent : "";
  const phoneDigits = phone.replace(/\D/g, "");

  if (!name || name.length > 120 || !college || college.length > 160 || !talent || !allowedTalents.has(talent)) {
    return null;
  }

  if (!phone || phone.length > 40 || phoneDigits.length < 7 || phoneDigits.length > 15) {
    return null;
  }

  return { name, college, phone, talent };
}

function toRecord(row: RegistrationRow) {
  return {
    id: row.id,
    name: row.name,
    college: row.college,
    phone: row.phone,
    talent: row.talent,
    createdAt: row.created_at,
  };
}

export async function onRequestOptions(context: PagesContext) {
  return new Response(null, { status: 204, headers: getCorsHeaders(context.request, context.env) });
}

export async function onRequestGet(context: PagesContext) {
  const { request, env } = context;
  if (!hasValidServerConfiguration(env)) {
    return jsonResponse(request, env, { error: "Service is not configured" }, 503);
  }
  if (!(await hasValidSession(request, env))) {
    return unauthorized(request, env);
  }

  try {
    const result = await env.DB.prepare(
      "SELECT id, name, college, phone, talent, created_at FROM registrations ORDER BY created_at DESC",
    ).all<RegistrationRow>();
    return jsonResponse(request, env, result.results.map(toRecord));
  } catch (error) {
    console.error("Failed to load registrations", error);
    return jsonResponse(request, env, { error: "Unable to load registrations" }, 500);
  }
}

export async function onRequestPost(context: PagesContext) {
  const { request, env } = context;
  if (!hasValidServerConfiguration(env)) {
    return jsonResponse(request, env, { error: "Service is not configured" }, 503);
  }

  try {
    const body = (await request.json()) as RegistrationBody;
    const validated = validateBody(body);
    if (!validated) {
      return jsonResponse(request, env, { error: "Invalid registration" }, 400);
    }

    const record = {
      id: crypto.randomUUID(),
      ...validated,
      createdAt: new Date().toISOString(),
    };
    await env.DB.prepare(
      "INSERT INTO registrations (id, name, college, phone, talent, created_at) VALUES (?, ?, ?, ?, ?, ?)",
    ).bind(record.id, record.name, record.college, record.phone, record.talent, record.createdAt).run();

    return jsonResponse(request, env, record, 201);
  } catch (error) {
    console.error("Failed to save registration", error);
    return jsonResponse(request, env, { error: "Unable to save registration" }, 500);
  }
}
