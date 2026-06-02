export type InquiryStatusEvent = {
  status: string;
  at: string;
  note?: string | null;
};

export function formatInquiryTimelineDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
