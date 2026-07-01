import {
  ArrowRight,
  Boxes,
  Building2,
  Cpu,
  Eye,
  FlaskConical,
  Gauge,
  Hand,
  Home,
  Layers,
  PlayCircle,
  ShieldCheck,
  Target,
  Video,
  Workflow,
} from "lucide-react";

import DataAnnotationLeadForm from "@/components/marketing/business/DataAnnotationLeadForm";
import HomeImageCarousel from "@/components/marketing/home/HomeImageCarousel";
import { getCourseImage, marketingImages } from "@/lib/images";

const heroSlides = [
  { src: marketingImages.hero, caption: "Egocentric capture" },
  { src: getCourseImage("ai-agents"), caption: "Hand-object interaction" },
  { src: getCourseImage("generative-ai-llms"), caption: "Warehouse tasks" },
  { src: getCourseImage("ai-automation"), caption: "Manipulation" },
];

const heroStats = [
  { value: "10,000 Hr+", label: "Video captured per day" },
  { value: "98%+", label: "Labeling accuracy" },
  { value: "24/7", label: "Active pipeline" },
];

const whyChoose = [
  { icon: Gauge, title: "Speed", description: "A managed pipeline that scales to thousands of hours of footage per day." },
  { icon: Video, title: "Quality", description: "High-resolution egocentric video with consistent capture standards." },
  { icon: Boxes, title: "Scale", description: "A distributed workforce covering diverse environments and tasks." },
  { icon: Target, title: "Accuracy", description: "Multi-layer QA delivers precise, model-ready annotations." },
  { icon: ShieldCheck, title: "Security", description: "Secure handling, consent, and privacy controls across the pipeline." },
  { icon: Cpu, title: "Precision", description: "Frame-accurate labels tuned for robotics and imitation learning." },
];

const services = [
  {
    icon: Video,
    title: "Egocentric data collection for robotics",
    description: "Head-mounted, first-person video captured across real environments and workflows.",
    tags: ["Household tasks", "Office workflows", "Factory operations", "Tools & mechanical tasks"],
  },
  {
    icon: Hand,
    title: "Expert annotation & labeling",
    description: "Robotics-grade labeling from trained annotators with strict quality checks.",
    tags: [
      "Hand-object interaction",
      "Step sequencing",
      "Action segmentation",
      "Object tracking",
      "Pose / dextrous keypoints",
      "Natural-language captions",
      "Multi-camera sync",
      "Safety-critical labeling",
    ],
  },
];

const steps = [
  { icon: Target, title: "Define tasks", description: "We scope the tasks, environments, and quality parameters with you." },
  { icon: Boxes, title: "Recruit workers", description: "We source and train the right workforce for your capture needs." },
  { icon: Video, title: "Capture egocentric videos", description: "First-person footage recorded across real, varied conditions." },
  { icon: Hand, title: "Annotate with precision", description: "Frame-accurate labeling with robotics-grade QA." },
  { icon: Layers, title: "Deliver in any format", description: "Model-ready datasets exported to your preferred schema." },
];

const capture = [
  { icon: Hand, label: "Real human hand trajectories" },
  { icon: Boxes, label: "Object manipulation in tight spaces" },
  { icon: Workflow, label: "Step-by-step task understanding" },
  { icon: Eye, label: "Natural variations in speed, lighting & clutter" },
];

const useCases = [
  {
    image: getCourseImage("ai-automation"),
    icon: Home,
    title: "Household automation",
    points: ["Cooking & cleaning tasks", "Fetch & place", "Appliance operation", "Tidying & sorting"],
  },
  {
    image: getCourseImage("generative-ai-llms"),
    icon: Building2,
    title: "Office & enterprise",
    points: ["Document handling", "Restocking supplies", "Assisted workflows", "Desk operations"],
  },
  {
    image: getCourseImage("ai-agents"),
    icon: Cpu,
    title: "Industrial & manufacturing",
    points: ["Assembly steps", "Tool handling", "Quality inspection", "Material movement"],
  },
  {
    image: getCourseImage("prompt-engineering"),
    icon: FlaskConical,
    title: "R&D / AI labs",
    points: ["Benchmark datasets", "Imitation learning", "Manipulation research", "Custom task suites"],
  },
];

const samples = [
  { tag: "Household", title: "Fruit cutting", desc: "Precise hand + knife interaction frames." },
  { tag: "Industrial", title: "Chip soldering", desc: "Fine-motor manipulation in tight space." },
  { tag: "Industrial", title: "Welding", desc: "Tool handling with safety context." },
  { tag: "Household", title: "Watch cleaning", desc: "Delicate multi-step object handling." },
  { tag: "Household", title: "Toy sorting", desc: "Pick, classify, and place sequences." },
  { tag: "Office", title: "Document filing", desc: "Grasp, move, and organize actions." },
  { tag: "Industrial", title: "Assembly", desc: "Ordered step sequencing with parts." },
  { tag: "Lab", title: "Benchmark task", desc: "Repeatable manipulation for training." },
];

const audiences = [
  "Robotics companies",
  "AI labs",
  "Autonomous systems teams",
  "Industrial automation",
  "Consumer robotics",
  "Research institutions",
  "Humanoid developers",
  "Imitation learning teams",
  "Manipulation model teams",
  "Reinforcement learning teams",
  "Embodied AI teams",
];

export default function DataAnnotationPageContent() {
  return (
    <div className="mm-landing-page bg-black text-white">
      {/* Hero */}
      <section className="relative overflow-hidden px-5 pb-4 pt-12 sm:px-8 sm:pt-16 lg:px-10 lg:pt-20">
        <div className="pointer-events-none absolute inset-0 mm-landing-hero-glow" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <p className="mm-landing-eyebrow">Data annotation · Robotics</p>
            <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[3.1rem]">
              <span className="text-white/70">High-quality</span>{" "}
              <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-violet-200 bg-clip-text text-transparent">
                egocentric video data
              </span>{" "}
              <span className="text-white">for physical AI, robotics &amp; imitation learning</span>
            </h1>
            <p className="mt-6 max-w-xl text-sm leading-7 text-white/55 sm:text-base sm:leading-8">
              We capture first-person, head-mounted video and deliver robotics-grade annotations at scale—so
              your models learn from real human demonstrations, not synthetic guesswork.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#quote"
                className="mm-btn-glow inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-semibold shadow-[0_0_40px_-8px_rgba(139,92,246,0.7)]"
              >
                Get started <ArrowRight size={18} />
              </a>
              <a
                href="#samples"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-violet-400/40 bg-white/5 px-8 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                <PlayCircle size={18} /> Watch sample dataset
              </a>
            </div>
          </div>
          <HomeImageCarousel slides={heroSlides} />
        </div>

        <div className="relative mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
          {heroStats.map((s) => (
            <div key={s.label} className="mm-landing-glass rounded-2xl px-6 py-5 text-center">
              <p className="text-2xl font-bold text-violet-300 sm:text-3xl">{s.value}</p>
              <p className="mt-1 text-xs font-medium text-white/50">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section className="mm-landing-section px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mm-landing-tag">About</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            A physical-AI <span className="text-violet-300">data engine</span>
          </h2>
          <p className="mt-5 text-sm leading-7 text-white/55 sm:text-base sm:leading-8">
            We combine a trained, distributed workforce with a rigorous annotation pipeline to produce
            model-ready egocentric datasets—collected safely, labeled precisely, and delivered on schedule.
          </p>
        </div>
      </section>

      {/* Why choose us */}
      <section className="mm-landing-section px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="mm-landing-tag">Why companies choose us</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              A powerful <span className="text-violet-300">egocentric video engine</span>
            </h2>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {whyChoose.map((f) => (
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

      {/* What we do */}
      <section className="mm-landing-section px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="mm-landing-tag">What we do</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Capture &amp; <span className="text-violet-300">annotate</span>
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

      {/* How it works */}
      <section className="mm-landing-section px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <p className="mm-landing-tag">How it works</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              From task to <span className="text-violet-300">model-ready data</span>
            </h2>
          </div>
          <ol className="relative mt-12 space-y-8 pl-4">
            <span
              aria-hidden
              className="absolute left-[27px] top-2 bottom-2 w-px bg-gradient-to-b from-violet-500/60 via-violet-500/25 to-transparent"
            />
            {steps.map((step, i) => (
              <li key={step.title} className="relative flex gap-5">
                <div className="mm-landing-icon-badge relative z-[1] flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
                  <step.icon size={20} className="text-white" />
                </div>
                <div className="pt-1">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-violet-400">
                    Step {i + 1}
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-white">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-white/55">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Why egocentric data matters */}
      <section className="mm-landing-section px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mm-landing-tag">Why egocentric data matters</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Robots learn best from <span className="text-violet-300">human POV</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/55 sm:text-base sm:leading-8">
            First-person demonstrations capture the intent, timing, and dexterity that third-person video
            misses—giving foundation models the grounding they need to act in the real world.
          </p>
          <div className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-2">
            {capture.map((c) => (
              <div key={c.label} className="mm-landing-glass flex items-start gap-3 rounded-2xl p-5 text-left">
                <div className="mm-landing-icon-badge flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
                  <c.icon size={16} className="text-white" />
                </div>
                <p className="pt-1 text-sm font-medium text-white/70">{c.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm font-medium italic text-white/45">
            The foundation for capable, real-world robotics.
          </p>
        </div>
      </section>

      {/* Use cases */}
      <section className="mm-landing-section px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="mm-landing-tag">Robotics use cases</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Teach robots <span className="text-violet-300">real-world tasks</span>
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {useCases.map((u) => (
              <article key={u.title} className="mm-landing-glass overflow-hidden rounded-2xl">
                <div className="relative h-44 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={u.image} alt={u.title} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  <div className="mm-landing-icon-badge absolute bottom-4 left-4 flex h-11 w-11 items-center justify-center rounded-full">
                    <u.icon size={20} className="text-white" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white">{u.title}</h3>
                  <ul className="mt-3 space-y-2">
                    {u.points.map((p) => (
                      <li key={p} className="flex items-start gap-2.5 text-sm text-white/60">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Sample data */}
      <section id="samples" className="mm-landing-section px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="mm-landing-tag">Sample data</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              A snapshot of <span className="text-violet-300">captured tasks</span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-white/50">
              High-resolution egocentric clips across diverse, real-world manipulation tasks.
            </p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {samples.map((s) => (
              <article key={s.title} className="mm-landing-glass overflow-hidden rounded-2xl">
                <div className="relative flex aspect-video items-center justify-center bg-gradient-to-br from-violet-900/30 to-black">
                  <PlayCircle size={28} className="text-white/60" />
                  <span className="absolute left-2 top-2 rounded-full border border-white/15 bg-black/50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-white/80">
                    {s.tag}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-bold text-white">{s.title}</h3>
                  <p className="mt-1 text-xs leading-5 text-white/50">{s.desc}</p>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-10 text-center text-sm font-semibold text-white/60">
            300K+ clips processed daily with{" "}
            <span className="text-violet-300">98%+ annotation accuracy</span>.
          </p>
        </div>
      </section>

      {/* Who we serve */}
      <section className="mm-landing-section px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mm-landing-tag">Who we serve</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Powering the next generation of <span className="text-violet-300">robotics &amp; AI</span>
          </h2>
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

      {/* CTA */}
      <section className="mm-landing-section px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-violet-400/20 px-6 py-14 text-center sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute inset-0 mm-landing-cta-glow" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/60 to-transparent" />
          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[2.75rem]">
              Supercharge your robotics models with{" "}
              <span className="bg-gradient-to-r from-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
                human POV data
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/60 sm:text-base">
              Get a sample dataset and a tailored plan for your capture and annotation needs.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#quote"
                className="mm-btn-glow inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-semibold shadow-[0_0_40px_-8px_rgba(139,92,246,0.7)]"
              >
                Get a dataset sample <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <DataAnnotationLeadForm />
    </div>
  );
}
