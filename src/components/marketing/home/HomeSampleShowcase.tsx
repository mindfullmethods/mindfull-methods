const samples = [
  { tag: "Prompt Eng", title: "Prompt playbook", desc: "Reusable, evaluated prompt library for a real use case." },
  { tag: "GenAI", title: "RAG doc assistant", desc: "Q&A over your own documents with citations." },
  { tag: "GenAI", title: "Eval harness", desc: "Regression tests and scoring before shipping." },
  { tag: "Agents", title: "Multi-step agent", desc: "Plan → act → observe with tools and traces." },
  { tag: "Agents", title: "Human-in-the-loop", desc: "Approval steps and scoped tool permissions." },
  { tag: "Automation", title: "n8n workflow", desc: "Trigger → LLM step → action with alerts." },
  { tag: "Automation", title: "Zapier AI flow", desc: "No-code automation with measurable ROI." },
  { tag: "Capstone", title: "Portfolio demo", desc: "Mentor-reviewed project you can present." },
];

export default function HomeSampleShowcase() {
  return (
    <section className="mm-landing-section px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="mm-landing-tag">Sample capstones</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Real projects learners <span className="text-violet-300">ship & show</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/50">
            A snapshot of mentor-reviewed capstones across our four AI tracks.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {samples.map((s) => (
            <article
              key={s.title}
              className="mm-landing-glass rounded-2xl p-5 transition hover:border-violet-500/25"
            >
              <span className="inline-flex rounded-full border border-violet-400/25 bg-violet-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-violet-200">
                {s.tag}
              </span>
              <h3 className="mt-3 text-sm font-bold text-white">{s.title}</h3>
              <p className="mt-1.5 text-xs leading-5 text-white/50">{s.desc}</p>
            </article>
          ))}
        </div>

        <p className="mt-10 text-center text-sm font-semibold text-white/60">
          Every cohort finishes with a <span className="text-violet-300">mentor-reviewed capstone</span> and a
          verifiable certificate.
        </p>
      </div>
    </section>
  );
}
