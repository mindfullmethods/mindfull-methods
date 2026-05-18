import { Button } from "@/components/ui/button";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";

export default function Hero() {
  return (
    <Section className="relative overflow-hidden">
      <Container className="flex flex-col items-center text-center">
        <span className="rounded-full border px-4 py-1 text-sm font-medium">
          #1 Internship Platform
        </span>

        <h1 className="mt-6 max-w-5xl text-4xl md:text-6xl font-bold leading-tight tracking-tight">
          Build Real Skills With Industry Ready Internships
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-gray-600">
          Learn from experts, work on real-world projects, and accelerate your
          career with practical internship programs.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button size="lg">
            Explore Programs
          </Button>

          <Button variant="outline" size="lg">
            Watch Demo
          </Button>
        </div>
      </Container>
    </Section>
  );
}