import Razorpay from "razorpay";

const RECEIPT_MAX_LENGTH = 40;

/** Razorpay receipt must be ≤40 chars; long course slugs broke order creation. */
export function buildRazorpayReceipt(prefix = "mm") {
  const stamp = Date.now().toString(36);
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${prefix}_${stamp}_${suffix}`.slice(0, RECEIPT_MAX_LENGTH);
}

function parseRazorpayError(error: unknown) {
  if (error && typeof error === "object") {
    const nested = error as { error?: { description?: string }; description?: string; message?: string };
    return nested.error?.description ?? nested.description ?? nested.message ?? null;
  }
  if (error instanceof Error) return error.message;
  return null;
}

export function getRazorpayClient() {
  const keyId = process.env.RAZORPAY_KEY_ID ?? process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("Razorpay keys are not configured.");
  }

  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

export function getRazorpayKeyId() {
  return process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? process.env.RAZORPAY_KEY_ID ?? "";
}

export function isRazorpayConfigured() {
  return Boolean(getRazorpayKeyId() && process.env.RAZORPAY_KEY_SECRET);
}

export function formatRazorpayOrderError(error: unknown) {
  const detail = parseRazorpayError(error);
  if (!detail) return "Could not create payment order.";

  const lower = detail.toLowerCase();
  if (lower.includes("receipt")) {
    return "Could not create payment order. Please try again.";
  }
  if (lower.includes("authentication") || lower.includes("key")) {
    return "Payment gateway credentials are invalid. Contact support.";
  }

  return process.env.NODE_ENV === "development" ? detail : "Could not create payment order.";
}
