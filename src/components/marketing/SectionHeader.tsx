import * as React from "react";

import { cn } from "@/lib/utils";

export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  gradientTitle = false,
  headingLevel = "h2",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  gradientTitle?: boolean;
  headingLevel?: "h1" | "h2";
  className?: string;
}) {
  const Heading = headingLevel ?? "h2";

  return (
    <div className={cn(className, align === "center" ? "text-center" : "text-left")}>
      {eyebrow ? <p className="mm-pro-eyebrow">{eyebrow}</p> : null}
      <Heading
        className={cn(
          "mt-3 font-bold tracking-tight text-zinc-950 dark:text-white",
          headingLevel === "h1"
            ? "text-4xl leading-[1.1] sm:text-5xl"
            : "text-3xl sm:text-4xl",
          gradientTitle && "mm-gradient-text"
        )}
      >
        {title}
      </Heading>
      {description ? (
        <p className={cn("mt-3 max-w-2xl text-[15px] leading-7 mm-muted", align === "center" && "mx-auto")}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
