import type { Metadata } from "next";

import HomePageContent from "@/components/marketing/HomePageContent";
import { marketingPageMetadata } from "@/lib/seo";

export const metadata: Metadata = marketingPageMetadata({
  path: "/",
  description:
    "Learn with structured mentorship courses from Mindfull Methods. Build portfolio-ready skills with weekly guidance and practical projects.",
});

export default function HomePage() {
  return <HomePageContent />;
}
