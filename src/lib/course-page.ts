import { redirect } from "next/navigation";

import { normalizeCourseSlug } from "@/lib/courses";
import { getResolvedCourseBySlug } from "@/lib/platform-content";

/** Resolve a course from a URL slug; redirect to canonical hyphenated slug when needed. */
export async function resolveCoursePageSlug(rawSlug: string, basePath: string) {
  const course = await getResolvedCourseBySlug(rawSlug);
  if (!course) return null;

  const normalized = normalizeCourseSlug(rawSlug);
  if (rawSlug !== course.slug || normalized !== rawSlug) {
    redirect(`${basePath}/${course.slug}`);
  }

  return course;
}
