import { BriefcaseBusiness, Sparkles } from "lucide-react";

import InternshipCatalog from "@/components/components/dashboard/InternshipCatalog";
import { getInternships } from "@/Services/Internships";

export default async function InternshipsPage() {
  const internships = await getInternships();

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 xl:px-10">
      <section className="relative overflow-hidden rounded-[2rem] bg-zinc-950 p-6 text-white shadow-xl sm:p-10">
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-violet-600/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 left-0 h-56 w-56 rounded-full bg-teal-500/15 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_55%)]" />

        <div className="relative">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-white/70">
            <Sparkles size={14} className="text-violet-300" />
            Explore opportunities
          </p>
          <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
                Find internships built around{" "}
                <span className="bg-gradient-to-r from-violet-300 via-fuchsia-200 to-teal-200 bg-clip-text text-transparent">
                  real project outcomes
                </span>
                .
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
                Browse active programs, compare companies, and apply to tracks that match your skills and availability.
              </p>
            </div>
            <div className="grid min-w-[220px] gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-2xl border border-white/10 bg-white/10 px-6 py-4 backdrop-blur">
                <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-white/50">
                  <BriefcaseBusiness size={14} />
                  Active roles
                </p>
                <p className="mt-2 text-4xl font-black">{internships.length}</p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 px-6 py-4 shadow-lg shadow-violet-900/30">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-white/80">Apply from dashboard</p>
                <p className="mt-2 text-sm font-bold leading-6 text-white/90">One-click apply with your profile</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {internships.length === 0 ? (
        <section className="mt-10 rounded-3xl border border-dashed border-zinc-300 bg-white p-12 text-center dark:border-white/10 dark:bg-white/5">
          <h2 className="text-3xl font-black">No internships published yet</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-500">
            Once the admin creates internship opportunities, they will appear here for students to review and apply.
          </p>
        </section>
      ) : (
        <InternshipCatalog internships={internships} />
      )}
    </main>
  );
}
