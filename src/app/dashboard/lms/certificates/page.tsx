import Link from "next/link";
import { Award } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { certificateVerifyPath, formatCertificateDate } from "@/lib/certificates";
import { getSessionUser } from "@/lib/auth";

export default async function LmsCertificatesPage() {
  const user = await getSessionUser();
  const supabase = await createClient();

  let certificates: {
    id: string;
    course_slug: string;
    course_title: string;
    student_name: string;
    issued_at: string;
  }[] = [];

  if (user) {
    const { data } = await supabase
      .from("course_certificates")
      .select("id, course_slug, course_title, student_name, issued_at")
      .eq("user_id", user.id)
      .order("issued_at", { ascending: false });

    certificates = data ?? [];
  }

  return (
    <div className="space-y-6">
      {certificates.length === 0 ? (
        <article className="lms-card">
          <p className="flex items-center gap-2 font-bold text-zinc-900 dark:text-white">
            <Award size={18} />
            No certificates yet
          </p>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Complete weekly milestones and pass mentor review on{" "}
            <Link href="/dashboard/my-courses" className="font-bold text-emerald-600 hover:underline">
              My courses
            </Link>
            .
          </p>
        </article>
      ) : (
        certificates.map((certificate) => (
          <article key={certificate.id} className="lms-card">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">Certificate of completion</p>
            <h2 className="mt-2 text-xl font-black text-zinc-900 dark:text-white">{certificate.course_title}</h2>
            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
              Issued to <strong>{certificate.student_name}</strong> on{" "}
              {formatCertificateDate(certificate.issued_at)}.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="text-sm">
                <p>
                  <strong>Certificate ID:</strong> {certificate.id}
                </p>
                <p className="mt-2">
                  <strong>Verification:</strong>{" "}
                  <Link href={certificateVerifyPath(certificate.id)} className="text-emerald-600 hover:underline">
                    {certificateVerifyPath(certificate.id)}
                  </Link>
                </p>
              </div>
              <div className="flex min-h-[120px] items-center justify-center rounded-xl border border-dashed border-zinc-300 text-sm font-bold text-zinc-400 dark:border-white/15">
                QR on PDF download
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href={`/dashboard/my-courses/${certificate.course_slug}/certificate`}
                className="lms-ghost text-sm"
              >
                Open in dashboard
              </Link>
              <Link href={certificateVerifyPath(certificate.id)} className="lms-primary text-sm">
                Verify certificate
              </Link>
            </div>
          </article>
        ))
      )}
    </div>
  );
}
