import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import BusinessLeadForm from "@/components/marketing/business/BusinessLeadForm";
import HomeImageCarousel from "@/components/marketing/home/HomeImageCarousel";
import type { BusinessService } from "@/lib/business-services";
import { getCourseImage } from "@/lib/images";

export default function BusinessServiceDetail({ service }: { service: BusinessService }) {
  const heroSlides = [
    { src: service.heroImage, caption: service.card.title },
    { src: getCourseImage("ai-agents"), caption: "On-ground execution" },
    { src: getCourseImage("generative-ai-llms"), caption: "Live dashboards" },
    { src: getCourseImage("ai-automation"), caption: "Nationwide reach" },
  ];

  return (
    <div className="mm-landing-page bg-black text-white">
      {/* Hero */}
      <section className="relative overflow-hidden px-5 pb-4 pt-12 sm:px-8 sm:pt-16 lg:px-10 lg:pt-20">
        <div className="pointer-events-none absolute inset-0 mm-landing-hero-glow" />
        <div className="relative mx-auto max-w-6xl">
          <Link
            href="/business"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/50 transition hover:text-white"
          >
            <ArrowLeft size={16} /> All service lines
          </Link>
          <div className="mt-6 grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <p className="mm-landing-eyebrow">{service.eyebrow}</p>
              <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[3.1rem]">
                <span className="text-white">{service.title}</span>{" "}
                <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-violet-200 bg-clip-text text-transparent">
                  {service.highlight}
                </span>
                {service.titleSuffix ? <span className="text-white"> {service.titleSuffix}</span> : null}
              </h1>
              <p className="mt-6 max-w-xl text-sm leading-7 text-white/55 sm:text-base sm:leading-8">
                {service.description}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#talk-to-us"
                  className="mm-btn-glow inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-semibold shadow-[0_0_40px_-8px_rgba(139,92,246,0.7)]"
                >
                  Share your requirements <ArrowRight size={18} />
                </a>
                <a
                  href="#capabilities"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-violet-400/40 bg-white/5 px-8 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Explore capabilities
                </a>
              </div>
            </div>
            <HomeImageCarousel slides={heroSlides} />
          </div>
        </div>

        <div className="relative mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
          {service.stats.map((s) => (
            <div key={s.label} className="mm-landing-glass rounded-2xl px-6 py-5 text-center">
              <p className="text-2xl font-bold text-violet-300 sm:text-3xl">{s.value}</p>
              <p className="mt-1 text-xs font-medium text-white/50">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mm-landing-section px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="mm-landing-tag">What we do</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Everything, <span className="text-violet-300">managed end to end</span>
            </h2>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {service.features.map((f) => (
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

      {/* Capabilities */}
      <section id="capabilities" className="mm-landing-section px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mm-landing-tag">Capabilities</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            A complete <span className="text-violet-300">toolkit</span>
          </h2>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {service.capabilities.map((c) => (
              <span
                key={c}
                className="rounded-full border border-violet-400/25 bg-violet-500/10 px-4 py-2 text-sm font-semibold text-violet-200"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="mm-landing-section px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="mm-landing-tag">Use cases</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Built for <span className="text-violet-300">real operations</span>
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {service.useCases.map((u) => (
              <article key={u.title} className="mm-landing-glass rounded-2xl p-7">
                <h3 className="text-lg font-bold text-white">{u.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {u.points.map((p) => (
                    <li key={p} className="flex items-start gap-2.5 text-sm text-white/60">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                      {p}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Audiences */}
      <section className="mm-landing-section px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mm-landing-tag">Who we serve</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Trusted across <span className="text-violet-300">sectors</span>
          </h2>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {service.audiences.map((a) => (
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

      {/* CTA */}
      <section className="mm-landing-section px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-violet-400/20 px-6 py-14 text-center sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute inset-0 mm-landing-cta-glow" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/60 to-transparent" />
          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[2.75rem]">
              Ready to scale{" "}
              <span className="bg-gradient-to-r from-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
                {service.card.title.toLowerCase()}?
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/60 sm:text-base">
              Share your requirement and get a tailored execution plan, pricing, and timeline.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#talk-to-us"
                className="mm-btn-glow inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-semibold shadow-[0_0_40px_-8px_rgba(139,92,246,0.7)]"
              >
                Get started <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <BusinessLeadForm />
    </div>
  );
}
