import { notFound } from "next/navigation";

import LessonPlayer from "@/components/lms/LessonPlayer";
import LmsSchemaBanner from "@/components/lms/LmsSchemaBanner";
import { isLmsSchemaReady } from "@/lib/lms/schema";
import { getLmsCourseBySlug } from "@/Services/lms";

export default async function LmsLearnCoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [course, schemaReady] = await Promise.all([getLmsCourseBySlug(slug), isLmsSchemaReady()]);

  if (!course) notFound();

  return (
    <>
      {!schemaReady ? <LmsSchemaBanner /> : null}
      <LessonPlayer course={course} />
    </>
  );
}
