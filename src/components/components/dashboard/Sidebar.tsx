"use client";

import {
  LayoutDashboard,
  BookOpen,
  User,
  Settings,
  Menu,
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const links = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Internships",
    icon: BookOpen,
  },
  {
    name: "Profile",
    icon: User,
  },
  {
    name: "Settings",
    icon: Settings,
  },
];

function SidebarContent() {
  return (
    <div className="flex h-full flex-col">
      
      {/* Logo */}
      <div className="border-b border-black/5 p-8 dark:border-white/10">
        <h1 className="text-2xl font-black tracking-tight">
          Unified Clone
        </h1>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-2 p-5">
        {links.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              className="flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-left text-sm font-medium transition hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
            >
              <Icon size={20} />

              {item.name}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export default function Sidebar() {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden w-72 border-r border-black/5 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/70 lg:flex lg:flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <div className="fixed left-4 top-4 z-50 lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <button className="rounded-2xl border border-black/10 bg-white p-3 shadow-lg dark:border-white/10 dark:bg-zinc-900">
              <Menu size={20} />
            </button>
          </SheetTrigger>

          <SheetContent side="left" className="w-72 p-0">

            <SheetHeader className="sr-only">
              <SheetTitle>
                Mobile Navigation
              </SheetTitle>
            </SheetHeader>
            
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}