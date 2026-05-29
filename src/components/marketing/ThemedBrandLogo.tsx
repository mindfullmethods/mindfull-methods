import BrandLogo from "@/components/marketing/BrandLogo";
import BrandWordmark from "@/components/marketing/BrandWordmark";
import { cn } from "@/lib/utils";

type ThemedBrandLogoProps = {
  variant?: "full" | "icon";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
};

export default function ThemedBrandLogo({
  className,
  variant = "full",
  size = "md",
}: ThemedBrandLogoProps) {
  if (variant === "icon") {
    return <BrandLogo variant="icon" size={size} className={className} />;
  }

  return (
    <>
      <BrandWordmark size={size} className={cn(className, "dark:hidden")} />
      <BrandLogo
        variant="full"
        theme="dark"
        size={size}
        className={cn(className, "hidden dark:inline-flex")}
      />
    </>
  );
}
