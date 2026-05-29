import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.18em]",
  {
    variants: {
      tone: {
        violet:
          "bg-violet-100 text-violet-800 ring-1 ring-violet-200 dark:bg-violet-500/15 dark:text-violet-200 dark:ring-violet-500/20",
        emerald:
          "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-200 dark:ring-emerald-500/20",
        sky: "bg-sky-100 text-sky-800 ring-1 ring-sky-200 dark:bg-sky-500/15 dark:text-sky-200 dark:ring-sky-500/20",
        neutral:
          "bg-zinc-100 text-zinc-700 ring-1 ring-zinc-200 dark:bg-white/10 dark:text-white/70 dark:ring-white/15",
      },
    },
    defaultVariants: {
      tone: "neutral",
    },
  }
);

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>;

export default function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
