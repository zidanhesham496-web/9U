import { NextResponse } from "next/server";
import { hasValidAdminSession } from "@/lib/adminSession";

export async function GET(request: Request) {
  if (!(await hasValidAdminSession(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true });
}