"use client";

import { applyToInternship } from "@/Services/applications";

interface InternshipCardProps {
  id: string;
  title: string;
  company: string;
  description: string;
  duration: string;
  stipend: string;
  image: string;
}

export default function InternshipCard({
  id,
  title,
  company,
  description,
  duration,
  stipend,
  image,
}: InternshipCardProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-lg">

      <img
        src={image}
        alt={title}
        className="h-52 w-full object-cover"
      />

      <div className="p-6">

        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {title}
          </h2>

          <span className="rounded-full bg-black px-3 py-1 text-xs text-white">
            {duration}
          </span>
        </div>

        <p className="mt-2 text-sm text-gray-500">
          {company}
        </p>

        <p className="mt-4 text-sm text-gray-600">
          {description}
        </p>

        <div className="mt-6 flex items-center justify-between">
          <p className="font-semibold">
            {stipend}
          </p>

          <button
            onClick={() =>
              applyToInternship(id)
            }
            className="rounded-2xl bg-black px-5 py-2 text-white transition hover:scale-105"
          >
            Apply
          </button>
        </div>

      </div>
    </div>
  );
}