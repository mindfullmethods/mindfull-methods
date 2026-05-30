import { NextResponse } from "next/server";

import { notifyAdminDigest } from "@/lib/email";
import { getAdminHomeSummary } from "@/Services/admin-home";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  const authHeader = request.headers.get("authorization");

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const summary = await getAdminHomeSummary();

  await notifyAdminDigest({
    pendingApplications: summary.pendingApplicationsCount,
    newInquiries: summary.newInquiriesCount,
    paidEnrollments: summary.analytics.totals.paidEnrollments,
    revenuePaise: summary.analytics.totals.revenuePaise,
    setupPercent: summary.setup.percent,
  });

  return NextResponse.json({ ok: true });
}
