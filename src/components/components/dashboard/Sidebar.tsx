"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BriefcaseBusiness,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  PanelLeftClose,
  ShieldCheck,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import BrandLogo from "@/components/marketing/BrandLogo";

const studentLinks = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Internships", href: "/dashboard/internships", icon: BriefcaseBusiness },
];

const adminLinks = [
  { label: "Applications", href: "/dashboard/applications", icon: ClipboardList },
  { label: "Admin Studio", href: "/dashboard/admin", icon: ShieldCheck },
];

export default function Sidebar({ isAdmin = false }: { isAdmin?: boolean }) {
  const [userEmail, setUserEmail] = useState("");
  const [open, setOpen] = useState(true);
  const pathname = usePathname();
  const links = isAdmin ? [...studentLinks, ...adminLinks] : studentLinks;

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUserEmail(user?.email || "");
    }

    getUser();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open navigation"
          className="fixed left-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-950 text-white shadow-xl lg:hidden"
        >
          <Menu size={20} />
        </button>
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[86vw] max-w-80 flex-col border-r border-zinc-200 bg-[#f7f8f5]/95 p-5 shadow-2xl backdrop-blur-xl transition-transform duration-300 dark:border-white/10 dark:bg-zinc-950/95 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <Link href="/dashboard" className="inline-flex min-w-0 flex-1">
            <BrandLogo size="sm" theme="light" className="max-w-[170px]" />
          </Link>

          <button
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
            className="rounded-xl p-2 text-zinc-500 transition hover:bg-zinc-200/70 dark:hover:bg-white/10 lg:hidden"
          >
            <PanelLeftClose size={20} />
          </button>
        </div>

        <div className="mt-8 rounded-2xl bg-zinc-950 p-5 text-white dark:bg-white dark:text-zinc-950">
          <p className="text-xs font-black uppercase tracking-[0.24em] opacity-60">Signed in</p>
          <p className="mt-3 truncate text-sm font-bold">{userEmail || "Student workspace"}</p>
        </div>

        <nav className="mt-8 flex flex-1 flex-col gap-2">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => {
                  if (window.innerWidth < 1024) setOpen(false);
                }}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-black transition ${
                  active
                    ? "bg-zinc-950 text-white shadow-lg dark:bg-white dark:text-zinc-950"
                    : "text-zinc-600 hover:bg-white hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white"
                }`}
              >
                <Icon size={19} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-white/5">
          <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=60" alt="Dashboard preview" className="h-24 w-full object-cover object-left-top" />
          <div className="p-5">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-zinc-500">Platform health</p>
          <p className="mt-3 text-2xl font-black">Production Track</p>
          <p className="mt-2 text-sm leading-6 text-zinc-500">Internships, applications, and admin operations are connected.</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-black text-red-600 transition hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>
    </>
  );
}
