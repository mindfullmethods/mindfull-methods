import type { Course } from "@/lib/courses";
import { siteConfig } from "@/lib/site";

export function buildSyllabusLines(course: Course) {
  const siteHost = siteConfig.url.replace(/^https?:\/\//, "");

  return [
    `${course.title} — Syllabus`,
    `${siteConfig.name} · ${siteHost}`,
    "",
    `Level: ${course.level}`,
    `Duration: ${course.duration}`,
    `Format: ${course.mode}`,
    `Pricing: ${course.priceLabel}`,
    "",
    "Overview",
    course.longDescription,
    "",
    "What you'll learn",
    ...course.learnOutcomes.map((o) => `• ${o}`),
    "",
    "Weekly milestones",
    ...course.curriculum.flatMap((item) => [
      item.week,
      ...item.topics.map((t) => `  • ${t}`),
      "",
    ]),
    "Questions?",
    `Email ${siteConfig.supportEmail} or visit ${siteConfig.url}/contact`,
  ];
}

export function buildSyllabusPlainText(course: Course) {
  return buildSyllabusLines(course).join("\n");
}

/** WinAnsi-safe text for PDF generation (Helvetica subset). */
export function toPdfSafeText(text: string) {
  return text
    .replace(/₹/g, "INR ")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[^\x00-\xFF]/g, "?");
}
