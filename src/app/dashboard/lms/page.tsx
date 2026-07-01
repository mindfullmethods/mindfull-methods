import Link from "next/link";

import LmsCourseCard from "@/components/lms/LmsCourseCard";
import LmsSchemaBanner from "@/components/lms/LmsSchemaBanner";
import { isLmsSchemaReady } from "@/lib/lms/schema";
import { getLmsCourses, getLmsDashboardStats } from "@/Services/lms";

export default async function LmsDashboardPage() {
  const [stats, courses, schemaReady] = await Promise.all([
    getLmsDashboardStats(),
    getLmsCourses(),
    isLmsSchemaReady(),
  ]);

  const enrolled = courses.filter((c) => c.enrolled);
  const continueCourse = enrolled.sort((a, b) => b.progressPercent - a.progressPercent)[0] ?? courses[0];

  return (
    <>
      {!schemaReady ? <LmsSchemaBanner /> : null}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Enrolled courses", stats.enrolledCount, "Across professional AI tracks"],
          ["Average progress", `${stats.averageProgress}%`, "Lesson completion in portal"],
          ["Certificates earned", stats.certificateCount, "Linked to verify page"],
          ["Upcoming assignments", stats.upcomingAssignments, "Due in assignment center"],
        ].map(([label, value, detail]) => (
          <article key={label as string} className="lms-metric">
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">{label}</span>
            <strong className="mt-2 block text-2xl font-black text-zinc-900 dark:text-white">{value}</strong>
            <small className="text-xs text-zinc-500">{detail}</small>
          </article>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <article className="lms-card">
          <h2 className="text-lg font-black text-zinc-900 dark:text-white">Continue learning</h2>
          <div className="mt-4">{continueCourse ? <LmsCourseCard course={continueCourse} /> : null}</div>
        </article>
        <article className="lms-card">
          <h2 className="text-lg font-black text-zinc-900 dark:text-white">Recent activity</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex justify-between gap-2">
              <span>Weekly milestones on classic dashboard</span>
              <Link href="/dashboard/my-courses" className="lms-badge hover:underline">
                Open
              </Link>
            </li>
            <li className="flex justify-between gap-2">
              <span>Quiz center with auto scoring</span>
              <Link href="/dashboard/lms/quizzes" className="lms-badge hover:underline">
                Practice
              </Link>
            </li>
            <li className="flex justify-between gap-2">
              <span>Certificate verification</span>
              <Link href="/dashboard/lms/certificates" className="lms-badge hover:underline">
                View
              </Link>
            </li>
          </ul>
        </article>
      </div>
    </>
  );
}
