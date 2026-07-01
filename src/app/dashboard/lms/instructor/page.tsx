import { redirect } from "next/navigation";

import { getSessionUser } from "@/lib/auth";
import { canAccessLmsInstructor, lmsRoleFromUser } from "@/lib/lms/roles";
import { getLmsAssignments, getLmsCourses, getLmsProfileRole } from "@/Services/lms";

export default async function LmsInstructorPage() {
  const user = await getSessionUser();
  const profileRole = user ? await getLmsProfileRole(user.id) : null;
  const role = lmsRoleFromUser(user, profileRole);

  if (!canAccessLmsInstructor(role)) {
    redirect("/dashboard/lms");
  }

  const [courses, assignments] = await Promise.all([getLmsCourses(), getLmsAssignments()]);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["Assigned courses", "4", "All AI tracks"],
          ["Pending reviews", String(assignments.length), "Assignment submissions"],
          ["Avg learner score", "84%", "From quiz attempts"],
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
          <h2 className="text-lg font-black text-zinc-900 dark:text-white">Publish lesson</h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Add Bunny Stream embed URLs to lesson rows (or set env <code>BUNNY_STREAM_LIBRARY_ID</code>). Students see
            videos on the Learn page when enrolled.
          </p>
          <label className="mt-4 block text-sm font-semibold">
            Course
            <select className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2 dark:border-white/10 dark:bg-zinc-900">
              {courses.map((c) => (
                <option key={c.slug}>{c.title}</option>
              ))}
            </select>
          </label>
          <label className="mt-3 block text-sm font-semibold">
            Bunny Stream URL
            <input
              className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2 dark:border-white/10 dark:bg-zinc-900"
              placeholder="https://iframe.mediadelivery.net/embed/..."
              readOnly
            />
          </label>
          <p className="mt-3 text-xs text-zinc-500">Wire admin upload in a follow-up sprint; SQL schema is ready.</p>
        </article>
        <article className="lms-card">
          <h2 className="text-lg font-black text-zinc-900 dark:text-white">Review assignments</h2>
          <ul className="mt-4 space-y-3">
            {assignments.map((assignment) => (
              <li
                key={assignment.id}
                className="flex items-center justify-between gap-2 rounded-xl border border-zinc-200 px-3 py-3 dark:border-white/10"
              >
                <span className="text-sm">
                  {assignment.title}
                  <br />
                  <small className="text-zinc-500">{assignment.courseTitle}</small>
                </span>
                <span className="lms-badge">Grade</span>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </>
  );
}
