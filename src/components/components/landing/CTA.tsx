import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CTA() {
  return (
    <section className="bg-black py-28 text-white">
      <div className="mx-auto max-w-5xl px-6 text-center">
        
        <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium">
          Start Your Journey
        </span>

        <h2 className="mt-8 text-4xl font-black tracking-tight md:text-6xl">
          Ready To Build Your Future?
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-300">
          Join thousands of students learning real-world skills and building successful careers.
        </p>

        <div className="mt-10">
          <Link
            href="/dashboard"
            className="rounded-3xl bg-white px-10 py-5 text-lg font-semibold text-black shadow-2xl transition duration-300 hover:scale-105 dark:bg-white dark:text-black"
          >
            Get Started Today
          </Link>
        </div>
      </div>
    </section>
  );
}