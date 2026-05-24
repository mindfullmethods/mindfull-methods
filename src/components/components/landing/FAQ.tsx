import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How do internships work?",
    answer:
      "Students enroll in internship programs, complete real-world projects, and receive mentorship throughout the learning journey.",
  },
  {
    question: "Will I receive a certificate?",
    answer:
      "Yes, every student receives a verified certificate after successful completion of the internship.",
  },
  {
    question: "Are the internships beginner friendly?",
    answer:
      "Absolutely. Programs are designed for beginners as well as intermediate learners.",
  },
  {
    question: "Do internships include projects?",
    answer:
      "Yes, all programs include practical real-world projects to help students build portfolios.",
  },
];

export default function FAQ() {
  return (
    <section className="bg-white dark:bg-black py-28">
      <div className="mx-auto max-w-4xl px-6">
        
        {/* Header */}
        <div className="text-center">
          <span className="rounded-full border border-black/10 bg-gray-50 px-4 py-2 text-sm font-medium shadow-sm dark:border-white/10 dark:bg-zinc-900 dark:text-white">
            FAQ
          </span>

          <h2 className="mt-6 text-4xl font-black tracking-tight text-zinc-900 dark:text-white md:text-6xl">
            Frequently Asked Questions
          </h2>

          <p className="mt-6 text-lg text-gray-600 dark:text-zinc-400">
            Everything you need to know about our internship programs.
          </p>
        </div>

        {/* Accordion */}
        <div className="mt-16 rounded-3xl border border-black/5 bg-white p-4 shadow-lg dark:border-white/10 dark:bg-zinc-900">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
              >
                <AccordionTrigger className="text-left text-lg font-semibold text-zinc-900 dark:text-white">
                  {faq.question}
                </AccordionTrigger>

                <AccordionContent className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}