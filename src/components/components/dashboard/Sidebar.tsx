"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  LayoutDashboard,
  FileText,
  LogOut,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

export default function Sidebar() {
  const pathname = usePathname();

  async function handleLogout() {
    await supabase.auth.signOut();

    window.location.href = "/login";
  }

  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Applications",
      href: "/dashboard/applications",
      icon: FileText,
    },
    {
      label: "Admin Panel",
      href: "/dashboard/admin",
      icon: Briefcase,
    },
  ];
   
  return (
  <aside className="sticky top-0 flex h-screen w-80 flex-col border-r border-white/20 bg-white/70 p-8 shadow-2xl backdrop-blur-2xl">

    <div className="mb-14">

      <div className="flex items-center gap-4">

        <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-black text-2xl font-black text-white shadow-xl">
          M
        </div>

        <div>

          <h1 className="text-3xl font-black tracking-tight">
            Mindfull Methods
          </h1>

          <p className="text-sm font-medium text-gray-400">
            Internship Platform
          </p>

        </div>

      </div>

    </div>

    <nav className="flex flex-1 flex-col gap-4">

      {links.map((link) => {
        const Icon = link.icon;

        const active =
          pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`group relative overflow-hidden rounded-3xl px-6 py-5 transition-all duration-300 ${
              active
                ? "bg-black text-white shadow-2xl"
                : "bg-white/40 hover:bg-white/80"
            }`}
          >

            <div className="relative z-10 flex items-center gap-4">

              <div
                className={`rounded-2xl p-3 transition ${
                  active
                    ? "bg-white/20"
                    : "bg-black/5 group-hover:bg-black/10"
                }`}
              >
                <Icon size={22} />
              </div>

              <span className="text-lg font-semibold">
                {link.label}
              </span>

            </div>

          </Link>
        );
      })}

    </nav>

    <div className="mt-10 rounded-[32px] border border-black/5 bg-gradient-to-br from-black to-gray-700 p-6 text-white shadow-2xl">

      <p className="text-sm text-gray-300">
        Current Status
      </p>

      <h2 className="mt-3 text-2xl font-black">
        MVP Completed 🚀
      </h2>

      <p className="mt-3 text-sm leading-7 text-gray-300">
        Your internship platform is now
        entering premium SaaS stage.
      </p>

    </div>

    <button
      onClick={handleLogout}
      className="mt-8 flex items-center justify-center gap-3 rounded-3xl border border-red-200 bg-red-50 py-5 text-lg font-semibold text-red-500 transition duration-300 hover:scale-[1.02] hover:bg-red-100"
    >

      <LogOut size={22} />

      Logout

    </button>

  </aside>
);
}