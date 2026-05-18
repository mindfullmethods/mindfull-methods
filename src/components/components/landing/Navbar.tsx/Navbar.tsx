import { Button } from "@/components/ui/button";
import Container from "@/components/ui/Container";
import { ModeToggle } from "@/components/components/ui/mode-toggle";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-black/5 bg-white/70 backdrop-blur-xl transition-colors dark:border-white/10 dark:bg-black/70">
      <Container className="flex items-center justify-between py-5">
        
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-black" />

          <h1 className="text-xl font-black tracking-tight md:text-2xl">
            Unified Clone
          </h1>
        </div>

        {/* Navigation */}
        <div className="hidden items-center gap-10 md:flex">
          <a
            href="#"
            className="text-sm font-medium text-gray-700 transition hover:text-black"
          >
            Home
          </a>

          <a
            href="#"
            className="text-sm font-medium text-gray-700 transition hover:text-black"
          >
            Internships
          </a>

          <a
            href="#"
            className="text-sm font-medium text-gray-700 transition hover:text-black"
          >
            About
          </a>

          <a
            href="#"
            className="text-sm font-medium text-gray-700 transition hover:text-black"
          >
            Contact
          </a>
        </div>

        {/* CTA Button */}
        <div className="flex items-center gap-3">
            <ModeToggle />
        
        <Button className="rounded-xl px-5 shadow-md transition hover:scale-105">
          Get Started
        </Button>
    </div>
      </Container>
    </nav>
  );
}