import Link from "next/link";

import { getLmsCourses } from "@/Services/lms";

export default async function LmsLearnIndexPage() {
  const courses = await getLmsCourses();
  const enrolled = courses.filter((c) => c.enrolled);

  return (
    <article className="lms-card">
      <h2 className="text-lg font-black text-zinc-900 dark:text-white">Choose a course</h2>
      <ul className="mt-4 space-y-3">
        {(enrolled.length ? enrolled : courses).map((course) => (
          <li key={course.slug}>
            <Link
              href={`/dashboard/lms/learn/${course.slug}`}
              className="flex items-center justify-between rounded-xl border border-zinc-200 px-4 py-3 text-sm font-semibold transition hover:border-emerald-400 dark:border-white/10"
            >
              <span>{course.title}</span>
              <span className="lms-badge">{course.progressPercent}%</span>
            </Link>
          </li>
        ))}
      </ul>
    </article>
  );
}
