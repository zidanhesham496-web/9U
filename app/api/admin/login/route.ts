import { NextResponse } from "next/server";
import { adminSessionCookie, createAdminSessionValue } from "@/lib/adminSession";

export async function POST(request: Request) {
  const expectedUsername = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedUsername || !expectedPassword || !process.env.SESSION_SECRET) {
    return NextResponse.json({ error: "Service is not configured" }, { status: 503 });
  }

  try {
    const body = (await request.json()) as { username?: unknown; password?: unknown };
    if (body.username !== expectedUsername || body.password !== expectedPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const response = NextResponse.json({ authenticated: true });
    response.cookies.set({
      name: adminSessionCookie.name,
      value: await createAdminSessionValue(process.env.SESSION_SECRET),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: adminSessionCookie.maxAge,
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Unable to sign in" }, { status: 400 });
  }
}