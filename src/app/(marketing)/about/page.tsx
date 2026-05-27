import { BarChart3, BriefcaseBusiness, GraduationCap, Sparkles } from "lucide-react";

import Badge from "@/components/marketing/Badge";
import Button from "@/components/marketing/Button";
import StepsTimeline, { type StepModel } from "@/components/marketing/StepsTimeline";

export default function AboutPage() {
  const steps: StepModel[] = [
    {
      title: "Apply & align",
      description: "Share your goals. We match you to the track that fits your starting point.",
      icon: BriefcaseBusiness,
    },
    {
      title: "Learn by shipping",
      description: "Weekly milestones turn learning into proof you can show.",
      icon: Sparkles,
    },
    {
      title: "Mentored delivery",
      description: "You receive feedback windows and mentor coaching until you’re ready to present.",
      icon: GraduationCap,
    },
  ];

  return (
    <main className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
      <section className="rounded-[2.5rem] border border-white/10 bg-zinc-950 p-6 shadow-2xl sm:p-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <Badge tone="violet">About Mindfull Methods</Badge>
            <h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-5xl">
              A mentorship model built for outcomes
            </h1>
            <p className="mt-4 text-sm leading-7 text-white/70">
              We believe learning should feel guided, structured, and practical. Instead of scattered content,
              you’ll follow a clear path with mentor touchpoints and portfolio-ready deliverables.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/courses" variant="primary" size="lg">
                Explore courses
              </Button>
              <Button href="/contact" variant="secondary" size="lg">
                Book a free call
              </Button>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-white/55">Our mission</p>
            <div className="mt-5 grid gap-4">
              {[
                { title: "Clarity", desc: "You always know the next milestone—and what “good” looks like.", icon: Sparkles },
                { title: "Feedback", desc: "Mentor support focuses on decisions, not just completion.", icon: GraduationCap },
                { title: "Proof", desc: "Ship work you can present with confidence and measurable outcomes.", icon: BarChart3 },
              ].map((c) => (
                <div key={c.title} className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-950 text-white">
                    <c.icon size={18} />
                  </span>
                  <div>
                    <p className="text-sm font-black text-white/85">{c.title}</p>
                    <p className="mt-2 text-sm leading-6 text-white/70">{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[0.28em] text-white/60">How we teach</p>
          <h2 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
            A simple rhythm you can follow
          </h2>
          <p className="mt-4 text-sm leading-7 text-white/70">
            Apply, learn through weekly milestones, and build proof with mentor guidance until you’re ready for
            your next step.
          </p>
        </div>

        <div className="mt-10">
          <StepsTimeline steps={steps} />
        </div>
      </section>

      <section className="mt-12">
        <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-zinc-950 p-8 shadow-2xl sm:p-12">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.28em] text-white/60">Ready?</p>
              <h2 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
                Book a free call and get matched
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/70">
                If you’re unsure which track fits, tell us your goals. We’ll recommend the best path forward.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end lg:flex-col lg:justify-start">
              <Button href="/contact" variant="primary" size="lg">
                Book Free Call
              </Button>
              <Button href="/courses" variant="secondary" size="lg">
                Browse courses
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}


