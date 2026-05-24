import Link from "next/link";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/Container";
import { ModeToggle } from "@/components/components/ui/mode-toggle";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-black/5 bg-white/70 backdrop-blur-xl transition-colors dark:border-white/10 dark:bg-black/70">
      <Container className="flex items-center justify-between py-5">
        
        {/* Logo */}
        <div className="flex items-center gap-4">

  <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-black shadow-2xl">

    <span className="text-3xl font-black text-white">
      M
    </span>

    <div className="absolute inset-0 rounded-2xl border border-white/10" />

  </div>

  <div>

    <h1 className="text-3xl font-black tracking-tight text-black dark:text-white">
      Mindfull Methods
    </h1>

    <p className="text-sm font-medium tracking-[0.2em] text-gray-500 dark:text-gray-400">
      INTERNSHIP PLATFORM
    </p>

  </div>

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
        
        <Link href="/login">
          <button className="rounded-2xl bg-black px-6 py-3 text-white shadow-xl transition duration-300 hover:scale-105 dark:bg-white dark:text-black">
             Get Started
          </button>
        </Link>
    </div>
      </Container>
    </nav>
  );
}