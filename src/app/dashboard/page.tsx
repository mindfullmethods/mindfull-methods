import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, CheckCircle2, ClipboardList, Sparkles, TrendingUp } from "lucide-react";
import AnalyticsChart from "@/components/components/dashboard/AnalyticsChart";
import InternshipList from "@/components/components/dashboard/InternshipList";
import { getInternships } from "@/Services/Internships";
import { getMyApplications } from "@/Services/applications";

export default async function DashboardPage() {
  const internships = await getInternships();
  const applications = await getMyApplications();

  const metrics = [
    {
      label: "Open internships",
      value: internships.length,
      helper: "Published opportunities",
      icon: BriefcaseBusiness,
    },
    {
      label: "My applications",
      value: applications.length,
      helper: "Submitted from this account",
      icon: ClipboardList,
    },
    {
      label: "Platform stage",
      value: "Live",
      helper: "Connected SaaS workspace",
      icon: CheckCircle2,
    },
  ];

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 xl:px-10">
      <section className="rounded-3xl bg-zinc-950 p-6 text-white shadow-xl sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold">
              <Sparkles size={16} />
              Mindfull Methods workspace
            </div>
            <h1 className="mt-6 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
              Manage internships, applications, and growth from one place.
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
              A focused command center for students and admins to move from discovery to application decisions.
            </p>
            <Link
              href="/dashboard/internships"
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-4 text-sm font-black text-zinc-950 transition hover:scale-[1.02]"
            >
              Browse internships
              <ArrowRight size={18} />
            </Link>
          </div>
          <div className="overflow-hidden rounded-2xl border border-white/15 bg-white/10 p-2 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=60"
              alt="Mindfull Methods dashboard preview"
              className="aspect-[16/10] w-full rounded-xl object-cover object-left-top"
            />
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <article
              key={metric.label}
              className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">{metric.label}</p>
                  <h2 className="mt-3 text-4xl font-black">{metric.value}</h2>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
                  <Icon size={21} />
                </div>
              </div>
              <p className="mt-4 text-sm font-semibold text-zinc-500">{metric.helper}</p>
            </article>
          );
        })}
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Analytics</p>
              <h2 className="mt-2 text-2xl font-black">Weekly applications</h2>
            </div>
            <TrendingUp className="text-emerald-600" />
          </div>
          <AnalyticsChart />
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Recent activity</p>
              <h2 className="mt-2 text-2xl font-black">Latest applications</h2>
            </div>
            <span className="rounded-xl bg-zinc-950 px-4 py-3 text-sm font-black text-white dark:bg-white dark:text-zinc-950">
              {applications.length}
            </span>
          </div>

          <div className="mt-6 space-y-3">
            {applications.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-zinc-300 p-6 text-sm font-semibold leading-6 text-zinc-500 dark:border-white/10">
                No application activity yet. Submitted applications will show here.
              </p>
            ) : (
              applications.slice(0, 5).map((application, index: number) => (
                <div
                  key={application.id}
                  className="flex items-center justify-between gap-4 rounded-2xl bg-[#f7f8f5] p-4 dark:bg-zinc-950"
                >
                  <div>
                    <p className="font-black">Application #{index + 1}</p>
                    <p className="mt-1 text-sm text-zinc-500">{application.email || "Student application submitted"}</p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                    {application.status || "Pending"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Featured internships</p>
            <h2 className="mt-2 text-3xl font-black">Explore active opportunities</h2>
          </div>
          <Link href="/dashboard/internships" className="inline-flex items-center gap-2 text-sm font-black">
            View catalog
            <ArrowRight size={17} />
          </Link>
        </div>
        <InternshipList internships={internships} />
      </section>
    </main>
  );
}
