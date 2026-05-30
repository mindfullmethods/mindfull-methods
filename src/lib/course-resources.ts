export type CourseResource = {
  title: string;
  url: string;
  type: "video" | "doc" | "link";
};

export function getWeekResources(courseSlug: string, weekIndex: number, weekLabel: string): CourseResource[] {
  const syllabus = `/courses/${courseSlug}/syllabus`;
  const contact = `/contact?course=${encodeURIComponent(courseSlug)}`;

  const base: CourseResource[] = [
    { title: `${weekLabel} — syllabus & milestones`, url: syllabus, type: "doc" },
    { title: "Book a mentor check-in", url: contact, type: "link" },
  ];

  const extras: Record<string, CourseResource[]> = {
    "frontend-engineering": [
      { title: "React docs — Quick start", url: "https://react.dev/learn", type: "doc" },
      { title: "Next.js App Router", url: "https://nextjs.org/docs/app", type: "doc" },
    ],
    "product-design": [
      { title: "Figma Learn", url: "https://www.figma.com/resource-library/", type: "doc" },
    ],
    "data-analytics": [
      { title: "SQL basics (MDN)", url: "https://developer.mozilla.org/en-US/docs/Glossary/SQL", type: "doc" },
    ],
  };

  const courseExtras = extras[courseSlug] ?? [];
  if (weekIndex === 0) return [...base, ...courseExtras.slice(0, 1)];
  if (weekIndex === courseExtras.length) return [...base, ...courseExtras.slice(1, 2)];
  return base;
}
