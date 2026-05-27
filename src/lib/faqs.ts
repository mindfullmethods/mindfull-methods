export type FaqItem = {
  question: string;
  answer: string;
};

export const faqs: FaqItem[] = [
  {
    question: "Are these courses self-paced?",
    answer:
      "They’re designed as cohort-based mentorship tracks. You’ll learn on a schedule with mentor touchpoints, feedback windows, and milestone guidance.",
  },
  {
    question: "What makes your mentorship different?",
    answer:
      "Mentors don’t just review code—they coach decision-making. You’ll get feedback tied to your goals, plus reusable patterns you can apply to future projects.",
  },
  {
    question: "Do I get support if I get stuck?",
    answer:
      "Yes. Each milestone includes structured guidance and mentor sessions. You’ll also learn how to unblock yourself with practical debugging and planning habits.",
  },
  {
    question: "Can I switch tracks later?",
    answer:
      "In many cases, yes. If a track has openings, mentors can recommend the best next step based on your progress.",
  },
  {
    question: "How do I apply?",
    answer:
      "Use the “Book Free Call” button on the site. Share your goals and we’ll guide you to the most suitable course track.",
  },
];

export function getFaqs() {
  return faqs;
}

