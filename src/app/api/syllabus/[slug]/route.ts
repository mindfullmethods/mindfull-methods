import { getCourseBySlug } from "@/lib/courses";
import { buildSyllabusPlainText } from "@/lib/syllabus-document";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);

  if (!course) {
    return new Response("Course not found.", { status: 404 });
  }

  const body = buildSyllabusPlainText(course);
  const filename = `${course.slug}-syllabus.txt`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "public, max-age=86400",
    },
  });
}
