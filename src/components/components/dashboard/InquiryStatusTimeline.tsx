"use client";

import { formatInquiryTimelineDate, type InquiryStatusEvent } from "@/lib/inquiry-status-history";

export default function InquiryStatusTimeline({
  events,
  createdAt,
}: {
  events?: InquiryStatusEvent[] | null;
  createdAt: string;
}) {
  const timeline: InquiryStatusEvent[] =
    events && events.length > 0
      ? events
      : [{ status: "New", at: createdAt, note: "Inquiry submitted" }];

  return (
    <div className="mt-4 border-t border-zinc-100 pt-4 dark:border-white/10">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">Status timeline</p>
      <ol className="mt-3 space-y-3">
        {[...timeline].reverse().map((event, index) => (
          <li key={`${event.at}-${event.status}-${index}`} className="flex gap-3">
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-violet-500" />
            <div>
              <p className="text-sm font-black">{event.status}</p>
              <p className="text-xs font-bold text-zinc-500">{formatInquiryTimelineDate(event.at)}</p>
              {event.note ? <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">{event.note}</p> : null}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
