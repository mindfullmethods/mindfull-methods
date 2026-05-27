import { ExternalLink, FileText, Mail, UserRound } from "lucide-react";
import { getApplications } from "@/Services/getApplications";

function statusClass(status?: string) {
  if (status === "Approved") return "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300";
  if (status === "Rejected") return "bg-red-50 text-red-700 dark:bg-red-400/10 dark:text-red-300";
  return "bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300";
}

export default async function ApplicationsPage() {
  const applications = await getApplications();

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 xl:px-10">
      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.28em] text-zinc-500">Applications Dashboard</p>
            <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">Student applications</h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-600 dark:text-zinc-400">
              Review applicants, open resumes, and keep every submission organized for admin decisions.
            </p>
          </div>
          <div className="rounded-2xl bg-zinc-950 px-6 py-4 text-white dark:bg-white dark:text-zinc-950">
            <p className="text-xs font-black uppercase tracking-[0.2em] opacity-60">Total</p>
            <p className="mt-1 text-4xl font-black">{applications.length}</p>
          </div>
        </div>
      </section>

      <section className="mt-8">
        {applications.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-zinc-300 bg-white p-12 text-center dark:border-white/10 dark:bg-white/5">
            <FileText className="mx-auto text-zinc-400" size={40} />
            <h2 className="mt-5 text-3xl font-black">No applications yet</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-500">
              Student applications will appear here after they submit the internship form.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/5">
            {applications.map((application) => (
              <div
                key={application.id}
                className="grid gap-5 border-b border-zinc-100 p-5 last:border-b-0 dark:border-white/10 lg:grid-cols-[1fr_auto]"
              >
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-zinc-500">
                      <UserRound size={15} />
                      Student
                    </p>
                    <h2 className="mt-2 text-xl font-black">{application.student_name}</h2>
                  </div>
                  <div>
                    <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-zinc-500">
                      <Mail size={15} />
                      Email
                    </p>
                    <p className="mt-2 text-sm font-bold text-zinc-600 dark:text-zinc-300">{application.email}</p>
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">Status</p>
                    <span className={`mt-2 inline-flex rounded-full px-3 py-2 text-xs font-black ${statusClass(application.status)}`}>
                      {application.status || "Pending"}
                    </span>
                  </div>
                </div>

                <a
                  href={application.resume || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-950 px-5 py-3 text-sm font-black text-white transition hover:scale-[1.01] dark:bg-white dark:text-zinc-950"
                >
                  View Resume
                  <ExternalLink size={16} />
                </a>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
