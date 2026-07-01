import { CheckCircle2 } from "lucide-react";

const points = [
  "Accountability that beats abandoned self-study",
  "Feedback tuned to your goals and current level",
  "Portfolio proof you can show in interviews",
  "Certificates employers can actually verify",
];

export default function HomeWhyMentorship() {
  return (
    <section className="mm-landing-section px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
      <div className="mx-auto max-w-4xl text-center">
        <p className="mm-landing-tag">Why mentorship matters</p>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          You can&apos;t build a career on{" "}
          <span className="text-violet-300">passive video alone</span>
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/55 sm:text-base sm:leading-8">
          Most learners stall on tutorials with no structure, no accountability, and no credible proof.
          Mentorship fixes the missing pieces so you actually finish and can show what you built.
        </p>

        <div className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-2">
          {points.map((p) => (
            <div
              key={p}
              className="mm-landing-glass flex items-start gap-3 rounded-2xl p-5 text-left"
            >
              <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-violet-400" />
              <p className="text-sm font-medium text-white/70">{p}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-sm font-medium italic text-white/45">
          Structure + feedback + proof — the foundation of a real AI career.
        </p>
      </div>
    </section>
  );
}
