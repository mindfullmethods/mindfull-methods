"use client";

import { Bell, Search } from "lucide-react";

export default function Topbar() {
  return (
    <header className="flex items-center justify-between border-b border-black/10 bg-white px-8 py-5">

      <div>
        <h1 className="text-2xl font-bold">
          Dashboard
        </h1>

        <p className="text-sm text-gray-500">
          Welcome back, Rajiv 👋
        </p>
      </div>

      <div className="flex items-center gap-4">

        <div className="flex items-center gap-2 rounded-2xl border border-black/10 px-4 py-2">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search internships..."
            className="outline-none"
          />
        </div>

        <button className="rounded-2xl border border-black/10 p-3 transition hover:bg-gray-100">
          <Bell size={20} />
        </button>

      </div>
    </header>
  );
}