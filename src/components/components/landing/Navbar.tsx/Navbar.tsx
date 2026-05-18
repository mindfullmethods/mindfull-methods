import { Button } from "@/components/ui/button";
import Container from "@/components/ui/Container";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
      <Container className="flex items-center justify-between py-4">
        <h1 className="text-2xl font-bold tracking-tight">
          Unified Clone
        </h1>

        <div className="hidden items-center gap-8 md:flex">
          <a href="#" className="text-sm font-medium hover:text-gray-500">
            Home
          </a>

          <a href="#" className="text-sm font-medium hover:text-gray-500">
            Internships
          </a>

          <a href="#" className="text-sm font-medium hover:text-gray-500">
            About
          </a>

          <a href="#" className="text-sm font-medium hover:text-gray-500">
            Contact
          </a>
        </div>

        <Button>
          Get Started
        </Button>
      </Container>
    </nav>
  );
}