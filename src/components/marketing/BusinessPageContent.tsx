import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  ClipboardCheck,
  Database,
  Gauge,
  Headphones,
  LayoutDashboard,
  MapPin,
  PhoneCall,
  ScanLine,
  ShieldCheck,
  Store,
  Truck,
  UserCog,
  Users,
  Wallet,
} from "lucide-react";
import Link from "next/link";

import BusinessLeadForm from "@/components/marketing/business/BusinessLeadForm";
import HomeImageCarousel from "@/components/marketing/home/HomeImageCarousel";
import { getCourseImage, marketingImages } from "@/lib/images";

const heroSlides = [
  { src: marketingImages.hero, caption: "Field operations" },
  { src: getCourseImage("ai-agents"), caption: "Data annotation" },
  { src: getCourseImage("generative-ai-llms"), caption: "Telecalling" },
  { src: getCourseImage("ai-automation"), caption: "Last-mile delivery" },
];

const heroStats = [
  { value: "1.5M+", label: "Gig workforce" },
  { value: "1000+", label: "Cities covered" },
  { value: "19,000+", label: "Pin codes reached" },
];

const offerings = [
  { icon: Users, title: "Gig staffing", description: "On-ground and remote workers deployed for sales, field ops, and specialized roles.", href: "/business/gig-staffing" },
  { icon: Store, title: "Promoter deployment & merchandising", description: "In-store and out-store promotion, BTL activations, up-sell and cross-sell across sectors.", href: "/business/promoter-merchandising" },
  { icon: PhoneCall, title: "Telecalling", description: "Inbound and outbound calling at scale for lead generation, feedback, and support.", href: "/business/telecalling" },
  { icon: ClipboardCheck, title: "Auditing & diligence", description: "Large-scale audits across retail, warehouses, hospitality, and BFSI.", href: "/business/auditing-diligence" },
  { icon: Database, title: "Content & data operations", description: "Data collection, annotation, labelling, and moderation to power AI/ML models.", href: "/business/data-annotation" },
  { icon: ScanLine, title: "Exam invigilation & proctoring", description: "Managed on-ground and remote invigilation for high-stakes assessments.", href: "/business/exam-invigilation" },
  { icon: Truck, title: "Last-mile delivery", description: "Complex logistics fulfilment, including high-traffic and multi-point routes.", href: "/business/last-mile-delivery" },
  { icon: BadgeCheck, title: "Verification services", description: "Identity, address, and document verification with geo-tagging across cities.", href: "/business/verification-services" },
  { icon: UserCog, title: "Expert contracting", description: "High-skilled white-collar talent sourced and managed on a contractual basis.", href: "/business/expert-contracting" },
];

const process = [
  { icon: LayoutDashboard, title: "Project configuration", description: "Share your requirement—volume, quality, and commercials. We configure it on our platform within 24 hours." },
  { icon: Gauge, title: "Task allocation & fulfilment", description: "Our system allocates tasks to trained workers instantly, with algorithmic and manual quality checks." },
  { icon: Wallet, title: "Payment & completion", description: "Outcome-based billing for you; fast, reliable weekly payouts for the workforce via our app." },
];

const whyUs = [
  { icon: Gauge, title: "Outcome-based model", description: "You pay for results on the ground—not just manpower deployment." },
  { icon: MapPin, title: "Pan-India reach", description: "A distributed workforce across thousands of cities and pin codes." },
  { icon: LayoutDashboard, title: "Tech platform + dashboards", description: "Live tracking across worker app, operations war room, and client dashboard." },
  { icon: ShieldCheck, title: "Quality & compliance", description: "Multi-layer quality checks, plus managed payroll and compliance." },
  { icon: Boxes, title: "Elastic scale", description: "Variabilize fixed costs and scale operations up or down on demand." },
  { icon: Headphones, title: "Dedicated support", description: "A partner team to plan, launch, and optimize every engagement." },
];

const industries = [
  "BFSI",
  "E-commerce",
  "Logistics",
  "FMCG",
  "Telecom",
  "Retail",
  "Healthcare",
  "EdTech",
  "AI & ML",
  "Manufacturing",
  "Real estate",
  "Government",
];

const impact = [
  { value: "10M+", label: "Data points labelled monthly" },
  { value: "99%+", label: "Annotation accuracy" },
  { value: "2L+", label: "Calls handled per day" },
  { value: "450+", label: "Cities for verification" },
];

export default function BusinessPageContent() {
  return (
    <div className="mm-landing-page bg-black text-white">
      {/* Hero */}
      <section className="relative overflow-hidden px-5 pb-4 pt-12 sm:px-8 sm:pt-16 lg:px-10 lg:pt-20">
        <div className="pointer-events-none absolute inset-0 mm-landing-hero-glow" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <p className="mm-landing-eyebrow">Mindfull Methods for Business</p>
            <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[3.25rem]">
              <span className="text-white">India&apos;s</span>{" "}
              <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-violet-200 bg-clip-text text-transparent">
                Work-as-a-Service
              </span>{" "}
              <span className="text-white">platform</span>
            </h1>
            <p className="mt-6 max-w-xl text-sm leading-7 text-white/55 sm:text-base sm:leading-8">
              Run your core business functions at scale. We source, train, manage, and pay a distributed gig
              workforce—and deliver outcome-based results across the country, so you can variabilize costs and
              focus on growth.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#talk-to-us"
                className="mm-btn-glow inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-semibold shadow-[0_0_40px_-8px_rgba(139,92,246,0.7)]"
              >
                Share your requirements <ArrowRight size={18} />
              </a>
              <a
                href="#offerings"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-violet-400/40 bg-white/5 px-8 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Explore offerings
              </a>
            </div>
          </div>
          <HomeImageCarousel slides={heroSlides} />
        </div>

        <div className="relative mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
          {heroStats.map((s) => (
            <div key={s.label} className="mm-landing-glass rounded-2xl px-6 py-5 text-center">
              <p className="text-3xl font-bold text-violet-300 sm:text-4xl">{s.value}</p>
              <p className="mt-1 text-xs font-medium text-white/50">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About / intro */}
      <section className="mm-landing-section px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mm-landing-tag">About</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            End-to-end execution of your{" "}
            <span className="text-violet-300">core operations</span>
          </h2>
          <p className="mt-5 text-sm leading-7 text-white/55 sm:text-base sm:leading-8">
            We bridge enterprises and a nationwide gig workforce—taking complete ownership of finding workers,
            mapping them to work, training, managing, and driving quality outcomes. You share the requirement;
            we handle the rest.
          </p>
        </div>
      </section>

      {/* Offerings */}
      <section id="offerings" className="mm-landing-section px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="mm-landing-tag">Our offerings</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Service lines that <span className="text-violet-300">run your business</span>
            </h2>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {offerings.map((o) => (
              <Link
                key={o.title}
                href={o.href}
                className="mm-landing-glass group flex flex-col rounded-2xl p-6 transition duration-300 hover:-translate-y-1 hover:border-violet-500/25"
              >
                <div className="mm-landing-icon-badge flex h-12 w-12 items-center justify-center rounded-full">
                  <o.icon size={22} className="text-white" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-white">{o.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/55">{o.description}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-violet-300 transition group-hover:gap-2.5">
                  Learn more <ArrowRight size={15} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mm-landing-section px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="mm-landing-tag">How it works</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Reliable execution in <span className="text-violet-300">three steps</span>
            </h2>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {process.map((step, i) => (
              <article key={step.title} className="mm-landing-glass rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div className="mm-landing-icon-badge flex h-12 w-12 items-center justify-center rounded-full">
                    <step.icon size={20} className="text-white" />
                  </div>
                  <span className="text-4xl font-bold text-white/10">{i + 1}</span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-white">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-white/55">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="mm-landing-section px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="mm-landing-tag">Why enterprises choose us</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Scale operations, <span className="text-violet-300">variabilize costs</span>
            </h2>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {whyUs.map((f) => (
              <article key={f.title} className="mm-landing-glass rounded-2xl p-6">
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

      {/* Impact metrics */}
      <section className="mm-landing-section px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <div className="mm-landing-glass grid grid-cols-2 gap-6 rounded-3xl p-8 sm:p-10 lg:grid-cols-4">
            {impact.map((m) => (
              <div key={m.label} className="text-center">
                <p className="text-3xl font-bold text-violet-300 sm:text-4xl">{m.value}</p>
                <p className="mt-1.5 text-xs font-medium text-white/50">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="mm-landing-section px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mm-landing-tag">Industries we serve</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Trusted across <span className="text-violet-300">sectors</span>
          </h2>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {industries.map((r) => (
              <span
                key={r}
                className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-white/70 transition hover:border-violet-400/30 hover:text-white"
              >
                {r}
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
              Want to optimize your{" "}
              <span className="bg-gradient-to-r from-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
                core operations?
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
