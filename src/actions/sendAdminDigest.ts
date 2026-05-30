"use server";

import { requireAdmin } from "@/lib/auth";
import { notifyAdminDigest } from "@/lib/email";
import { getAdminHomeSummary } from "@/Services/admin-home";

export async function sendAdminDigestEmail() {
  await requireAdmin();

  const summary = await getAdminHomeSummary();

  try {
    await notifyAdminDigest({
      pendingApplications: summary.pendingApplicationsCount,
      newInquiries: summary.newInquiriesCount,
      paidEnrollments: summary.analytics.totals.paidEnrollments,
      revenuePaise: summary.analytics.totals.revenuePaise,
      setupPercent: summary.setup.percent,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to send digest.";
    return { ok: false as const, error: message };
  }

  return { ok: true as const };
}
