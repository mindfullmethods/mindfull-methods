import Link from "next/link";
import { Award, CheckCircle2, XCircle } from "lucide-react";

import BrandWordmark from "@/components/marketing/BrandWordmark";
import { getCertificateById } from "@/Services/certificates";
import { formatCertificateDate } from "@/lib/certificates";
import { siteConfig } from "@/lib/site";

export default async function VerifyCertificatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const certificate = await getCertificateById(id.toUpperCase());

  return (
    <main className="min-h-screen bg-[#f7f8f5] px-5 py-16 dark:bg-zinc-950 sm:px-8">
      <div className="mx-auto max-w-xl">
        <div className="mb-8 text-center">
          <BrandWordmark size="sm" className="mx-auto" />
        </div>

        <article className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-white/5">
          {certificate ? (
            <>
              <p className="flex items-center justify-center gap-2 text-sm font-black text-emerald-600">
                <CheckCircle2 size={18} />
                Valid certificate
              </p>
              <h1 className="mt-4 text-center text-3xl font-black">{certificate.student_name}</h1>
              <p className="mt-3 text-center text-sm text-zinc-600 dark:text-zinc-400">
                Completed <strong>{certificate.course_title}</strong>
              </p>
              <dl className="mt-8 space-y-3 border-t border-zinc-200 pt-6 text-sm dark:border-white/10">
                <div className="flex justify-between gap-4">
                  <dt className="font-black text-zinc-500">Certificate ID</dt>
                  <dd className="font-bold">{certificate.id}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="font-black text-zinc-500">Issued</dt>
                  <dd className="font-bold">{formatCertificateDate(certificate.issued_at)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="font-black text-zinc-500">Issued by</dt>
                  <dd className="font-bold">{siteConfig.name}</dd>
                </div>
              </dl>
            </>
          ) : (
            <>
              <p className="flex items-center justify-center gap-2 text-sm font-black text-red-600">
                <XCircle size={18} />
                Certificate not found
              </p>
              <p className="mt-4 text-center text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                We could not verify this certificate ID. Check the ID and try again, or contact{" "}
                <a href={`mailto:${siteConfig.supportEmail}`} className="font-bold text-violet-600">
                  {siteConfig.supportEmail}
                </a>
                .
              </p>
            </>
          )}
        </article>

        <div className="mt-8 text-center">
          <Link href="/courses" className="text-sm font-black text-violet-600 hover:underline">
            Explore courses →
          </Link>
        </div>
      </div>
    </main>
  );
}
