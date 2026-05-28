import Link from "next/link";
import { BriefcaseBusiness, Clock, FileText } from "lucide-react";

import Button from "@/components/marketing/Button";
import { requireUser } from "@/lib/auth";
import { getMyApplicationsWithDetails } from "@/Services/my-applications";

function statusClass(status?: string) {
  if (status === "Approved") return "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300";
  if (status === "Rejected") return "bg-red-50 text-red-700 dark:bg-red-400/10 dark:text-red-300";
  if (status === "Submitted") return "bg-sky-50 text-sky-700 dark:bg-sky-400/10 dark:text-sky-300";
  return "bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300";
}

export default async function MyApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ submitted?: string }>;
}) {
  await requireUser("/dashboard/my-applications");
  const { submitted } = await searchParams;
  const applications = await getMyApplicationsWithDetails();

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 xl:px-10">
      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-8">
        <p className="text-sm font-black uppercase tracking-[0.28em] text-zinc-500">My applications</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Your internship submissions</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-600 dark:text-zinc-400">
          Track programs you&apos;ve applied to and check their status.
        </p>
      </section>

      {submitted === "1" ? (
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-bold text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200">
          Application submitted — we&apos;ll update the status here once reviewed.
        </div>
      ) : null}

      <section className="mt-8">
        {applications.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-zinc-300 bg-white p-12 text-center dark:border-white/10 dark:bg-white/5">
            <FileText className="mx-auto text-zinc-400" size={40} />
            <h2 className="mt-5 text-3xl font-black">No applications yet</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-500">
              Browse internships and submit your first application from the internships catalog.
            </p>
            <div className="mt-8">
              <Button href="/dashboard/internships" variant="gradient" size="lg">
                Browse internships
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {applications.map((app) => {
              const internship = app.internships;
              return (
                <article
                  key={app.id}
                  className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-white/10 dark:bg-white/5 sm:p-6"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-zinc-500">
                        <BriefcaseBusiness size={15} />
                        Internship
                      </p>
                      <h2 className="mt-2 text-2xl font-black">
                        {internship?.title ?? "Internship application"}
                      </h2>
                      {internship?.company ? (
                        <p className="mt-1 text-sm font-bold text-zinc-500">{internship.company}</p>
                      ) : null}
                      {internship?.duration || internship?.stipend ? (
                        <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-zinc-500">
                          <Clock size={14} />
                          {[internship.duration, internship.stipend].filter(Boolean).join(" · ")}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex flex-col items-start gap-3 md:items-end">
                      <span
                        className={`inline-flex rounded-full px-3 py-2 text-xs font-black ${statusClass(app.status)}`}
                      >
                        {app.status ?? "Pending"}
                      </span>
                      {app.internship_id ? (
                        <Link
                          href={`/dashboard/internships/${app.internship_id}`}
                          className="text-sm font-black text-violet-600 hover:underline dark:text-violet-300"
                        >
                          View internship →
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
