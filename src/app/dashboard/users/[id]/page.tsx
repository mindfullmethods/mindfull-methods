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
import DashboardPageHeader from "@/components/components/dashboard/DashboardPageHeader";
import SectionHeader from "@/components/marketing/SectionHeader";
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
        className="inline-flex items-center gap-2 text-sm font-semibold mm-subtle transition hover:text-zinc-950 dark:hover:text-white"
      >
        <ArrowLeft size={16} />
        Back to students
      </Link>

      <div className="mt-6">
        <DashboardPageHeader
          eyebrow="Student profile"
          title={student.full_name ?? "Unnamed student"}
          description={student.email ?? "No email on file"}
        >
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold ${
                isAdmin
                  ? "bg-violet-600 text-white"
                  : "border mm-border bg-zinc-50/80 dark:bg-white/[0.02]"
              }`}
            >
              {isAdmin ? <ShieldCheck size={16} /> : <UserRound size={16} />}
              {isAdmin ? "Admin" : "Student"}
            </span>
            <div className="rounded-xl bg-zinc-950 px-4 py-2 text-white dark:bg-white dark:text-zinc-950">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-60">Enrollments</p>
              <p className="text-xl font-bold">{student.enrollments.length}</p>
            </div>
            <div className="rounded-xl bg-violet-600 px-4 py-2 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-80">Applications</p>
              <p className="text-xl font-bold">{student.applications.length}</p>
            </div>
            <p className="text-xs font-semibold mm-subtle">
              <Mail size={12} className="mr-1 inline" />
              Joined {formatDate(student.created_at)}
            </p>
          </div>
        </DashboardPageHeader>
      </div>

      <AdminStudentCompletionReview userId={student.id} reviews={pendingReviews} />

      <section className="mt-8 mm-section-panel">
        <div className="relative flex items-center gap-2">
          <BookOpen size={18} className="text-violet-600" />
          <SectionHeader title="Course enrollments" />
        </div>
        {student.enrollments.length === 0 ? (
          <div className="relative mt-6 rounded-2xl border border-dashed mm-border p-8 text-center text-sm font-semibold mm-muted">
            No paid enrollments yet.
          </div>
        ) : (
          <div className="relative mt-6 grid gap-4">
            {student.enrollments.map((enrollment) => {
              const percent = enrollment.progress?.percent ?? 0;

              return (
                <article
                  key={enrollment.id}
                  className="rounded-2xl border mm-border bg-zinc-50/80 p-5 dark:bg-white/[0.02] sm:p-6"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="font-bold mm-heading">{enrollment.course_title}</p>
                      <p className="mt-1 text-sm mm-muted">
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
                          <div className="flex justify-between text-xs font-semibold mm-subtle">
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

      <section className="mt-8 mm-section-panel">
        <div className="relative flex items-center gap-2">
          <Award size={18} className="text-emerald-600" />
          <SectionHeader title="Certificates" />
        </div>
        {student.certificates.length === 0 ? (
          <div className="relative mt-6 rounded-2xl border border-dashed mm-border p-8 text-center text-sm font-semibold mm-muted">
            No certificates issued yet.
          </div>
        ) : (
          <div className="relative mt-6 grid gap-3 sm:grid-cols-2">
            {student.certificates.map((cert) => (
              <Link
                key={cert.id}
                href={`/certificates/verify/${cert.id}`}
                className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 transition hover:border-emerald-300 dark:border-emerald-400/20 dark:bg-emerald-400/10"
              >
                <p className="font-bold text-emerald-900 dark:text-emerald-200">{cert.course_title}</p>
                <p className="mt-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">{cert.id}</p>
                <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
                  Issued {formatDate(cert.issued_at)}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="mt-8 mm-section-panel">
        <div className="relative flex items-center gap-2">
          <BriefcaseBusiness size={18} className="mm-subtle" />
          <SectionHeader title="Internship applications" />
        </div>
        {student.applications.length === 0 ? (
          <div className="relative mt-6 rounded-2xl border border-dashed mm-border p-8 text-center text-sm font-semibold mm-muted">
            No applications submitted.
          </div>
        ) : (
          <div className="relative mt-6 grid gap-3">
            {student.applications.map((app) => (
              <div
                key={app.id}
                className="flex flex-col gap-3 rounded-2xl border mm-border bg-zinc-50/80 p-4 dark:bg-white/[0.02] sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-bold mm-heading">{app.internship?.title ?? "Internship"}</p>
                  <p className="mt-1 text-sm mm-muted">
                    {app.internship?.company ?? "—"} · Applied {formatDate(app.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${statusClass(app.status)}`}>
                    {app.status ?? "Pending"}
                  </span>
                  <Link
                    href="/dashboard/applications"
                    className="text-xs font-bold text-violet-600 hover:underline dark:text-violet-300"
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
