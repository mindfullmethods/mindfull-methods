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
        <p className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.28em] text-violet-300/90">
          <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-violet-400 to-teal-300" />
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          "mt-4 text-4xl font-black tracking-tight sm:text-5xl",
          gradientTitle && "mm-gradient-text"
        )}
      >
        {title}
      </h2>
      {description ? <p className="mt-4 max-w-2xl text-base leading-7 text-white/70">{description}</p> : null}
    </div>
  );
}
