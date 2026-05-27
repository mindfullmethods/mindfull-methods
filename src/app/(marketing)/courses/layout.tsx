import type { Metadata } from "next";

import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Courses",
  description:
    "Browse Mindfull Methods mentorship tracks — frontend, design, analytics, full stack, and more. Filter by format and find your next program.",
  openGraph: {
    title: "Courses | Mindfull Methods",
    description: siteConfig.description,
    url: `${siteConfig.url}/courses`,
  },
};

export default function CoursesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
