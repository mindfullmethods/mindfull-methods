"use client";

import * as React from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQAccordion({
  items,
}: {
  items: Array<{ question: string; answer: string }>;
}) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {items.map((item) => (
        <AccordionItem key={item.question} value={item.question}>
          <AccordionTrigger>{item.question}</AccordionTrigger>
          <AccordionContent className="text-zinc-600 dark:text-white/70">{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

