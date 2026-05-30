import type { Metadata } from "next";

import { marketingPageMetadata } from "@/lib/seo";

export const metadata: Metadata = marketingPageMetadata({
  path: "/courses",
  title: "Courses",
  description:
    "Browse Mindfull Methods mentorship tracks — frontend, design, analytics, full stack, and more. Filter by format and find your next program.",
});

export default function CoursesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
