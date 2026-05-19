"use client";

import { useState } from "react";
import { applyToInternship } from "@/Services/apply";

export default function ApplyButton({
  internshipId,
}: {
  internshipId: string;
}) {
  const [loading, setLoading] =
    useState(false);

  async function handleApply() {
    setLoading(true);

    await applyToInternship(
      internshipId
    );

    setLoading(false);
  }

  return (
    <button
      onClick={handleApply}
      disabled={loading}
      className="mt-8 w-full rounded-2xl bg-black py-4 text-lg font-medium text-white transition hover:scale-[1.02] disabled:opacity-50"
    >

      {loading
        ? "Applying..."
        : "Apply Now"}

    </button>
  );
}