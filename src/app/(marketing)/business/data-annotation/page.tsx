import type { Metadata } from "next";

import DataAnnotationPageContent from "@/components/marketing/DataAnnotationPageContent";
import HomeLandingWrapper from "@/components/marketing/home/HomeLandingWrapper";
import { marketingPageMetadata } from "@/lib/seo";

export const metadata: Metadata = marketingPageMetadata({
  path: "/business/data-annotation",
  description:
    "High-quality egocentric video data and robotics-grade annotation for physical AI, robotics, and imitation learning—captured at scale and delivered model-ready.",
});

export default function DataAnnotationPage() {
  return (
    <HomeLandingWrapper>
      <DataAnnotationPageContent />
    </HomeLandingWrapper>
  );
}
