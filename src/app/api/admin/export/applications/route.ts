import { NextResponse } from "next/server";

import { getApplications } from "@/Services/getApplications";
import { requireAdmin } from "@/lib/auth";
import { toCsv } from "@/lib/csv";

export async function GET() {
  try {
    await requireAdmin();
    const applications = await getApplications();

    const csv = toCsv(
      ["Student", "Email", "Internship", "Company", "Status", "Created"],
      applications.map((app) => [
        app.student_name ?? "",
        app.email ?? "",
        app.internship?.title ?? "",
        app.internship?.company ?? "",
        app.status ?? "Pending",
        app.created_at ?? "",
      ])
    );

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="applications-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }
}
