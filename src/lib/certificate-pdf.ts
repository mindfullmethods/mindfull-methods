import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

import { toPdfSafeText } from "@/lib/syllabus-document";
import { siteConfig } from "@/lib/site";

const PAGE_WIDTH = 841.89;
const PAGE_HEIGHT = 595.28;

export async function buildCertificatePdf(params: {
  studentName: string;
  courseTitle: string;
  courseDuration: string;
  courseLevel: string;
  certificateId: string;
  issuedDate: string;
  verifyUrl: string;
}) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const violet = rgb(0.49, 0.23, 0.93);
  const dark = rgb(0.12, 0.12, 0.14);
  const muted = rgb(0.45, 0.45, 0.5);

  page.drawRectangle({
    x: 28,
    y: 28,
    width: PAGE_WIDTH - 56,
    height: PAGE_HEIGHT - 56,
    borderColor: violet,
    borderWidth: 3,
    color: rgb(0.98, 0.97, 1),
  });

  page.drawRectangle({
    x: 40,
    y: 40,
    width: PAGE_WIDTH - 80,
    height: PAGE_HEIGHT - 80,
    borderColor: rgb(0.85, 0.82, 0.95),
    borderWidth: 1,
  });

  const centerX = PAGE_WIDTH / 2;

  function drawCentered(text: string, y: number, size: number, bold = false, color = dark) {
    const activeFont = bold ? fontBold : font;
    const safe = toPdfSafeText(text);
    const width = activeFont.widthOfTextAtSize(safe, size);
    page.drawText(safe, { x: centerX - width / 2, y, size, font: activeFont, color });
  }

  drawCentered(siteConfig.name.toUpperCase(), PAGE_HEIGHT - 90, 11, true, violet);
  drawCentered("Certificate of Completion", PAGE_HEIGHT - 118, 22, true, dark);
  drawCentered("This certifies that", PAGE_HEIGHT - 168, 12, false, muted);
  drawCentered(params.studentName, PAGE_HEIGHT - 210, 28, true, dark);
  drawCentered("has successfully completed all milestones in", PAGE_HEIGHT - 248, 11, false, muted);
  drawCentered(params.courseTitle, PAGE_HEIGHT - 282, 18, true, violet);
  drawCentered(`${params.courseDuration} · ${params.courseLevel}`, PAGE_HEIGHT - 308, 10, false, muted);

  const footerY = 95;
  drawCentered(`Certificate ID: ${params.certificateId}`, footerY + 36, 10, true, dark);
  drawCentered(`Issued: ${params.issuedDate}`, footerY + 18, 10, false, muted);
  drawCentered(`Verify: ${params.verifyUrl}`, footerY, 9, false, violet);

  return pdf.save();
}
