import SectionHeader from "@/components/marketing/SectionHeader";
import { cn } from "@/lib/utils";

export default function DashboardPageHeader({
  eyebrow,
  title,
  description,
  variant = "panel",
  className,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  variant?: "panel" | "hero";
  className?: string;
  children?: React.ReactNode;
}) {
  if (variant === "hero") {
    return (
      <section className={cn("mm-hero-panel p-6 sm:p-8", className)}>
        <div className="relative z-[1]">
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-200/90">{eyebrow}</p>
          ) : null}
          <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65 sm:text-[15px]">{description}</p>
          ) : null}
          {children}
        </div>
      </section>
    );
  }

  return (
    <section className={cn("mm-section-panel", className)}>
      <SectionHeader eyebrow={eyebrow} title={title} description={description} headingLevel="h1" />
      {children}
    </section>
  );
}
