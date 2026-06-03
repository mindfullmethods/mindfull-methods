import { Suspense } from "react";

import EnrollButton from "@/components/marketing/EnrollButton";

export default function EnrollCheckoutSection(props: {
  courseSlug: string;
  courseTitle: string;
  amountInPaise: number;
  priceLabel: string;
}) {
  return (
    <Suspense
      fallback={
        <p className="text-sm font-semibold text-zinc-500">Loading checkout…</p>
      }
    >
      <EnrollButton {...props} />
    </Suspense>
  );
}
