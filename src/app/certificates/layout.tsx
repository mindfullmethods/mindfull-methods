import MarketingShell from "@/components/marketing/MarketingShell";
import type { ReactNode } from "react";

export default function CertificatesLayout({ children }: { children: ReactNode }) {
  return <MarketingShell>{children}</MarketingShell>;
}
