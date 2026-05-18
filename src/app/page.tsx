import Footer from "@/components/components/landing/Footer.tsx/Footer";
import Hero from "@/components/components/landing/Hero.tsx/Hero";
import Internships from "@/components/components/landing/Internships";
import Navbar from "@/components/components/landing/Navbar.tsx/Navbar";
import Stats from "@/components/components/landing/Stats";
import Companies from "@/components/components/landing/Companies";
import Testimonials from "@/components/components/landing/Testimonials";
import FAQ from "@/components/components/landing/FAQ";
import CTA from "@/components/components/landing/CTA";


export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-black transition-colors dark:bg-black dark:text-white">
      <Navbar />
      <Hero />
      <Companies />
      <Stats />
      <Internships />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}