import fs from "fs";
import path from "path";

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

import { getCourses } from "@/lib/courses";
import { buildSyllabusLines, toPdfSafeText } from "@/lib/syllabus-document";

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 50;
const LINE_HEIGHT = 14;
const TITLE_SIZE = 18;
const HEADING_SIZE = 12;
const BODY_SIZE = 11;

function wrapLine(text: string, font: Awaited<ReturnType<PDFDocument["embedFont"]>>, size: number, maxWidth: number) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(next, size) <= maxWidth) {
      current = next;
      continue;
    }
    if (current) lines.push(current);
    current = word;
  }
  if (current) lines.push(current);
  return lines.length ? lines : [""];
}

async function buildPdf(course: ReturnType<typeof getCourses>[number]) {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  let page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT - MARGIN;
  const maxWidth = PAGE_WIDTH - MARGIN * 2;

  function ensureSpace(linesNeeded = 1) {
    if (y - linesNeeded * LINE_HEIGHT < MARGIN) {
      page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      y = PAGE_HEIGHT - MARGIN;
    }
  }

  function drawLine(text: string, { bold = false, size = BODY_SIZE, gap = LINE_HEIGHT } = {}) {
    const activeFont = bold ? fontBold : font;
    const safe = toPdfSafeText(text);
    const wrapped = wrapLine(safe, activeFont, size, maxWidth);
    for (const line of wrapped) {
      ensureSpace();
      page.drawText(line, {
        x: MARGIN,
        y: y - size,
        size,
        font: activeFont,
        color: rgb(0.12, 0.12, 0.14),
      });
      y -= gap;
    }
  }

  drawLine(course.title, { bold: true, size: TITLE_SIZE, gap: 22 });
  drawLine("Course syllabus · Mindfull Methods", { size: 10, gap: 18 });
  drawLine(`Level: ${course.level}  ·  Duration: ${course.duration}  ·  Format: ${course.mode}`, {
    size: 10,
    gap: 16,
  });
  drawLine(`Pricing: ${course.priceLabel}`, { size: 10, gap: 20 });

  const overviewIdx = buildSyllabusLines(course).findIndex((line) => line === "Overview");
  const bodyLines = overviewIdx >= 0 ? buildSyllabusLines(course).slice(overviewIdx) : [];

  for (const line of bodyLines) {
    if (!line.trim()) {
      y -= 6;
      continue;
    }
    const isHeading =
      line === "Overview" ||
      line === "What you'll learn" ||
      line === "Weekly milestones" ||
      line === "Questions?" ||
      line.startsWith("Week ");
    drawLine(line, { bold: isHeading, size: isHeading ? HEADING_SIZE : BODY_SIZE, gap: isHeading ? 16 : LINE_HEIGHT });
  }

  return pdf.save();
}

async function main() {
  const outDir = path.join(process.cwd(), "public", "syllabi");
  fs.mkdirSync(outDir, { recursive: true });

  const courses = getCourses();
  for (const course of courses) {
    const bytes = await buildPdf(course);
    const outPath = path.join(outDir, `${course.slug}.pdf`);
    fs.writeFileSync(outPath, bytes);
    console.log(`Wrote ${outPath}`);
  }

  console.log(`Generated ${courses.length} syllabus PDFs.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
