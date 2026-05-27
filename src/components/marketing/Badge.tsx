import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.18em]", {
  variants: {
    tone: {
      violet: "bg-violet-500/15 text-violet-200 ring-1 ring-violet-500/20",
      emerald: "bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-500/20",
      sky: "bg-sky-500/15 text-sky-200 ring-1 ring-sky-500/20",
      neutral: "bg-white/10 text-white/70 ring-1 ring-white/15",
    },
  },
  defaultVariants: {
    tone: "neutral",
  },
});

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>;

export default function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}

