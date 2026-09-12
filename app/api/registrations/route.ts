import { NextResponse } from "next/server";
import { hasValidAdminSession } from "@/lib/adminSession";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

type RegistrationBody = {
  name?: unknown;
  nationalId?: unknown;
  grade?: unknown;
  college?: unknown;
  phone?: unknown;
  talent?: unknown;
};

const allowedTalents = new Set([
  "singing",
  "acting",
  "performance",
  "script-writing",
  "poetry-writing",
  "poetry-recitation",
]);

const allowedGrades = new Set(["first", "second", "third", "fourth", "fifth"]);

function validateBody(body: RegistrationBody) {
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const nationalId = typeof body.nationalId === "string" ? body.nationalId.trim() : "";
  const grade = typeof body.grade === "string" ? body.grade : "";
  const college = typeof body.college === "string" ? body.college.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const talent = typeof body.talent === "string" ? body.talent : "";
  const phoneDigits = phone.replace(/\D/g, "");

  if (
    !name ||
    name.length > 120 ||
    !nationalId ||
    !/^[23][0-9]{13}$/.test(nationalId) ||
    !allowedGrades.has(grade) ||
    !college ||
    college.length > 160 ||
    !talent ||
    !allowedTalents.has(talent) ||
    !phone ||
    phone.length > 40 ||
    phoneDigits.length < 7 ||
    phoneDigits.length > 15
  ) {
    return null;
  }

  return { name, national_id: nationalId, grade, college, phone, talent };
}

export async function POST(request: Request) {
  try {
    const validated = validateBody((await request.json()) as RegistrationBody);
    if (!validated) {
      return NextResponse.json({ error: "Invalid registration" }, { status: 400 });
    }

    const { data, error } = await getSupabaseAdmin()
      .from("registrations")
      .insert({
        name: validated.name,
        national_id: validated.national_id,
        grade: validated.grade,
        college: validated.college,
        phone: validated.phone,
        talent: validated.talent,
      })
      .select("id, created_at")
      .single();

    if (error || !data) {
      console.error("Failed to save registration", error?.message);
      return NextResponse.json({ error: "Unable to save registration" }, { status: 500 });
    }

    return NextResponse.json({ id: data.id, createdAt: data.created_at }, { status: 201 });
  } catch (error) {
    console.error("Failed to save registration", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Unable to save registration" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  if (!(await hasValidAdminSession(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data, error } = await getSupabaseAdmin()
      .from("registrations")
      .select("id, name, national_id, grade, college, phone, talent, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to load registrations", error.message);
      return NextResponse.json({ error: "Unable to load registrations" }, { status: 500 });
    }

    return NextResponse.json(
      (data ?? []).map((row) => ({
        id: row.id,
        name: row.name,
        nationalId: row.national_id,
        grade: row.grade,
        college: row.college,
        phone: row.phone,
        talent: row.talent,
        createdAt: row.created_at,
      })),
    );
  } catch (error) {
    console.error("Failed to load registrations", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Unable to load registrations" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await hasValidAdminSession(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = new URL(request.url).searchParams.get("id")?.trim() ?? "";
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    return NextResponse.json({ error: "Invalid registration id" }, { status: 400 });
  }

  try {
    const { error } = await getSupabaseAdmin().from("registrations").delete().eq("id", id);

    if (error) {
      console.error("Failed to delete registration", error.message);
      return NextResponse.json({ error: "Unable to delete registration" }, { status: 500 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete registration", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Unable to delete registration" }, { status: 500 });
  }
}