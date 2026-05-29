"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  ClipboardList,
  CreditCard,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  PanelLeftClose,
  Rocket,
  ShieldCheck,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import BrandLogo from "@/components/marketing/BrandLogo";
import { marketingImages } from "@/lib/images";

const studentLinks = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Courses", href: "/dashboard/courses", icon: BookOpen },
  { label: "My courses", href: "/dashboard/my-courses", icon: GraduationCap },
  { label: "Internships", href: "/dashboard/internships", icon: BriefcaseBusiness },
  { label: "My applications", href: "/dashboard/my-applications", icon: ClipboardList },
];

const adminLinks = [
  { label: "Launch setup", href: "/dashboard/setup", icon: Rocket },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "All applications", href: "/dashboard/applications", icon: ClipboardList },
  { label: "All enrollments", href: "/dashboard/enrollments", icon: CreditCard },
  { label: "Contact inquiries", href: "/dashboard/inquiries", icon: Mail },
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
        className={`fixed inset-y-0 left-0 z-40 flex h-screen w-[86vw] max-w-80 flex-col overflow-hidden border-r border-zinc-200 bg-[#f7f8f5]/95 shadow-2xl backdrop-blur-xl transition-transform duration-300 dark:border-white/10 dark:bg-zinc-950/95 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="shrink-0 p-5 pb-0">
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
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6">
          <nav className="flex flex-col gap-2">
            {links.map((link) => {
              const Icon = link.icon;
              const active =
                pathname === link.href ||
                (link.href !== "/dashboard" && pathname.startsWith(`${link.href}/`));

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

          <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-white/5">
            <img
              src={marketingImages.dashboardPreview}
              alt="Dashboard preview"
              className="h-24 w-full object-cover object-left-top"
            />
            <div className="p-5">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-zinc-500">Platform health</p>
              <p className="mt-3 text-2xl font-black">Production Track</p>
              <p className="mt-2 text-sm leading-6 text-zinc-500">
                Internships, applications, and admin operations are connected.
              </p>
            </div>
          </div>
        </div>

        <div className="shrink-0 border-t border-zinc-200 p-5 pt-4 dark:border-white/10">
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-black text-red-600 transition hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
