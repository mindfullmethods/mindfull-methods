const audiences = [
  "Career switchers",
  "Working professionals",
  "College students",
  "Founders & operators",
  "Product managers",
  "Marketers",
  "Developers upskilling",
  "Data analysts",
  "Consultants",
  "Aspiring AI engineers",
  "No-code builders",
  "Freelancers",
  "Startup teams",
  "Recent graduates",
];

export default function HomeWhoWeServe() {
  return (
    <section className="mm-landing-section px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
      <div className="mx-auto max-w-4xl text-center">
        <p className="mm-landing-tag">Who it&apos;s for</p>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Built for people who want <span className="text-violet-300">real AI skills</span>
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-white/50">
          If you want structure, feedback, and proof—not another unfinished course—you&apos;re in the right place.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {audiences.map((a) => (
            <span
              key={a}
              className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-white/70 transition hover:border-violet-400/30 hover:text-white"
            >
              {a}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
