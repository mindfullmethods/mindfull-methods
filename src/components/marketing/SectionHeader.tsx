import * as React from "react";

import { cn } from "@/lib/utils";

export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(className, align === "center" ? "text-center" : "text-left")}
    >
      {eyebrow ? (
        <p className="text-sm font-black uppercase tracking-[0.28em] text-white/60">{eyebrow}</p>
      ) : null}
      <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">{title}</h2>
      {description ? <p className="mt-4 text-base leading-7 text-white/70">{description}</p> : null}
    </div>
  );
}

