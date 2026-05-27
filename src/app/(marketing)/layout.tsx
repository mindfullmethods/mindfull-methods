import Footer from "@/components/marketing/Footer";
import Navbar from "@/components/marketing/Navbar";
import type { ReactNode } from "react";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      <main className="pt-0">{children}</main>
      <Footer />
    </div>
  );
}

