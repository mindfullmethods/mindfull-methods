import { contactUrl } from "@/lib/site";

/** Calendly, Cal.com, or similar — falls back to contact page. */
export function getBookingUrl() {
  const url = process.env.NEXT_PUBLIC_BOOKING_URL?.trim();
  if (url && (url.startsWith("http://") || url.startsWith("https://"))) {
    return url;
  }
  return contactUrl();
}

export function isExternalBooking() {
  return Boolean(process.env.NEXT_PUBLIC_BOOKING_URL?.trim());
}
