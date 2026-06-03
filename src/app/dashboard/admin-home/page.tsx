import Link from "next/link";
import {
  ArrowRight,
  Award,
  BarChart3,
  ClipboardList,
  CreditCard,
  History,
  Mail,
  Rocket,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";

import SendDigestButton from "@/components/components/dashboard/SendDigestButton";
import DashboardPageHeader from "@/components/components/dashboard/DashboardPageHeader";
import { getRecentAuditLog } from "@/Services/admin-audit-log";
import { getAdminHomeSummary } from "@/Services/admin-home";
import { requireAdmin } from "@/lib/auth";

function formatAmount(paise: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(paise / 100);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default async function AdminHomePage() {
  await requireAdmin();
  const [summary, auditLog] = await Promise.all([getAdminHomeSummary(), getRecentAuditLog(10)]);
  const { analytics, setup } = summary;

  const quickLinks = [
    { href: "/dashboard/applications", label: "Applications", icon: ClipboardList, badge: summary.pendingApplicationsCount },
    { href: "/dashboard/inquiries", label: "Inquiries", icon: Mail, badge: summary.newInquiriesCount },
    { href: "/dashboard/analytics", label: "Analytics & reviews", icon: BarChart3, badge: summary.pendingCertificateReviews.length },
    { href: "/dashboard/growth", label: "Growth", icon: TrendingUp, badge: null },
    { href: "/dashboard/enrollments", label: "Enrollments", icon: CreditCard, badge: analytics.totals.paidEnrollments },
    { href: "/dashboard/admin/audit", label: "Audit log", icon: History, badge: null },
    { href: "/dashboard/users", label: "Students", icon: Users, badge: null },
    { href: "/dashboard/admin", label: "Admin Studio", icon: ShieldCheck, badge: null },
    { href: "/dashboard/setup", label: "Launch setup", icon: Rocket, badge: setup.total - setup.ready },
  ];

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 xl:px-10">
      <DashboardPageHeader
        variant="hero"
        eyebrow="Admin home"
        title="Today at a glance"
        description="Pending work, revenue, and launch readiness — one screen for daily admin."
      >
        <div className="mt-7 inline-flex rounded-2xl bg-violet-600 px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">Launch ready</p>
            <p className="mt-1 text-4xl font-bold text-white">{setup.percent}%</p>
            <p className="text-sm font-semibold text-white/90">
              {setup.ready}/{setup.total} checks
            </p>
          </div>
        </div>
      </DashboardPageHeader>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Pending applications", value: summary.pendingApplicationsCount },
          { label: "Certificate reviews", value: summary.pendingCertificateReviews.length },
          { label: "New inquiries", value: summary.newInquiriesCount },
          { label: "Paid enrollments", value: analytics.totals.paidEnrollments },
        ].map((stat) => (
          <div key={stat.label} className="mm-metric-glow p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] mm-subtle">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold mm-heading">{stat.value}</p>
          </div>
        ))}
      </section>

      {summary.pendingCertificateReviews.length > 0 ? (
        <section className="mt-8 mm-section-panel border-amber-200 bg-amber-50/80 dark:border-amber-400/20 dark:bg-amber-400/10">
          <div className="relative flex items-center justify-between gap-4">
            <h2 className="flex items-center gap-2 text-lg font-bold mm-heading">
              <Award size={18} className="text-amber-600" />
              Pending certificate reviews
            </h2>
            <Link href="/dashboard/analytics" className="text-sm font-bold text-violet-600 dark:text-violet-300">
              View all →
            </Link>
          </div>
          <ul className="relative mt-4 space-y-3">
            {summary.pendingCertificateReviews.slice(0, 5).map((review) => (
              <li key={`${review.userId}-${review.courseSlug}`}>
                <Link
                  href={`/dashboard/users/${review.userId}`}
                  className="flex flex-col gap-1 rounded-xl border mm-border bg-white/80 p-4 transition hover:border-violet-300 dark:bg-white/[0.03] sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-bold mm-heading">{review.courseTitle}</p>
                    <p className="text-sm mm-muted">Student profile · review & approve</p>
                  </div>
                  <p className="text-xs font-semibold mm-subtle">
                    Requested {formatDate(review.requestedAt)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="mm-card-premium flex items-center justify-between p-5 transition hover:-translate-y-0.5"
          >
            <span className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
                <link.icon size={20} />
              </span>
              <span className="font-bold mm-heading">{link.label}</span>
            </span>
            {link.badge != null && link.badge > 0 ? (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 dark:bg-amber-400/20 dark:text-amber-200">
                {link.badge}
              </span>
            ) : (
              <ArrowRight size={18} className="mm-subtle" />
            )}
          </Link>
        ))}
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-3">
        <div className="mm-section-panel">
          <h2 className="text-lg font-bold mm-heading">Recent applications</h2>
          <ul className="mt-4 space-y-3">
            {summary.recentApplications.map((a) => (
              <li key={a.id} className="text-sm">
                <p className="font-bold">{a.student_name ?? "Applicant"}</p>
                <p className="text-zinc-500">{a.internship?.title ?? "—"} · {a.status ?? "Pending"}</p>
              </li>
            ))}
            {!summary.recentApplications.length ? <p className="text-sm text-zinc-500">None yet</p> : null}
          </ul>
        </div>
        <div className="mm-section-panel">
          <h2 className="text-lg font-bold mm-heading">Recent inquiries</h2>
          <ul className="mt-4 space-y-3">
            {summary.recentInquiries.map((i) => (
              <li key={i.id} className="text-sm">
                <p className="font-bold">{i.name}</p>
                <p className="text-zinc-500">{i.status ?? "New"} · {formatDate(i.created_at)}</p>
              </li>
            ))}
            {!summary.recentInquiries.length ? <p className="text-sm text-zinc-500">None yet</p> : null}
          </ul>
        </div>
        <div className="mm-section-panel">
          <h2 className="text-lg font-bold mm-heading">Recent enrollments</h2>
          <ul className="mt-4 space-y-3">
            {summary.recentEnrollments.map((e) => (
              <li key={e.id} className="text-sm">
                <p className="font-bold">{e.student_name ?? e.email ?? "Guest"}</p>
                <p className="text-zinc-500">{e.course_title} · {formatAmount(e.amount_paise)}</p>
              </li>
            ))}
            {!summary.recentEnrollments.length ? <p className="text-sm text-zinc-500">None yet</p> : null}
          </ul>
        </div>
      </section>

      {auditLog.length > 0 ? (
        <section className="mt-8 mm-section-panel">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold mm-heading">Recent admin activity</h2>
            <Link
              href="/dashboard/admin/audit"
              className="text-sm font-bold text-violet-600 dark:text-violet-300"
            >
              View all →
            </Link>
          </div>
          <ul className="mt-4 space-y-3">
            {auditLog.map((row) => (
              <li key={row.id} className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
                <span>
                  <span className="font-bold">{row.action}</span>
                  {row.entity_id ? (
                    <span className="text-zinc-500">
                      {" "}
                      · {row.entity_type ?? "item"} {row.entity_id.slice(0, 24)}
                      {row.entity_id.length > 24 ? "…" : ""}
                    </span>
                  ) : null}
                </span>
                <span className="text-zinc-500">
                  {row.actor_email} · {formatDate(row.created_at)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-8 mm-section-panel flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] mm-subtle">
            <BarChart3 size={14} /> Notifications
          </p>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Email yourself a summary now. For daily cron, set CRON_SECRET on Vercel and hit{" "}
            <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">/api/admin/digest</code>.
          </p>
        </div>
        <SendDigestButton />
      </section>
    </main>
  );
}
