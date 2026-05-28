import { BarChart3 } from "lucide-react";

import AdminAnalyticsPanel from "@/components/components/dashboard/AdminAnalyticsPanel";
import { getAdminAnalytics } from "@/Services/admin-analytics";
import { requireAdmin } from "@/lib/auth";

export default async function AdminAnalyticsPage() {
  await requireAdmin();
  const analytics = await getAdminAnalytics();

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 xl:px-10">
      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600 text-white">
            <BarChart3 size={22} />
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-[0.28em] text-zinc-500">Analytics</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">Platform insights</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-600 dark:text-zinc-400">
              Real data from applications and course enrollments — updated on each page load.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-8">
        <AdminAnalyticsPanel analytics={analytics} />
      </div>
    </main>
  );
}
