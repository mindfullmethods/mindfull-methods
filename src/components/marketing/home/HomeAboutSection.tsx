export default function HomeAboutSection() {
  const facts = ["4 focused AI tracks", "Weekly mentor review", "Verifiable certificates"];

  return (
    <section className="mm-landing-section px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mm-landing-tag">About Mindfull Methods</p>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Mentorship-led AI education,{" "}
          <span className="text-violet-300">built for outcomes</span>
        </h2>
        <p className="mt-5 text-sm leading-7 text-white/55 sm:text-base sm:leading-8">
          We sell structured, cohort-based certification programs—not passive video libraries. Learners
          follow weekly milestones, receive real mentor feedback, ship portfolio-grade capstones, and earn
          certificates employers can verify.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-semibold text-white/60">
          {facts.map((f, i) => (
            <span key={f} className="inline-flex items-center gap-3">
              {i > 0 ? <span className="hidden text-white/20 sm:inline">•</span> : null}
              <span className="text-violet-300">{f}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
