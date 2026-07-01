import type { Metadata } from "next";

import BusinessPageContent from "@/components/marketing/BusinessPageContent";
import HomeLandingWrapper from "@/components/marketing/home/HomeLandingWrapper";
import { marketingPageMetadata } from "@/lib/seo";

export const metadata: Metadata = marketingPageMetadata({
  path: "/business",
  description:
    "Mindfull Methods for Business — mentor-led AI training for teams. Custom curriculum, weekly milestones, and verifiable certificates for prompt engineering, generative AI, agents, and automation.",
});

export default function BusinessPage() {
  return (
    <HomeLandingWrapper>
      <BusinessPageContent />
    </HomeLandingWrapper>
  );
}
