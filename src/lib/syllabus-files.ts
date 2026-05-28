import fs from "fs";
import path from "path";

export function syllabusPdfPath(courseSlug: string) {
  return path.join(process.cwd(), "public", "syllabi", `${courseSlug}.pdf`);
}

export function hasSyllabusPdf(courseSlug: string) {
  try {
    return fs.existsSync(syllabusPdfPath(courseSlug));
  } catch {
    return false;
  }
}

export function syllabusPdfPublicUrl(courseSlug: string) {
  return `/syllabi/${encodeURIComponent(courseSlug)}.pdf`;
}
