import {
  Award,
  BookOpen,
  Gauge,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Real mentor feedback",
    description: "Weekly coaching and targeted reviews on your work so you improve fast—not generic forums.",
  },
  {
    icon: Gauge,
    title: "Structured milestones",
    description: "Clear weekly outcomes and guided steps so you always know exactly what to do next.",
  },
  {
    icon: Sparkles,
    title: "Practical projects",
    description: "Ship guided work each week and finish with a capstone that proves real capability.",
  },
  {
    icon: ShieldCheck,
    title: "Safety & guardrails",
    description: "Learn responsible AI patterns—evaluation, moderation, and human-in-the-loop by default.",
  },
  {
    icon: Award,
    title: "Verifiable certificates",
    description: "Earn a public, verifiable certificate after mentor review—shareable on LinkedIn.",
  },
  {
    icon: BookOpen,
    title: "Career-ready delivery",
    description: "Present outcomes in a portfolio format recruiters and hiring managers understand.",
  },
];

export default function HomeWhyChooseUs() {
  return (
    <section className="mm-landing-section px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="mm-landing-tag">Why learners choose us</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            The most effective way to <span className="text-violet-300">learn AI</span>
          </h2>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <article
              key={f.title}
              className="mm-landing-glass rounded-2xl p-6 transition duration-300 hover:-translate-y-1 hover:border-violet-500/25"
            >
              <div className="mm-landing-icon-badge flex h-12 w-12 items-center justify-center rounded-full">
                <f.icon size={22} className="text-white" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/55">{f.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
