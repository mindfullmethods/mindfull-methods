import { Award, BookOpen, ClipboardCheck, MessageSquare, Rocket } from "lucide-react";

const steps = [
  {
    icon: ClipboardCheck,
    title: "Apply & pick your track",
    description: "Tell us your goals; we match you to the right AI mentorship course.",
  },
  {
    icon: BookOpen,
    title: "Learn with weekly milestones",
    description: "Cohort-based lessons with clear outcomes, exercises, and resources.",
  },
  {
    icon: MessageSquare,
    title: "Get mentor feedback",
    description: "Weekly touchpoints and written reviews on your work as you build.",
  },
  {
    icon: Rocket,
    title: "Ship a capstone",
    description: "Deliver portfolio-grade proof—prompt playbook, RAG app, agent, or automation.",
  },
  {
    icon: Award,
    title: "Earn a verified certificate",
    description: "Mentor review unlocks a public, verifiable certificate you can share.",
  },
];

export default function HomeProcessTimeline() {
  return (
    <section className="mm-landing-section px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="mm-landing-tag">How it works</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            From apply to <span className="text-violet-300">verified proof</span>
          </h2>
        </div>

        <ol className="relative mt-12 space-y-8 pl-4">
          <span
            aria-hidden
            className="absolute left-[27px] top-2 bottom-2 w-px bg-gradient-to-b from-violet-500/60 via-violet-500/25 to-transparent"
          />
          {steps.map((step, i) => (
            <li key={step.title} className="relative flex gap-5">
              <div className="mm-landing-icon-badge relative z-[1] flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
                <step.icon size={20} className="text-white" />
              </div>
              <div className="pt-1">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-violet-400">
                  Step {i + 1}
                </p>
                <h3 className="mt-1 text-lg font-bold text-white">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-white/55">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
