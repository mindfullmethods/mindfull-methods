"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";

export default function Hero() {
  return (
    <Section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 transition-colors dark:from-black dark:to-zinc-950">
      {/* Background Blur */}
      <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-black/5 blur-3xl" />

      <Container className="relative flex flex-col items-center text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-full border border-black/10 bg-white/70 px-5 py-2 text-sm font-medium shadow-sm backdrop-blur-md"
        >
          🚀 Trusted by 10,000+ Students
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mt-8 max-w-5xl text-4xl font-black leading-tight tracking-tight md:text-7xl"
        >
          Launch Your Career With
          <span className="bg-gradient-to-r from-black to-gray-500 bg-clip-text text-transparent">
            {" "}
            Industry Ready Internships
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mt-8 max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-gray-400"
        >
          Learn from experts, work on real-world projects, and accelerate your
          career with premium internship programs designed for modern students.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Button
            size="lg"
            className="rounded-2xl px-8 py-6 text-base shadow-lg transition hover:scale-105"
          >
            Explore Programs
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="rounded-2xl px-8 py-6 text-base backdrop-blur-sm"
          >
            Watch Demo
          </Button>
        </motion.div>

        {/* Stats Cards */}
        <div className="mt-20 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-black/5 bg-white/70 p-6 shadow-xl backdrop-blur-md transition hover:-translate-y-2">
            <h3 className="text-2xl font-bold">500+</h3>
            <p className="mt-2 text-gray-600">
              Industry Projects
            </p>
          </div>

          <div className="rounded-3xl border border-black/5 bg-white/70 p-6 shadow-xl backdrop-blur-md transition hover:-translate-y-2">
            <h3 className="text-2xl font-bold">95%</h3>
            <p className="mt-2 text-gray-600">
              Completion Rate
            </p>
          </div>

          <div className="rounded-3xl border border-black/5 bg-white/70 p-6 shadow-xl backdrop-blur-md transition hover:-translate-y-2">
            <h3 className="text-2xl font-bold">10K+</h3>
            <p className="mt-2 text-gray-600">
              Students Enrolled
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}