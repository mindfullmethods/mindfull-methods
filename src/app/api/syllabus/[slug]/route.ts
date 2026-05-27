import { getCourseBySlug } from "@/lib/courses";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);

  if (!course) {
    return new Response("Course not found.", { status: 404 });
  }

  const lines = [
    `${course.title} — Syllabus`,
    "Mindfull Methods · mindfull-methods.vercel.app",
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
    `Email ${process.env.CONTACT_TO_EMAIL ?? "support@mindfullmethods.com"} or visit /contact`,
  ];

  const body = lines.join("\n");
  const filename = `${course.slug}-syllabus.txt`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "public, max-age=86400",
    },
  });
}
