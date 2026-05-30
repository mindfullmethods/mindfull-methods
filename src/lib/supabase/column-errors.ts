export function isMissingColumnError(message: string, ...columns: string[]) {
  const lower = message.toLowerCase();
  const looksLikeMissingColumn =
    lower.includes("does not exist") ||
    lower.includes("schema cache") ||
    lower.includes("pgrst204");

  if (!looksLikeMissingColumn) return false;

  return columns.some((column) => lower.includes(column.toLowerCase()));
}
