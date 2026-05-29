import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-black transition focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-violet-500/25 disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        primary:
          "bg-zinc-950 text-white hover:scale-[1.02] dark:bg-white dark:text-zinc-950",
        gradient:
          "bg-gradient-to-r from-violet-500 via-fuchsia-500 to-teal-400 text-white shadow-lg shadow-violet-500/20 hover:scale-[1.02] hover:shadow-violet-500/35",
        secondary:
          "border border-zinc-300 bg-white text-zinc-950 hover:bg-zinc-50 dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-white/10",
        ghost:
          "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white",
      },
      size: {
        md: "px-5 py-2.5",
        lg: "px-6 py-4",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    href?: string;
  };

export default function Button({
  className,
  variant,
  size,
  href,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size }), className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
