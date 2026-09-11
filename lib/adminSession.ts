const SESSION_COOKIE = "talent-registration-session";
const SESSION_DURATION_SECONDS = 60 * 60 * 8;

type SessionPayload = { exp: number };

function encodeBase64Url(value: Uint8Array | string) {
  const bytes = typeof value === "string" ? new TextEncoder().encode(value) : value;
  return Buffer.from(bytes).toString("base64url");
}

function decodeBase64Url(value: string) {
  return new Uint8Array(Buffer.from(value, "base64url"));
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

export async function createAdminSessionValue(secret: string) {
  const payload: SessionPayload = {
    exp: Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS,
  };
  const encodedPayload = encodeBase64Url(JSON.stringify(payload));
  const signature = encodeBase64Url(new Uint8Array(await sign(encodedPayload, secret)));
  return `${encodedPayload}.${signature}`;
}

export async function hasValidAdminSession(request: Request) {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    return false;
  }

  const cookieHeader = request.headers.get("cookie") ?? "";
  const cookie = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${SESSION_COOKIE}=`));
  const token = cookie?.slice(`${SESSION_COOKIE}=`.length) ?? "";
  const [encodedPayload, encodedSignature] = token.split(".");

  if (!encodedPayload || !encodedSignature) {
    return false;
  }

  try {
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
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

export const adminSessionCookie = {
  name: SESSION_COOKIE,
  maxAge: SESSION_DURATION_SECONDS,
};