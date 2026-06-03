"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Download, XCircle } from "lucide-react";

import { approveCompletionVerification, rejectCompletionVerification } from "@/actions/completionVerification";
import { formatCertificateId } from "@/lib/certificates";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function ReviewRow({
  userId,
  courseSlug,
  courseTitle,
  requestedAt,
}: {
  userId: string;
  courseSlug: string;
  courseTitle: string;
  requestedAt: string;
}) {
  const [message, setMessage] = useState("");
  const [approvedId, setApprovedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const previewCertId = formatCertificateId(userId, courseSlug);

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 dark:border-amber-400/20 dark:bg-amber-400/10 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-bold text-amber-950 dark:text-amber-100">{courseTitle}</p>
        <p className="mt-1 text-sm text-amber-800/80 dark:text-amber-200/80">
          Requested {formatDate(requestedAt)} · All milestones complete
        </p>
        {message ? <p className="mt-2 text-xs font-bold text-violet-600 dark:text-violet-300">{message}</p> : null}
        {approvedId ? (
          <a
            href={`/api/certificates/${encodeURIComponent(approvedId)}/pdf`}
            download
            className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline dark:text-emerald-300"
          >
            <Download size={12} />
            Preview certificate PDF
          </a>
        ) : (
          <p className="mt-2 text-xs font-semibold text-amber-800/70 dark:text-amber-200/70">
            Will issue ID: {previewCertId}
          </p>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              const result = await approveCompletionVerification(userId, courseSlug);
              if (result.ok) {
                setApprovedId(result.certificateId ?? previewCertId);
                setMessage("Approved — certificate issued.");
              } else {
                setMessage(result.error);
              }
            });
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
        >
          <CheckCircle2 size={14} />
          Approve
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              const result = await rejectCompletionVerification(userId, courseSlug);
              setMessage(result.ok ? "Rejected — student notified by email." : result.error);
              setApprovedId(null);
            });
          }}
          className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-bold text-red-600 disabled:opacity-60 dark:border-red-400/30 dark:text-red-300"
        >
          <XCircle size={14} />
          Reject
        </button>
      </div>
    </div>
  );
}

export default function AdminStudentCompletionReview({
  userId,
  reviews,
}: {
  userId: string;
  reviews: { courseSlug: string; courseTitle: string; requestedAt: string }[];
}) {
  if (reviews.length === 0) return null;

  return (
    <section className="mt-8 mm-section-panel">
      <div className="relative mb-4 flex items-center gap-2">
        <CheckCircle2 size={18} className="text-amber-600" />
        <h2 className="text-xl font-bold mm-heading">Certificate reviews</h2>
      </div>
      <p className="relative mb-4 text-sm mm-muted">
        Approve to issue the certificate and enable student PDF download. Reject sends feedback by email.
      </p>
      <div className="relative grid gap-3">
        {reviews.map((review) => (
          <ReviewRow
            key={review.courseSlug}
            userId={userId}
            courseSlug={review.courseSlug}
            courseTitle={review.courseTitle}
            requestedAt={review.requestedAt}
          />
        ))}
      </div>
    </section>
  );
}
