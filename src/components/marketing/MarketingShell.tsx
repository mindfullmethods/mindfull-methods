import Footer from "@/components/marketing/Footer";
import Navbar from "@/components/marketing/Navbar";

export default function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mm-marketing-ambient min-h-screen bg-[#f7f8f5] text-zinc-950 transition-colors dark:bg-zinc-950 dark:text-white">
      <Navbar />
      <main className="relative z-[1]">{children}</main>
      <Footer />
    </div>
  );
}
