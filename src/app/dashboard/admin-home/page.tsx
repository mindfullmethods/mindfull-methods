import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  ClipboardList,
  CreditCard,
  Mail,
  Rocket,
  ShieldCheck,
  Users,
} from "lucide-react";

import SendDigestButton from "@/components/components/dashboard/SendDigestButton";
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
  const summary = await getAdminHomeSummary();
  const { analytics, setup } = summary;

  const quickLinks = [
    { href: "/dashboard/applications", label: "Applications", icon: ClipboardList, badge: summary.pendingApplicationsCount },
    { href: "/dashboard/inquiries", label: "Inquiries", icon: Mail, badge: summary.newInquiriesCount },
    { href: "/dashboard/enrollments", label: "Enrollments", icon: CreditCard, badge: analytics.totals.paidEnrollments },
    { href: "/dashboard/users", label: "Students", icon: Users, badge: null },
    { href: "/dashboard/admin", label: "Admin Studio", icon: ShieldCheck, badge: null },
    { href: "/dashboard/setup", label: "Launch setup", icon: Rocket, badge: setup.total - setup.ready },
  ];

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 xl:px-10">
      <section className="rounded-3xl bg-zinc-950 p-6 text-white shadow-xl sm:p-8">
        <p className="text-sm font-black uppercase tracking-[0.28em] text-white/50">Admin home</p>
        <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight sm:text-6xl">Today at a glance</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65">
              Pending work, revenue, and launch readiness — one screen for daily admin.
            </p>
          </div>
          <div className="rounded-2xl bg-violet-600 px-6 py-4">
            <p className="text-xs font-black uppercase tracking-[0.2em] opacity-80">Launch ready</p>
            <p className="mt-1 text-4xl font-black">{setup.percent}%</p>
            <p className="text-sm font-bold opacity-90">
              {setup.ready}/{setup.total} checks
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Pending applications", value: summary.pendingApplicationsCount },
          { label: "New inquiries", value: summary.newInquiriesCount },
          { label: "Paid enrollments", value: analytics.totals.paidEnrollments },
          { label: "Revenue", value: formatAmount(analytics.totals.revenuePaise) },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-3xl border border-zinc-200 bg-white p-5 dark:border-white/10 dark:bg-white/5"
          >
            <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">{stat.label}</p>
            <p className="mt-2 text-3xl font-black">{stat.value}</p>
          </div>
        ))}
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center justify-between rounded-3xl border border-zinc-200 bg-white p-5 transition hover:border-violet-300 dark:border-white/10 dark:bg-white/5"
          >
            <span className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
                <link.icon size={20} />
              </span>
              <span className="font-black">{link.label}</span>
            </span>
            {link.badge != null && link.badge > 0 ? (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-800 dark:bg-amber-400/20 dark:text-amber-200">
                {link.badge}
              </span>
            ) : (
              <ArrowRight size={18} className="text-zinc-400" />
            )}
          </Link>
        ))}
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 dark:border-white/10 dark:bg-white/5 sm:p-6">
          <h2 className="text-lg font-black">Recent applications</h2>
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
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 dark:border-white/10 dark:bg-white/5 sm:p-6">
          <h2 className="text-lg font-black">Recent inquiries</h2>
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
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 dark:border-white/10 dark:bg-white/5 sm:p-6">
          <h2 className="text-lg font-black">Recent enrollments</h2>
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

      <section className="mt-8 flex flex-col gap-6 rounded-3xl border border-zinc-200 bg-white p-6 dark:border-white/10 dark:bg-white/5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-zinc-500">
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
