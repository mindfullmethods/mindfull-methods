import * as React from "react";
import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

export default function TestimonialCard({
  className,
  quote,
  name,
  role,
  rating = 5,
}: {
  className?: string;
  quote: string;
  name: string;
  role?: string;
  rating?: number;
}) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm",
        className
      )}
    >
      <div className="flex items-center gap-1">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} size={16} className="fill-white/80 text-white/80" />
        ))}
      </div>
      <p className="mt-4 text-sm leading-6 text-white/75">“{quote}”</p>
      <div className="mt-5">
        <p className="text-sm font-black text-white">{name}</p>
        {role ? <p className="text-xs font-bold text-white/50">{role}</p> : null}
      </div>
    </div>
  );
}

