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
      "Create a free account or use the “Book Free Call” button on the site. Share your goals and we’ll guide you to the most suitable course track.",
  },
  {
    question: "What is the time commitment per week?",
    answer:
      "Most tracks expect 8–12 hours weekly including live mentor sessions, project work, and milestone submissions. Schedules are shared at cohort start.",
  },
  {
    question: "Do I receive a certificate?",
    answer:
      "Yes. Completing all milestones and your capstone project earns a Mindfull Methods certificate you can share on LinkedIn and your portfolio.",
  },
  {
    question: "Is there career or internship support?",
    answer:
      "Students get guidance on portfolio presentation, interview prep, and access to internship listings through the dashboard after enrollment.",
  },
];

export function getFaqs() {
  return faqs;
}

