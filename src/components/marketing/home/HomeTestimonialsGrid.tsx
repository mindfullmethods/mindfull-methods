import type { Testimonial } from "@/lib/testimonials";

const quoteTitles: Record<string, string> = {
  "Aarav S.": "Prompts that actually work",
  "Meera K.": "Interview-ready RAG demo",
  "Jordan P.": "Agents with guardrails",
  "Samira R.": "Automation I shipped",
};

export default function HomeTestimonialsGrid({ testimonials }: { testimonials: Testimonial[] }) {
  const grid = testimonials.slice(0, 4);

  return (
    <section className="mm-landing-section px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <p className="mm-landing-tag text-center">Testimonials</p>
        <h2 className="mt-4 text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
          What learners say about mentorship
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm text-white/50">
          Real cohort feedback from our AI tracks—structured milestones, mentor review, portfolio proof.
        </p>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {grid.map((t) => (
            <article
              key={t.name}
              className="mm-landing-glass flex flex-col justify-between rounded-2xl p-6 sm:p-7"
            >
              <div>
                <h3 className="text-lg font-bold text-white">
                  {quoteTitles[t.name] ?? "Career-ready outcomes"}
                </h3>
                <p className="mt-4 text-sm leading-7 text-white/60">&ldquo;{t.quote}&rdquo;</p>
              </div>
              <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 text-sm font-bold text-white">
                  {t.name.charAt(0)}
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-white/45">{t.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
