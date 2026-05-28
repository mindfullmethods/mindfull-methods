import AnalyticsChart from "@/components/components/dashboard/AnalyticsChart";
import type { AdminAnalytics } from "@/Services/admin-analytics";

function formatAmount(paise: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(paise / 100);
}

export default function AdminAnalyticsPanel({ analytics }: { analytics: AdminAnalytics }) {
  const { totals, applicationsByDay, enrollmentsByDay, applicationStatuses } = analytics;
  const statusMax = Math.max(1, ...applicationStatuses.map((s) => s.value));

  return (
    <div className="space-y-8">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Applications", value: totals.applications, helper: `${totals.pendingApplications} pending` },
          { label: "Approved", value: totals.approvedApplications, helper: "Internship approvals" },
          { label: "Paid enrollments", value: totals.paidEnrollments, helper: "Course purchases" },
          { label: "Revenue", value: formatAmount(totals.revenuePaise), helper: "From enrollments" },
        ].map((card) => (
          <article
            key={card.label}
            className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5"
          >
            <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">{card.label}</p>
            <p className="mt-3 text-3xl font-black">{card.value}</p>
            <p className="mt-2 text-sm text-zinc-500">{card.helper}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
          <h2 className="text-xl font-black">Applications — last 7 days</h2>
          <div className="mt-6">
            <AnalyticsChart data={applicationsByDay} emptyLabel="No applications this week" />
          </div>
        </div>
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
          <h2 className="text-xl font-black">Enrollments — last 7 days</h2>
          <div className="mt-6">
            <AnalyticsChart
              data={enrollmentsByDay}
              emptyLabel="No enrollments this week"
              barClassName="bg-violet-600"
            />
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
        <h2 className="text-xl font-black">Application status breakdown</h2>
        <div className="mt-6 space-y-4">
          {applicationStatuses.map((item) => (
            <div key={item.label}>
              <div className="mb-2 flex items-center justify-between text-sm font-bold">
                <span>{item.label}</span>
                <span>{item.value}</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                <div
                  className={`h-full rounded-full ${
                    item.label === "Approved"
                      ? "bg-emerald-500"
                      : item.label === "Rejected"
                        ? "bg-red-500"
                        : "bg-amber-500"
                  }`}
                  style={{ width: `${Math.max(item.value > 0 ? 8 : 0, (item.value / statusMax) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
