import { ArrowRight, PlayCircle } from "lucide-react";

import Button from "@/components/marketing/Button";
import HomeImageCarousel from "@/components/marketing/home/HomeImageCarousel";
import { getCourseImage, marketingImages } from "@/lib/images";
import { signupUrl } from "@/lib/site";

const slides = [
  { src: marketingImages.hero, caption: "Live cohorts" },
  { src: getCourseImage("prompt-engineering"), caption: "Prompt Engineering" },
  { src: getCourseImage("generative-ai-llms"), caption: "Generative AI & LLMs" },
  { src: getCourseImage("ai-agents"), caption: "AI Agents" },
  { src: getCourseImage("ai-automation"), caption: "AI Automation" },
];

const stats = [
  { value: "4", label: "AI career tracks" },
  { value: "98%+", label: "Capstone completion" },
  { value: "Weekly", label: "Mentor touchpoints" },
];

export default function HomeHeroSection() {
  return (
    <section className="relative overflow-hidden px-5 pb-4 pt-12 sm:px-8 sm:pt-16 lg:px-10 lg:pt-20">
      <div className="pointer-events-none absolute inset-0 mm-landing-hero-glow" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div>
          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[3.25rem]">
            <span className="text-white/70">High-Quality</span>{" "}
            <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-violet-200 bg-clip-text text-transparent">
              Mentorship-led
            </span>{" "}
            <span className="text-violet-300">AI Courses</span>{" "}
            <span className="text-white">for careers, not passive watching</span>
          </h1>

          <p className="mt-6 max-w-xl text-sm leading-7 text-white/55 sm:text-base sm:leading-8">
            Master prompt engineering, generative AI, agents, and automation through structured cohorts with
            weekly mentor review—so you finish with capstone proof recruiters can verify, not just another
            unfinished course.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              href={signupUrl()}
              variant="gradient"
              size="lg"
              className="rounded-full px-8 shadow-[0_0_40px_-8px_rgba(139,92,246,0.7)]"
            >
              Get started <ArrowRight size={18} />
            </Button>
            <Button
              href="/courses"
              variant="secondary"
              size="lg"
              className="rounded-full border-violet-400/40 bg-white/5 text-white hover:bg-white/10"
            >
              <PlayCircle size={18} /> Explore courses
            </Button>
          </div>
        </div>

        <HomeImageCarousel slides={slides} />
      </div>

      {/* Stats bar */}
      <div className="relative mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="mm-landing-glass rounded-2xl px-6 py-5 text-center">
            <p className="text-3xl font-bold text-violet-300 sm:text-4xl">{s.value}</p>
            <p className="mt-1 text-xs font-medium text-white/50">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
