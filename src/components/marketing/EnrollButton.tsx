"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { CreditCard } from "lucide-react";

import { supabase } from "@/lib/supabase";

type RazorpayResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayConstructor = new (options: Record<string, unknown>) => {
  open: () => void;
};

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function EnrollButton({
  courseSlug,
  courseTitle,
  amountInPaise,
  priceLabel,
}: {
  courseSlug: string;
  courseTitle: string;
  amountInPaise: number;
  priceLabel: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [guestEmail, setGuestEmail] = useState("");
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    async function loadSession() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setSessionEmail(user?.email ?? null);
      if (user?.email) setGuestEmail(user.email);
      setCheckingSession(false);
    }

    loadSession();
  }, []);

  async function handlePay() {
    setError("");

    const checkoutEmail = sessionEmail ?? guestEmail.trim();
    if (!sessionEmail && !isValidEmail(checkoutEmail)) {
      setError("Enter a valid email before checkout.");
      return;
    }

    setLoading(true);

    try {
      const orderRes = await fetch("/api/payments/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseSlug,
          customerEmail: checkoutEmail,
        }),
      });

      const orderData = (await orderRes.json()) as {
        ok?: boolean;
        error?: string;
        keyId?: string;
        orderId?: string;
        amount?: number;
        currency?: string;
      };

      if (!orderRes.ok || !orderData.ok || !orderData.keyId || !orderData.orderId) {
        setError(orderData.error ?? "Unable to start checkout.");
        setLoading(false);
        return;
      }

      if (!window.Razorpay) {
        setError("Payment SDK failed to load. Refresh and try again.");
        setLoading(false);
        return;
      }

      const rzp = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.amount ?? amountInPaise,
        currency: orderData.currency ?? "INR",
        name: "Mindfull Methods",
        description: courseTitle,
        order_id: orderData.orderId,
        prefill: { email: checkoutEmail, name: "Student" },
        theme: { color: "#8B5CF6" },
        handler: async (response: RazorpayResponse) => {
          const verifyRes = await fetch("/api/payments/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...response,
              courseSlug,
              customerEmail: checkoutEmail,
            }),
          });

          const verifyData = (await verifyRes.json()) as { ok?: boolean; redirectUrl?: string; error?: string };

          if (verifyRes.ok && verifyData.ok && verifyData.redirectUrl) {
            window.location.href = verifyData.redirectUrl;
            return;
          }

          setError(verifyData.error ?? "Payment verification failed.");
          setLoading(false);
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      });

      rzp.open();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      {!checkingSession && !sessionEmail ? (
        <label className="block">
          <span className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">Email for enrollment</span>
          <input
            type="email"
            value={guestEmail}
            onChange={(e) => setGuestEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-violet-400 dark:border-white/10 dark:bg-white/5"
          />
        </label>
      ) : null}
      <button
        type="button"
        onClick={handlePay}
        disabled={loading || checkingSession}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-teal-400 px-6 py-4 text-sm font-black text-white shadow-lg shadow-violet-500/20 transition hover:scale-[1.02] disabled:opacity-60"
      >
        <CreditCard size={18} />
        {loading ? "Opening checkout…" : `Pay & enroll · ${priceLabel.split(" · ")[0]}`}
      </button>
      {error ? <p className="mt-2 text-xs font-bold text-rose-300">{error}</p> : null}
    </>
  );
}
