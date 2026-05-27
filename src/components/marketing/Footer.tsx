import Link from "next/link";

const quickLinks = [
  { href: "/courses", label: "Courses" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-zinc-950 px-5 py-10 text-sm text-white/70 sm:px-8 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-md">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white/10 p-1">
              <img
                src="/brand-assets/logo.png"
                alt="Mindfull Methods logo"
                className="h-full w-full object-contain"
              />
            </span>
            <div>
              <p className="text-base font-black tracking-tight text-white">Mindfull Methods</p>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/55">
                Mentorship & courses
              </p>
            </div>
          </div>

          <p className="mt-4 text-white/60">
            Build career-ready skills with structured courses, mentor support, and practical projects.
          </p>
        </div>

        <div className="flex gap-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/55">Quick links</p>
            <ul className="mt-4 flex flex-col gap-3">
              {quickLinks.map((l) => (
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
              <li className="font-bold text-white/70">support@mindfullmethods.com</li>
              <li className="font-bold text-white/70">Mon–Fri, 10am–6pm</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6 text-xs font-bold text-white/50">
        © {new Date().getFullYear()} Mindfull Methods. All rights reserved.
      </div>
    </footer>
  );
}

