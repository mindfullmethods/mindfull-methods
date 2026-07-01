import Link from "next/link";
import { ArrowRight, Database } from "lucide-react";

import { businessServices } from "@/lib/business-services";

const dataAnnotation = {
  icon: Database,
  title: "Content & data operations",
  description: "Data collection, annotation, labelling, and moderation to power AI/ML models.",
  href: "/business/data-annotation",
};

const cards = [
  ...businessServices
    .filter((s) => s.slug !== "data-annotation")
    .map((s) => ({
      icon: s.card.icon,
      title: s.card.title,
      description: s.card.description,
      href: `/business/${s.slug}`,
    })),
  dataAnnotation,
];

export default function HomeServiceLines() {
  return (
    <section className="mm-landing-section px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="mm-landing-tag">The kind of work we do</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Beyond learning — we <span className="text-violet-300">run your operations</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/55 sm:text-base">
            Alongside mentor-led training, Mindfull Methods executes core business functions through a
            managed, nationwide workforce. Explore the service lines we deliver.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <Link
              key={c.title}
              href={c.href}
              className="mm-landing-glass group flex flex-col rounded-2xl p-6 transition duration-300 hover:-translate-y-1 hover:border-violet-500/25"
            >
              <div className="mm-landing-icon-badge flex h-12 w-12 items-center justify-center rounded-full">
                <c.icon size={22} className="text-white" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-white">{c.title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/55">{c.description}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-violet-300 transition group-hover:gap-2.5">
                Learn more <ArrowRight size={15} />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/business"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-violet-400/40 bg-white/5 px-8 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            See all service lines <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
