import type { Env } from "./types";

const SESSION_COOKIE = "talent-registration-session";
const SESSION_DURATION_SECONDS = 60 * 60 * 8;

type SessionPayload = {
  exp: number;
};

function encodeBase64Url(value: Uint8Array | string) {
  const bytes = typeof value === "string" ? new TextEncoder().encode(value) : value;
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "="));
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function sign(value: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
  return crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
}

export async function createSessionCookie(secret: string) {
  const payload: SessionPayload = {
    exp: Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS,
  };
  const encodedPayload = encodeBase64Url(JSON.stringify(payload));
  const signature = encodeBase64Url(new Uint8Array(await sign(encodedPayload, secret)));

  return `${SESSION_COOKIE}=${encodedPayload}.${signature}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_DURATION_SECONDS}`;
}

export async function hasValidSession(request: Request, env: Env) {
  const cookieHeader = request.headers.get("Cookie") ?? "";
  const cookie = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${SESSION_COOKIE}=`));
  const token = cookie?.slice(`${SESSION_COOKIE}=`.length) ?? "";
  const [encodedPayload, encodedSignature] = token.split(".");

  if (!encodedPayload || !encodedSignature || !env.SESSION_SECRET) {
    return false;
  }

  try {
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(env.SESSION_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );
    const isSignatureValid = await crypto.subtle.verify(
      "HMAC",
      key,
      decodeBase64Url(encodedSignature),
      new TextEncoder().encode(encodedPayload),
    );
    const payload = JSON.parse(new TextDecoder().decode(decodeBase64Url(encodedPayload))) as SessionPayload;

    return isSignatureValid && payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export function getCorsHeaders(request: Request, env: Env) {
  const origin = request.headers.get("Origin");
  const headers = new Headers({ "Content-Type": "application/json" });

  if (origin && env.ALLOWED_ORIGIN && origin === env.ALLOWED_ORIGIN) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Access-Control-Allow-Credentials", "true");
    headers.set("Access-Control-Allow-Headers", "Content-Type");
    headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    headers.set("Vary", "Origin");
  }

  return headers;
}

export function unauthorized(request: Request, env: Env) {
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: getCorsHeaders(request, env),
  });
}

export function hasValidServerConfiguration(env: Env) {
  return Boolean(env.DB && env.ADMIN_USERNAME && env.ADMIN_PASSWORD && env.SESSION_SECRET);
}
