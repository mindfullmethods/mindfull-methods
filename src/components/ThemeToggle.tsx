"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export default function ThemeToggle({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md";
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn(size === "sm" ? "h-10 w-10" : "h-11 w-11", "rounded-xl", className)}
        aria-hidden
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "inline-flex items-center justify-center rounded-xl border transition hover:scale-[1.02]",
        size === "sm" ? "h-10 w-10" : "h-11 w-11",
        "border-zinc-200 bg-white text-zinc-950 hover:bg-zinc-50",
        "dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-white/10",
        className
      )}
    >
      {isDark ? <Sun size={size === "sm" ? 17 : 18} /> : <Moon size={size === "sm" ? 17 : 18} />}
    </button>
  );
}
