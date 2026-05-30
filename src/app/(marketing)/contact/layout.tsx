import type { Metadata } from "next";

import { marketingPageMetadata } from "@/lib/seo";

export const metadata: Metadata = marketingPageMetadata({
  path: "/contact",
  title: "Contact",
  description:
    "Get in touch with Mindfull Methods mentors. Book a free call or send your goals — we'll recommend the right course track.",
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
