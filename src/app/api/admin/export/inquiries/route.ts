import { NextResponse } from "next/server";

import { getContactInquiries } from "@/Services/contact-inquiries";
import { requireAdmin } from "@/lib/auth";
import { toCsv } from "@/lib/csv";

export async function GET() {
  try {
    await requireAdmin();
    const inquiries = await getContactInquiries();

    const csv = toCsv(
      ["Name", "Email", "Phone", "Interest", "Status", "Message", "Created"],
      inquiries.map((row) => [
        row.name,
        row.email,
        row.phone ?? "",
        row.interest_label ?? row.interest,
        row.status ?? "New",
        row.message,
        row.created_at,
      ])
    );

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="contact-inquiries-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }
}
