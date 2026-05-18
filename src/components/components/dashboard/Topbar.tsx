import { Bell } from "lucide-react";

export default function Topbar() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-black/5 bg-white/70 px-8 py-5 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/70">
      
      <div>
        <h1 className="text-2xl font-black tracking-tight">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Welcome back, Rajiv 👋
        </p>
      </div>

      <button className="rounded-2xl border border-black/10 p-3 transition hover:bg-black hover:text-white dark:border-white/10 dark:hover:bg-white dark:hover:text-black">
        <Bell size={20} />
      </button>
    </header>
  );
}