import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { marketingImages } from "@/lib/images";

export default function DashboardOverviewHero({
  isAdmin,
  firstName,
}: {
  isAdmin: boolean;
  firstName?: string;
}) {
  const greeting = firstName?.trim() ? `Welcome back, ${firstName.split(" ")[0]}` : "Your learning command center";

  return (
    <section className="mm-hero-panel p-6 sm:p-8 lg:p-10">
      <div className="relative z-[1] grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-violet-200/90 backdrop-blur">
            <Sparkles size={14} className="text-teal-300" />
            Mindfull Methods · {isAdmin ? "Admin" : "Student"}
          </div>

          <h1 className="mt-6 max-w-2xl text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
            {greeting}
            <span className="mt-2 block text-2xl font-bold text-white/55 sm:text-3xl">
              Courses, progress &amp; opportunities — unified.
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-7 text-white/60 sm:text-base">
            Track milestones, apply to internships, and manage your mentorship journey from a single intelligent workspace.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/dashboard/courses"
              className="mm-btn-glow inline-flex items-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold"
            >
              Browse courses
              <ArrowRight size={17} />
            </Link>
            <Link
              href="/dashboard/my-courses"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/10"
            >
              My courses
            </Link>
            <Link
              href="/dashboard/internships"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/10"
            >
              Internships
            </Link>
            {isAdmin ? (
              <>
                <Link
                  href="/dashboard/admin-home"
                  className="inline-flex items-center gap-2 rounded-xl border border-violet-400/30 bg-violet-500/15 px-5 py-3.5 text-sm font-bold text-violet-100 transition hover:bg-violet-500/25"
                >
                  Admin home
                </Link>
                <Link
                  href="/dashboard/analytics"
                  className="inline-flex items-center gap-2 rounded-xl border border-teal-400/25 bg-teal-500/10 px-5 py-3.5 text-sm font-bold text-teal-100 transition hover:bg-teal-500/20"
                >
                  Analytics
                </Link>
              </>
            ) : null}
          </div>
        </div>

        <div className="relative">
          <div className="mm-orbit absolute -left-6 top-1/2 h-[118%] w-[118%] -translate-y-1/2 opacity-40" />
          <div className="mm-orbit mm-orbit-reverse absolute -left-3 top-1/2 h-[104%] w-[104%] -translate-y-1/2 opacity-25" />

          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-2 shadow-2xl backdrop-blur">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/60 to-transparent" />
            <img
              src={marketingImages.dashboardPreview}
              alt="Mindfull Methods dashboard preview"
              className="aspect-[16/10] w-full rounded-xl object-cover object-left-top"
            />
          </div>

          <div className="absolute -bottom-3 -right-2 rounded-2xl border border-white/10 bg-zinc-950/90 px-4 py-3 shadow-xl backdrop-blur sm:-right-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-300/80">Live workspace</p>
            <p className="mt-1 text-lg font-bold text-white">All-in-one</p>
          </div>
        </div>
      </div>
    </section>
  );
}
