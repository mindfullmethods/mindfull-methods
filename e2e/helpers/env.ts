export function getE2eBaseUrl() {
  return process.env.E2E_BASE_URL ?? "http://127.0.0.1:3456";
}

export function getStudentCredentials() {
  const email = process.env.E2E_STUDENT_EMAIL?.trim();
  const password = process.env.E2E_STUDENT_PASSWORD?.trim();
  if (!email || !password) return null;
  return { email, password };
}

export function getAdminCredentials() {
  const email = process.env.E2E_ADMIN_EMAIL?.trim();
  const password = process.env.E2E_ADMIN_PASSWORD?.trim();
  if (!email || !password) return null;
  return { email, password };
}

export function hasStudentCredentials() {
  return getStudentCredentials() !== null;
}

export function getCertificateId() {
  return process.env.E2E_CERTIFICATE_ID?.trim() || null;
}

export function hasCertificateId() {
  return Boolean(getCertificateId());
}

export function hasAdminCredentials() {
  return getAdminCredentials() !== null;
}
