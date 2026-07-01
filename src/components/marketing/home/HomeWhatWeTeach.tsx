import { GraduationCap, Workflow } from "lucide-react";

const services = [
  {
    icon: GraduationCap,
    title: "Structured AI courses",
    description:
      "Cohort-based tracks with weekly milestones, resources, and mentor touchpoints—designed to be finished, not abandoned.",
    tags: ["Prompt Engineering", "Generative AI & LLMs", "AI Agents", "AI Automation"],
  },
  {
    icon: Workflow,
    title: "Mentorship & certification",
    description:
      "Real feedback on your capstone, portfolio guidance, and a public certificate issued only after mentor review.",
    tags: [
      "Weekly reviews",
      "Capstone projects",
      "Portfolio guidance",
      "Verifiable certificate",
      "Interview prep",
      "Internship listings",
    ],
  },
];

export default function HomeWhatWeTeach() {
  return (
    <section className="mm-landing-section px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="mm-landing-tag">What we do</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Learn the skill, <span className="text-violet-300">prove the outcome</span>
          </h2>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {services.map((s) => (
            <article key={s.title} className="mm-landing-glass rounded-2xl p-7 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="mm-landing-icon-badge flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
                  <s.icon size={22} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{s.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-white/55">{s.description}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {s.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-violet-400/25 bg-violet-500/10 px-3 py-1.5 text-xs font-semibold text-violet-200"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
