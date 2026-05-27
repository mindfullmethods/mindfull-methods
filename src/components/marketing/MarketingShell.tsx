import Footer from "@/components/marketing/Footer";
import Navbar from "@/components/marketing/Navbar";

export default function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
