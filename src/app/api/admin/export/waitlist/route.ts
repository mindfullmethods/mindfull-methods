import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth";
import { toCsv } from "@/lib/csv";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const courseSlug = searchParams.get("course")?.trim();

    const admin = createAdminClient();
    let query = admin
      .from("course_waitlist")
      .select("course_slug, email, full_name, created_at")
      .order("created_at", { ascending: false });

    if (courseSlug) query = query.eq("course_slug", courseSlug);

    const { data, error } = await query;
    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    const csv = toCsv(
      ["Course", "Email", "Name", "Joined"],
      (data ?? []).map((row) => [
        row.course_slug,
        row.email,
        row.full_name ?? "",
        row.created_at,
      ])
    );

    const suffix = courseSlug ? `-${courseSlug}` : "";
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="waitlist${suffix}-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }
}
