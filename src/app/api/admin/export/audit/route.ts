import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth";
import { toCsv } from "@/lib/csv";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    await requireAdmin();
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("admin_audit_log")
      .select("created_at, actor_email, action, entity_type, entity_id")
      .order("created_at", { ascending: false })
      .limit(5000);

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    const csv = toCsv(
      ["Created", "Actor", "Action", "Entity type", "Entity ID"],
      (data ?? []).map((row) => [
        row.created_at,
        row.actor_email,
        row.action,
        row.entity_type ?? "",
        row.entity_id ?? "",
      ])
    );

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="admin-audit-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }
}
