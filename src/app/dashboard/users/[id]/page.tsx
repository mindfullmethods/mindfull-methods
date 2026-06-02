import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Award,
  BookOpen,
  BriefcaseBusiness,
  ClipboardList,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import AdminStudentCompletionReview from "@/components/components/dashboard/AdminStudentCompletionReview";
import AdminStudentEnrollmentActions from "@/components/components/dashboard/AdminStudentEnrollmentActions";
import { getAdminUserDetail } from "@/Services/admin-user-detail";
import { isCompletionVerificationTableReady } from "@/Services/completion-verifications";
import { requireAdmin } from "@/lib/auth";
import { getCourseBySlug } from "@/lib/courses";
import { isCourseProgressTableReady } from "@/lib/course-progress-schema";
import { formatAmount } from "@/lib/format-currency";

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function statusClass(status?: string | null) {
  if (status === "Approved") return "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300";
  if (status === "Rejected") return "bg-red-50 text-red-700 dark:bg-red-400/10 dark:text-red-300";
  if (status === "Withdrawn") return "bg-zinc-100 text-zinc-600 dark:bg-white/10 dark:text-zinc-400";
  return "bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300";
}

export default async function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const student = await getAdminUserDetail(id);

  if (!student) notFound();

  const progressReady = await isCourseProgressTableReady();
  const completionReviewReady = await isCompletionVerificationTableReady();
  const pendingReviews = completionReviewReady
    ? student.completionVerifications
        .filter((v) => v.status === "pending")
        .map((v) => ({
          courseSlug: v.course_slug,
          courseTitle: getCourseBySlug(v.course_slug)?.title ?? v.course_slug,
          requestedAt: v.requested_at,
        }))
    : [];
  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const isAdmin =
    student.role === "admin" ||
    (student.email ? adminEmails.includes(student.email.toLowerCase()) : false);

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 xl:px-10">
      <Link
        href="/dashboard/users"
        className="inline-flex items-center gap-2 text-sm font-black text-zinc-500 hover:text-zinc-950 dark:hover:text-white"
      >
        <ArrowLeft size={16} />
        Back to students
      </Link>

      <section className="mt-6 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-zinc-500">
              <UserRound size={14} />
              Student profile
            </p>
            <h1 className="mt-3 text-3xl font-black sm:text-4xl">{student.full_name ?? "Unnamed student"}</h1>
            <p className="mt-2 flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <Mail size={14} />
              {student.email ?? "No email"}
            </p>
            <p className="mt-1 text-xs font-bold text-zinc-500">Joined {formatDate(student.created_at)}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <span
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-black ${
                isAdmin
                  ? "bg-violet-600 text-white"
                  : "border border-zinc-200 bg-white dark:border-white/10 dark:bg-white/5"
              }`}
            >
              {isAdmin ? <ShieldCheck size={16} /> : <UserRound size={16} />}
              {isAdmin ? "Admin" : "Student"}
            </span>
            <div className="rounded-xl bg-zinc-950 px-4 py-2 text-white dark:bg-white dark:text-zinc-950">
              <p className="text-xs font-black uppercase tracking-[0.18em] opacity-60">Enrollments</p>
              <p className="text-xl font-black">{student.enrollments.length}</p>
            </div>
            <div className="rounded-xl bg-violet-600 px-4 py-2 text-white">
              <p className="text-xs font-black uppercase tracking-[0.18em] opacity-80">Applications</p>
              <p className="text-xl font-black">{student.applications.length}</p>
            </div>
          </div>
        </div>
      </section>

      <AdminStudentCompletionReview userId={student.id} reviews={pendingReviews} />

      <section className="mt-8">
        <div className="mb-4 flex items-center gap-2">
          <BookOpen size={18} className="text-violet-600" />
          <h2 className="text-xl font-black">Course enrollments</h2>
        </div>
        {student.enrollments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 p-8 text-center text-sm font-semibold text-zinc-500 dark:border-white/10">
            No paid enrollments yet.
          </div>
        ) : (
          <div className="grid gap-4">
            {student.enrollments.map((enrollment) => {
              const percent = enrollment.progress?.percent ?? 0;

              return (
                <article
                  key={enrollment.id}
                  className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-6"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="font-black">{enrollment.course_title}</p>
                      <p className="mt-1 text-sm text-zinc-500">
                        {formatAmount(enrollment.amount_paise, enrollment.currency)} · Paid{" "}
                        {formatDate(enrollment.created_at)} ·{" "}
                        <span
                          className={
                            enrollment.status === "paid"
                              ? "text-emerald-600"
                              : "text-red-600"
                          }
                        >
                          {enrollment.status}
                        </span>
                      </p>
                      {progressReady ? (
                        <div className="mt-3 max-w-xs">
                          <div className="flex justify-between text-xs font-bold text-zinc-500">
                            <span>Progress</span>
                            <span>{percent}%</span>
                          </div>
                          <div className="mt-1 h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-teal-400"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      ) : null}
                    </div>
                    {progressReady ? (
                      <AdminStudentEnrollmentActions
                        enrollmentId={enrollment.id}
                        status={enrollment.status}
                        percent={percent}
                      />
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="mt-8">
        <div className="mb-4 flex items-center gap-2">
          <Award size={18} className="text-emerald-600" />
          <h2 className="text-xl font-black">Certificates</h2>
        </div>
        {student.certificates.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 p-8 text-center text-sm font-semibold text-zinc-500 dark:border-white/10">
            No certificates issued yet.
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {student.certificates.map((cert) => (
              <Link
                key={cert.id}
                href={`/certificates/verify/${cert.id}`}
                className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 transition hover:border-emerald-300 dark:border-emerald-400/20 dark:bg-emerald-400/10"
              >
                <p className="font-black text-emerald-900 dark:text-emerald-200">{cert.course_title}</p>
                <p className="mt-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">{cert.id}</p>
                <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
                  Issued {formatDate(cert.issued_at)}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="mt-8">
        <div className="mb-4 flex items-center gap-2">
          <BriefcaseBusiness size={18} className="text-zinc-600" />
          <h2 className="text-xl font-black">Internship applications</h2>
        </div>
        {student.applications.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 p-8 text-center text-sm font-semibold text-zinc-500 dark:border-white/10">
            No applications submitted.
          </div>
        ) : (
          <div className="grid gap-3">
            {student.applications.map((app) => (
              <div
                key={app.id}
                className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-white/10 dark:bg-white/5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-black">{app.internship?.title ?? "Internship"}</p>
                  <p className="mt-1 text-sm text-zinc-500">
                    {app.internship?.company ?? "—"} · Applied {formatDate(app.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-3 py-1.5 text-xs font-black ${statusClass(app.status)}`}>
                    {app.status ?? "Pending"}
                  </span>
                  <Link
                    href="/dashboard/applications"
                    className="text-xs font-black text-violet-600 hover:underline dark:text-violet-300"
                  >
                    <ClipboardList size={14} className="inline" /> Review
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
