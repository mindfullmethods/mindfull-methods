import { redirect } from "next/navigation";

/** PRD path alias: /verify/{certificate_id} → public verify page */
export default async function VerifyAliasPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/certificates/verify/${encodeURIComponent(id)}`);
}
