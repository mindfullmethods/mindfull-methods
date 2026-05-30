export function formatCertificateId(userId: string, courseSlug: string) {
  const slugPart = courseSlug.replace(/-/g, "").slice(0, 8).toUpperCase();
  const userPart = userId.replace(/-/g, "").slice(0, 8).toUpperCase();
  return `MM-${slugPart}-${userPart}`;
}

export function formatCertificateDate(value: string | Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(typeof value === "string" ? new Date(value) : value);
}
