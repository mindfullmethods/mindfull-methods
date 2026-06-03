import { Suspense } from "react";

import AdminReferralCodesPanel from "@/components/components/dashboard/AdminReferralCodesPanel";
import GrowthAdminPanel from "@/components/components/dashboard/GrowthAdminPanel";
import DashboardPageHeader from "@/components/components/dashboard/DashboardPageHeader";
import { getGrowthSummary } from "@/Services/admin-growth";
import { requireAdmin } from "@/lib/auth";
import { isPlatformSettingsReady } from "@/lib/platform-content";
import { getReferralCodes } from "@/lib/referral-codes";
import { getReferralStats } from "@/lib/referral-events";
import { isV3GrowthReady } from "@/lib/v3-platform-schema";

export default async function GrowthPage({
  searchParams,
}: {
  searchParams: Promise<{ course?: string }>;
}) {
  await requireAdmin();
  const { course } = await searchParams;
  const [summary, referralCodes, referralStats, tableReady, v3Ready] = await Promise.all([
    getGrowthSummary(course),
    getReferralCodes(),
    getReferralStats(),
    isPlatformSettingsReady(),
    isV3GrowthReady(),
  ]);

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 xl:px-10">
      <DashboardPageHeader
        eyebrow="Growth"
        title="Waitlist & newsletter"
        description="Course waitlist signups, footer newsletter subscribers, and checkout funnel counts."
      />
      <div className="mt-8">
        <Suspense fallback={<p className="text-sm text-zinc-500">Loading…</p>}>
          <GrowthAdminPanel summary={summary} />
        </Suspense>
        <div className="mt-8">
          <AdminReferralCodesPanel
            initialCodes={referralCodes}
            stats={referralStats}
            tableReady={tableReady}
            v3Ready={v3Ready}
          />
        </div>
      </div>
    </main>
  );
}
