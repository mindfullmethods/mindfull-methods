import { cn } from "@/lib/utils";

const iconSizes = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
  xl: "h-14 w-14",
} as const;

const textSizes = {
  sm: "text-[0.95rem]",
  md: "text-[1.05rem]",
  lg: "text-[1.25rem]",
  xl: "text-[1.45rem]",
} as const;

export default function BrandWordmark({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  return (
    <span className={cn("inline-flex min-w-0 items-center gap-2.5", className)} aria-label="Mindfull Methods">
      <span
        className={cn(
          iconSizes[size],
          "flex shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-zinc-200/80 dark:bg-white/95 dark:ring-white/25"
        )}
      >
        <img
          src="/brand-assets/logo-icon.png"
          alt=""
          aria-hidden
          className="h-[88%] w-[88%] object-contain"
        />
      </span>
      <span className={cn("min-w-0 leading-[1.05]", textSizes[size])}>
        <span className="block truncate font-black tracking-tight mm-gradient-text">Mindfull</span>
        <span className="block truncate font-black tracking-tight text-zinc-950 dark:text-zinc-50">Methods</span>
      </span>
    </span>
  );
}
