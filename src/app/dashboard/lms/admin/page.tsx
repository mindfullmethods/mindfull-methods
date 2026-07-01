import { redirect } from "next/navigation";

import { getSessionUser, isAdminUser } from "@/lib/auth";
import { getLmsCourses } from "@/Services/lms";

function formatInr(value: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(
    value
  );
}

export default async function LmsAdminPage() {
  const user = await getSessionUser();
  if (!isAdminUser(user)) redirect("/dashboard/lms");

  const courses = await getLmsCourses();
  const totalListPrice = courses.reduce((sum, c) => sum + c.priceInr, 0);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Catalog courses", String(courses.length), "AI programs in LMS"],
          ["List price sum", formatInr(totalListPrice), "Marketing reference"],
          ["Enrollments", "See platform", "Razorpay enrollments table"],
          ["Completion", "Mentor review", "Certificates + progress"],
        ].map(([label, value, detail]) => (
          <article key={label as string} className="lms-metric">
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">{label}</span>
            <strong className="mt-2 block text-xl font-black text-zinc-900 dark:text-white">{value}</strong>
            <small className="text-xs text-zinc-500">{detail}</small>
          </article>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <article className="lms-card">
          <h2 className="text-lg font-black text-zinc-900 dark:text-white">Course management</h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Edit marketing copy and pricing in Content studio. LMS rows sync from{" "}
            <code className="rounded bg-zinc-100 px-1 dark:bg-white/10">lms_courses</code> after migration #15.
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {courses.map((course) => (
              <li key={course.slug} className="flex justify-between gap-2 rounded-lg border border-zinc-200 px-3 py-2 dark:border-white/10">
                <span className="font-semibold">{course.title}</span>
                <span className="lms-badge">{formatInr(course.priceInr)}</span>
              </li>
            ))}
          </ul>
        </article>
        <article className="lms-card">
          <h2 className="text-lg font-black text-zinc-900 dark:text-white">Student management</h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Use the main admin Students and Enrollments views for live data, refunds, and complimentary grants.
          </p>
          <a href="/dashboard/users" className="lms-primary mt-4 inline-block text-sm">
            Open students
          </a>
          <a href="/dashboard/enrollments" className="lms-ghost mt-3 ml-2 inline-block text-sm">
            Enrollments
          </a>
        </article>
      </div>
    </>
  );
}
