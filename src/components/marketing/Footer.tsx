import Link from "next/link";

import BrandLogo from "@/components/marketing/BrandLogo";

const exploreLinks = [
  { href: "/courses", label: "Courses" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const studentLinks = [
  { href: "/signup", label: "Sign up" },
  { href: "/login", label: "Login" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/internships", label: "Internships" },
];

const legalLinks = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-zinc-950 px-5 py-12 text-sm text-white/70 sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
        <div className="max-w-sm">
          <Link href="/" className="inline-flex">
            <BrandLogo size="lg" />
          </Link>

          <p className="mt-4 leading-6 text-white/60">
            Build career-ready skills with structured courses, mentor support, and practical projects.
          </p>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/55">Explore</p>
          <ul className="mt-4 flex flex-col gap-3">
            {exploreLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="font-bold text-white/70 transition hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/55">Students</p>
          <ul className="mt-4 flex flex-col gap-3">
            {studentLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="font-bold text-white/70 transition hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/55">Contact</p>
          <ul className="mt-4 flex flex-col gap-3">
            <li>
              <a
                href="mailto:support@mindfullmethods.com"
                className="font-bold text-white/70 transition hover:text-white"
              >
                support@mindfullmethods.com
              </a>
            </li>
            <li className="font-bold text-white/70">Mon–Fri, 10am–6pm IST</li>
          </ul>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.22em] text-white/55">Legal</p>
          <ul className="mt-3 flex flex-col gap-3">
            {legalLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="font-bold text-white/70 transition hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6 text-xs font-bold text-white/50">
        © {new Date().getFullYear()} Mindfull Methods. All rights reserved.
      </div>
    </footer>
  );
}
