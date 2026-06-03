export type Testimonial = {
  quote: string;
  name: string;
  role?: string;
  rating?: number;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "Prompt structure finally clicked. My capstone playbook is something I reuse at work every week.",
    name: "Aarav S.",
    role: "Prompt Engineering",
    rating: 5,
  },
  {
    quote:
      "RAG week was the turning point—I built a doc Q&A demo I could actually show in interviews.",
    name: "Meera K.",
    role: "Generative AI & LLMs",
    rating: 5,
  },
  {
    quote:
      "Agent traces and tool boundaries made our internal pilot safe enough to ship to the team.",
    name: "Jordan P.",
    role: "AI Agents cohort",
    rating: 5,
  },
  {
    quote:
      "I automated lead routing with n8n + an LLM step. Mentor review caught edge cases I would have missed.",
    name: "Samira R.",
    role: "AI Automation",
    rating: 5,
  },
];

export function getTestimonials() {
  return testimonials;
}
