import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardList,
  GraduationCap,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const programs = [
  {
    title: "Frontend Engineering",
    level: "Beginner friendly",
    description: "Build production-ready interfaces with React, Next.js, TypeScript, and Tailwind CSS.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
  },
  {
    title: "Product Design",
    level: "Portfolio track",
    description: "Learn research, wireframing, visual systems, and polished product storytelling.",
    image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c",
  },
  {
    title: "Data Analytics",
    level: "Project based",
    description: "Turn raw datasets into dashboards, insights, and clear business recommendations.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
  },
];

const stats = [
  { label: "Students enrolled", value: "10K+" },
  { label: "Project tracks", value: "24" },
  { label: "Completion rate", value: "95%" },
  { label: "Average rating", value: "4.9" },
];

const steps = [
  {
    title: "Choose a track",
    description: "Browse curated internship programs matched to your skill level and career goal.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Apply in minutes",
    description: "Submit your profile and resume through a simple, focused application flow.",
    icon: ClipboardList,
  },
  {
    title: "Build proof of work",
    description: "Complete guided projects and graduate with portfolio-ready outcomes.",
    icon: GraduationCap,
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f7f8f5] text-zinc-950 dark:bg-zinc-950 dark:text-white">
      <section className="relative min-h-[92vh] overflow-hidden">
        <img
          src="/brand-assets/linkedin-cover.png"
          alt="Mindfull Methods brand cover"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-zinc-950/72" />

        <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-7xl flex-col px-5 py-5 sm:px-8 lg:px-10">
          <nav className="flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3 text-white">
              <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-white p-1 shadow-lg">
                <img src="/brand-assets/logo.png" alt="Mindfull Methods logo" className="h-full w-full object-contain" />
              </span>
              <span>
                <span className="block text-base font-black tracking-tight">Mindfull Methods</span>
                <span className="block text-xs font-bold uppercase tracking-[0.24em] text-white/55">
                  Internship platform
                </span>
              </span>
            </Link>

            <div className="hidden items-center gap-7 md:flex">
              <a href="#programs" className="text-sm font-bold text-white/75 transition hover:text-white">
                Programs
              </a>
              <a href="#workflow" className="text-sm font-bold text-white/75 transition hover:text-white">
                Workflow
              </a>
              <a href="#outcomes" className="text-sm font-bold text-white/75 transition hover:text-white">
                Outcomes
              </a>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-xl px-4 py-2 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="rounded-xl bg-white px-4 py-2 text-sm font-black text-zinc-950 transition hover:scale-[1.02]"
              >
                Apply
              </Link>
            </div>
          </nav>

          <div className="grid flex-1 items-end gap-10 pb-12 pt-20 lg:grid-cols-[0.95fr_1.05fr] lg:pb-16">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-white backdrop-blur-md">
                <Sparkles size={16} />
                Career-ready internships with guided projects
              </div>
              <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
                Build experience before your first full-time role.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">
                Mindfull Methods helps students find structured internships, complete practical projects, and track
                applications from one modern workspace.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-4 text-sm font-black text-zinc-950 transition hover:scale-[1.02]"
                >
                  Start Application
                  <ArrowRight size={18} />
                </Link>
                <Link
                  href="/dashboard/internships"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-6 py-4 text-sm font-black text-white transition hover:bg-white/10"
                >
                  Browse Programs
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 p-3 shadow-2xl backdrop-blur-xl">
              <img
                src="/brand-assets/deployment-linkedin-post.png"
                alt="Mindfull Methods deployed platform preview"
                className="aspect-[16/10] w-full rounded-xl object-cover object-left-top"
              />
              <div className="grid gap-3 p-3 sm:grid-cols-2">
                {stats.map((item) => (
                  <div key={item.label} className="rounded-xl bg-white/10 p-3">
                    <span className="text-xs font-bold text-white/60">{item.label}</span>
                    <span className="mt-1 block text-2xl font-black text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-black uppercase tracking-[0.28em] text-violet-700 dark:text-violet-300">
              Product proof
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
              Designed from your real platform screenshots.
            </h2>
            <p className="mt-5 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
              The interface now uses your Mindfull Methods identity and showcases the deployed product, mobile views,
              dashboard, and admin panel as part of the landing experience.
            </p>
          </div>

          <div className="grid gap-4">
            <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white p-2 shadow-xl dark:border-white/10 dark:bg-white/5">
              <img
                src="/brand-assets/dashboard.png"
                alt="Mindfull Methods dashboard and admin panel sample"
                className="w-full rounded-xl object-cover"
              />
            </div>
            <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white p-2 shadow-xl dark:border-white/10 dark:bg-white/5">
              <img
                src="/brand-assets/linkedin-cover.png"
                alt="Mindfull Methods brand cover"
                className="aspect-[21/8] w-full rounded-xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="programs" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.28em] text-emerald-700 dark:text-emerald-300">
              Featured tracks
            </p>
            <h2 className="mt-4 max-w-2xl text-4xl font-black tracking-tight sm:text-5xl">
              Practical programs students can finish with real proof.
            </h2>
          </div>
          <Link href="/dashboard/internships" className="inline-flex items-center gap-2 text-sm font-black">
            View all internships
            <ArrowRight size={17} />
          </Link>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {programs.map((program) => (
            <article
              key={program.title}
              className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-white/5"
            >
              <img src={program.image} alt={program.title} className="h-52 w-full object-cover" />
              <div className="p-6">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                  {program.level}
                </span>
                <h3 className="mt-5 text-2xl font-black">{program.title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{program.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="workflow" className="border-y border-zinc-200 bg-white py-20 dark:border-white/10 dark:bg-white/[0.03]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.75fr_1.25fr] lg:px-10">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.28em] text-sky-700 dark:text-sky-300">
              Student workflow
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
              From browsing to building, the path is clear.
            </h2>
          </div>

          <div className="grid gap-4">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <article
                  key={step.title}
                  className="flex gap-5 rounded-2xl border border-zinc-200 bg-[#f7f8f5] p-5 dark:border-white/10 dark:bg-zinc-950"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-zinc-500">Step {index + 1}</p>
                    <h3 className="mt-1 text-xl font-black">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{step.description}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="outcomes" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <p className="text-sm font-black uppercase tracking-[0.28em] text-zinc-500">Platform outcomes</p>
            <h2 className="mt-4 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
              Built for students, admins, and measurable progress.
            </h2>
          </div>
          <div className="overflow-hidden rounded-2xl bg-zinc-950 p-3 text-white dark:bg-white dark:text-zinc-950">
            <img
              src="/brand-assets/deployment-linkedin-post.png"
              alt="Live deployment and responsive screenshots"
              className="aspect-[4/3] w-full rounded-xl object-cover object-left-top"
            />
            <div className="p-3">
              <BarChart3 />
              <p className="mt-4 text-2xl font-black">Real dashboard</p>
              <p className="mt-3 text-sm leading-6 text-white/70 dark:text-zinc-600">
                Track internships, applications, approvals, and platform activity from the admin workspace.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            "Supabase authentication",
            "Internship CRUD dashboard",
            "Student application tracking",
            "Responsive dark mode UI",
            "Admin review workflow",
            "Production-ready Next.js app",
          ].map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 text-sm font-bold dark:border-white/10 dark:bg-white/5"
            >
              <CheckCircle2 size={18} className="text-emerald-600" />
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-zinc-950 px-5 py-16 text-white sm:px-8 lg:px-10">
        <img
          src="/brand-assets/linkedin-cover.png"
          alt="Mindfull Methods brand background"
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-zinc-950/75" />
        <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold">
              <ShieldCheck size={16} />
              Ready for your next application
            </div>
            <h2 className="mt-5 max-w-2xl text-4xl font-black tracking-tight sm:text-5xl">
              Start with a focused internship platform, not scattered forms.
            </h2>
          </div>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 text-sm font-black text-zinc-950 transition hover:scale-[1.02]"
          >
            Create Account
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <footer className="border-t border-zinc-200 bg-[#f7f8f5] px-5 py-8 text-sm font-bold text-zinc-500 dark:border-white/10 dark:bg-zinc-950 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span>Mindfull Methods</span>
          <span>Internship SaaS Platform</span>
        </div>
      </footer>
    </main>
  );
}
