import Footer from "@/components/components/landing/Footer.tsx/Footer";
import Hero from "@/components/components/landing/Hero.tsx/Hero";
import Navbar from "@/components/components/landing/Navbar.tsx/Navbar";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Footer />
    </main>
  );
}