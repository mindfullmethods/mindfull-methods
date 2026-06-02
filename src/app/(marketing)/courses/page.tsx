import CoursesCatalog from "@/components/marketing/CoursesCatalog";
import { getCoursesWithOverrides } from "@/lib/platform-content";

export default async function CoursesPage() {
  const courses = await getCoursesWithOverrides();
  return <CoursesCatalog courses={courses} />;
}
