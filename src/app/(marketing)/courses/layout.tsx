import type { Metadata } from "next";

import { marketingPageMetadata } from "@/lib/seo";

export const metadata: Metadata = marketingPageMetadata({
  path: "/courses",
  title: "Courses",
  description:
    "Browse Mindfull Methods AI mentorship tracks — Generative AI, agents, prompt engineering, and automation. Find your next cohort.",
});

export default function CoursesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
