import Link from "next/link";
import { BriefcaseBusiness, CheckCircle2, Clock, FileText, Mail } from "lucide-react";

import Button from "@/components/marketing/Button";
import DashboardPageHeader from "@/components/components/dashboard/DashboardPageHeader";
import WithdrawApplicationButton from "@/components/components/dashboard/WithdrawApplicationButton";
import { requireUser } from "@/lib/auth";
import { getMyApplicationsWithDetails } from "@/Services/my-applications";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function statusClass(status?: string) {
  if (status === "Approved") return "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300";
  if (status === "Rejected") return "bg-red-50 text-red-700 dark:bg-red-400/10 dark:text-red-300";
  if (status === "Withdrawn") return "bg-zinc-100 text-zinc-600 dark:bg-white/10 dark:text-zinc-400";
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
      <DashboardPageHeader
        eyebrow="My applications"
        title="Your internship submissions"
        description="Track programs you've applied to and check their status."
      />

      {submitted === "1" ? (
        <div className="mt-6 mm-section-panel border-emerald-200/80 bg-emerald-50/80 dark:border-emerald-400/20 dark:bg-emerald-400/5">
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <p className="text-lg font-bold text-emerald-900 dark:text-emerald-100">Application submitted</p>
              <p className="mt-2 text-sm leading-6 text-emerald-800/90 dark:text-emerald-200/90">
                We sent a confirmation email with next steps. Status updates appear here — typically within a few
                business days.
              </p>
              <ol className="mt-4 space-y-2 text-sm font-semibold text-emerald-800 dark:text-emerald-200">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600/15 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                    1
                  </span>
                  Our team reviews your profile and resume link (if provided).
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600/15 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                    2
                  </span>
                  You&apos;ll get email when status moves to Approved or needs more info.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600/15 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                    3
                  </span>
                  Check this page anytime — no need to re-apply.
                </li>
              </ol>
              <p className="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-700/80 dark:text-emerald-300/80">
                <Mail size={14} />
                Didn&apos;t get the email? Check spam or contact us from Settings.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <section className="mt-8">
        {applications.length === 0 ? (
          <div className="mm-section-panel border-dashed text-center">
            <FileText className="mx-auto text-zinc-400" size={40} />
            <h2 className="mt-5 text-2xl font-bold mm-heading">No applications yet</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 mm-muted">
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
                <article key={app.id} className="mm-section-panel">
                  <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] mm-subtle">
                        <BriefcaseBusiness size={15} />
                        Internship
                      </p>
                      <h2 className="mt-2 text-2xl font-bold mm-heading">
                        {internship?.title ?? "Internship application"}
                      </h2>
                      {internship?.company ? (
                        <p className="mt-1 text-sm font-semibold mm-muted">{internship.company}</p>
                      ) : null}
                      {internship?.duration || internship?.stipend ? (
                        <p className="mt-3 flex flex-wrap items-center gap-2 text-sm mm-muted">
                          <Clock size={14} />
                          {[internship.duration, internship.stipend].filter(Boolean).join(" · ")}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex flex-col items-start gap-3 md:items-end">
                      <span
                        className={`inline-flex rounded-full px-3 py-2 text-xs font-bold ${statusClass(app.status)}`}
                      >
                        {app.status ?? "Pending"}
                      </span>
                      <div className="rounded-xl border mm-border px-3 py-2 text-xs">
                        <p className="font-bold mm-subtle">Timeline</p>
                        <p className="mt-1 font-semibold mm-heading">
                          Submitted {app.created_at ? formatDate(app.created_at) : "—"}
                        </p>
                        <p className="mt-1 font-semibold mm-muted">Current: {app.status ?? "Pending"}</p>
                      </div>
                      {app.internship_id ? (
                        <Link
                          href={`/dashboard/internships/${app.internship_id}`}
                          className="text-sm font-bold text-violet-600 hover:underline dark:text-violet-300"
                        >
                          View internship →
                        </Link>
                      ) : null}
                    </div>
                  </div>
                  <div className="relative mt-5 flex flex-col gap-3 border-t mm-border pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs font-semibold mm-muted">
                      Need to back out? You can withdraw at any time unless already withdrawn.
                    </p>
                    <WithdrawApplicationButton applicationId={app.id} status={app.status} />
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
