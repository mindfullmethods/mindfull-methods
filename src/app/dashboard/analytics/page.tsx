import { BarChart3 } from "lucide-react";

import AdminAnalyticsPanel from "@/components/components/dashboard/AdminAnalyticsPanel";
import DashboardPageHeader from "@/components/components/dashboard/DashboardPageHeader";
import { getAdminAnalytics } from "@/Services/admin-analytics";
import { requireAdmin } from "@/lib/auth";
import { getPromoUsageStats } from "@/lib/promo-analytics";

export default async function AdminAnalyticsPage() {
  await requireAdmin();
  const [analytics, promoUsage] = await Promise.all([getAdminAnalytics(), getPromoUsageStats()]);

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 xl:px-10">
      <DashboardPageHeader
        eyebrow="Analytics"
        title="Platform insights"
        description="Real data from applications and course enrollments — updated on each page load."
      >
        <div className="mt-6 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600 text-white">
          <BarChart3 size={22} />
        </div>
      </DashboardPageHeader>

      <div className="mt-8">
        <AdminAnalyticsPanel analytics={analytics} promoUsage={promoUsage} />
      </div>
    </main>
  );
}
