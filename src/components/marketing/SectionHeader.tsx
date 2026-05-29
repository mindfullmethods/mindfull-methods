import * as React from "react";

import { cn } from "@/lib/utils";

export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  gradientTitle = false,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  gradientTitle?: boolean;
  className?: string;
}) {
  return (
    <div className={cn(className, align === "center" ? "text-center" : "text-left")}>
      {eyebrow ? (
        <p className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.28em] text-violet-700 dark:text-violet-300/90">
          <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-violet-500 to-teal-400 dark:from-violet-400 dark:to-teal-300" />
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          "mt-4 text-4xl font-black tracking-tight text-zinc-950 sm:text-5xl dark:text-white",
          gradientTitle && "mm-gradient-text"
        )}
      >
        {title}
      </h2>
      {description ? (
        <p className={cn("mt-4 max-w-2xl text-base leading-7 mm-muted", align === "center" && "mx-auto")}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
