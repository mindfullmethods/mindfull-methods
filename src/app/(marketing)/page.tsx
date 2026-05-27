import type { Metadata } from "next";

import HomePageContent from "@/components/marketing/HomePageContent";

export const metadata: Metadata = {
  description:
    "Learn with structured mentorship courses from Mindfull Methods. Build portfolio-ready skills with weekly guidance and practical projects.",
  openGraph: {
    description:
      "Learn with structured mentorship courses from Mindfull Methods. Build portfolio-ready skills with weekly guidance and practical projects.",
  },
};

export default function HomePage() {
  return <HomePageContent />;
}
