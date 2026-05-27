import { cn } from "@/lib/utils";

const sources = {
  full: {
    dark: "/brand-assets/logo-full.png",
    light: "/brand-assets/logo-full-light.png",
  },
  icon: "/brand-assets/logo-icon.png",
} as const;

type BrandLogoProps = {
  variant?: "full" | "icon";
  theme?: "dark" | "light";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
};

const fullSizes = {
  sm: "h-9 max-w-[160px]",
  md: "h-11 max-w-[200px]",
  lg: "h-14 max-w-[240px]",
  xl: "h-[4.5rem] max-w-[280px]",
} as const;

const iconSizes = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
  xl: "h-14 w-14",
} as const;

export default function BrandLogo({
  variant = "full",
  theme = "dark",
  size = "md",
  className,
}: BrandLogoProps) {
  const isIcon = variant === "icon";
  const src = isIcon ? sources.icon : sources.full[theme];

  return (
    <img
      src={src}
      alt="Mindfull Methods"
      className={cn(
        isIcon
          ? cn(iconSizes[size], "rounded-xl object-cover")
          : cn(fullSizes[size], "w-auto shrink-0 bg-transparent object-contain object-left"),
        className
      )}
    />
  );
}
