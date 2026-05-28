import { NextResponse } from "next/server";

import { getAllEnrollments } from "@/Services/admin-enrollments";
import { requireAdmin } from "@/lib/auth";
import { toCsv } from "@/lib/csv";

export async function GET() {
  try {
    await requireAdmin();
    const enrollments = await getAllEnrollments();

    const csv = toCsv(
      ["Student", "Email", "Course", "Amount (paise)", "Status", "Order ID", "Created"],
      enrollments.map((row) => [
        row.student_name ?? "",
        row.email ?? "",
        row.course_title,
        row.amount_paise,
        row.status,
        row.razorpay_order_id,
        row.created_at,
      ])
    );

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="enrollments-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }
}
