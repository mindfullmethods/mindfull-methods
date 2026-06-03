import { NextResponse } from "next/server";

import { getSessionUser } from "@/lib/auth";
import { buildCertificatePdf } from "@/lib/certificate-pdf";
import { formatCertificateDate, certificateVerifyPath } from "@/lib/certificates";
import { getCourseBySlug } from "@/lib/courses";
import { absoluteUrl } from "@/lib/seo";
import { getCertificateById } from "@/Services/certificates";

function isAdminUser(email: string | undefined) {
  if (!email) return false;
  const admins = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return admins.includes(email.toLowerCase());
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in to download your certificate." }, { status: 401 });
  }

  const { id } = await params;
  const certificate = await getCertificateById(id);
  if (!certificate) {
    return NextResponse.json({ error: "Certificate not found." }, { status: 404 });
  }

  const ownsCertificate = certificate.user_id === user.id;
  const admin = isAdminUser(user.email);
  if (!ownsCertificate && !admin) {
    return NextResponse.json({ error: "You do not have access to this certificate." }, { status: 403 });
  }

  const course = getCourseBySlug(certificate.course_slug);
  const verifyUrl = absoluteUrl(certificateVerifyPath(certificate.id));
  const pdfBytes = await buildCertificatePdf({
    studentName: certificate.student_name,
    courseTitle: certificate.course_title,
    courseDuration: course?.duration ?? "—",
    courseLevel: course?.level ?? "—",
    certificateId: certificate.id,
    issuedDate: formatCertificateDate(certificate.issued_at),
    verifyUrl,
  });

  const filename = `${certificate.id}.pdf`;

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
