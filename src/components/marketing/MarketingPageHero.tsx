import SectionHeader from "@/components/marketing/SectionHeader";
import { cn } from "@/lib/utils";

export default function MarketingPageHero({
  eyebrow,
  title,
  description,
  gradientTitle,
  className,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  gradientTitle?: boolean;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-b mm-border px-5 pb-10 pt-8 sm:px-8 sm:pb-14 sm:pt-10 lg:px-10",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 mm-grid-bg opacity-30" />
      <div className="pointer-events-none absolute -left-24 top-0 h-48 w-48 rounded-full bg-violet-600/10 blur-[90px]" />
      <div className="pointer-events-none absolute -right-16 top-12 h-40 w-40 rounded-full bg-violet-600/8 blur-[80px]" />

      <div className="relative mx-auto max-w-7xl">
        <SectionHeader
          eyebrow={eyebrow}
          title={title}
          description={description}
          gradientTitle={gradientTitle}
          headingLevel="h1"
        />
        {children}
      </div>
    </section>
  );
}
