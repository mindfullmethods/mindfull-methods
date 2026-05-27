import type { Metadata } from "next";

import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Mindfull Methods mentors. Book a free call or send your goals — we'll recommend the right course track.",
  openGraph: {
    title: "Contact | Mindfull Methods",
    description: siteConfig.description,
    url: `${siteConfig.url}/contact`,
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
