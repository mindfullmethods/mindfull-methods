import LmsCourseCard from "@/components/lms/LmsCourseCard";
import LmsSchemaBanner from "@/components/lms/LmsSchemaBanner";
import { isLmsSchemaReady } from "@/lib/lms/schema";
import { getLmsCourses } from "@/Services/lms";

export default async function LmsCoursesPage() {
  const [courses, schemaReady] = await Promise.all([getLmsCourses(), isLmsSchemaReady()]);

  return (
    <>
      {!schemaReady ? <LmsSchemaBanner /> : null}
      <div className="grid gap-6 sm:grid-cols-2">
        {courses.map((course) => (
          <LmsCourseCard key={course.slug} course={course} />
        ))}
      </div>
    </>
  );
}
