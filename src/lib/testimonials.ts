export type Testimonial = {
  quote: string;
  name: string;
  role?: string;
  rating?: number;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "The mentor feedback was the difference. I stopped guessing and started building with confidence.",
    name: "Aarav S.",
    role: "Frontend track student",
    rating: 5,
  },
  {
    quote:
      "The curriculum felt structured but not rigid. I always knew what to do next—and why it mattered.",
    name: "Meera K.",
    role: "Product design learner",
    rating: 5,
  },
  {
    quote:
      "My final dashboard and presentation were exactly what my internship team needed. Clear, practical, and polished.",
    name: "Jordan P.",
    role: "Analytics cohort",
    rating: 5,
  },
  {
    quote:
      "I enjoyed the weekly rhythm. Submitting work early helped me improve faster than I expected.",
    name: "Samira R.",
    role: "Mentorship program participant",
    rating: 5,
  },
];

export function getTestimonials() {
  return testimonials;
}

