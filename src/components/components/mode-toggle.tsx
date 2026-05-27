"use client";

import { Moon, Sun } from "lucide-react";

import { useTheme } from "next-themes";

import { useEffect, useState } from "react";

export default function ModeToggle() {

  const { theme, setTheme } =
    useTheme();

  const [mounted, setMounted] =
    useState(false);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={() =>
        setTheme(
          theme === "dark"
            ? "light"
            : "dark"
        )
      }
      className="flex h-14 w-14 items-center justify-center rounded-3xl border border-white/20 bg-white/70 shadow-xl backdrop-blur-xl transition duration-300 hover:scale-105 dark:bg-zinc-900"
    >

      {theme === "dark" ? (
        <Sun size={22} />
      ) : (
        <Moon size={22} />
      )}

    </button>
  );
}