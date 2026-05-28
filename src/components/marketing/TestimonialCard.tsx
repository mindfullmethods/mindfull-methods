import * as React from "react";
import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

export default function TestimonialCard({
  className,
  quote,
  name,
  role,
  rating = 5,
  featured = false,
}: {
  className?: string;
  quote: string;
  name: string;
  role?: string;
  rating?: number;
  featured?: boolean;
}) {
  return (
    <div
      className={cn(
        "group mm-glass rounded-3xl p-6 transition hover:-translate-y-1 hover:border-violet-400/25",
        featured && "md:col-span-2 md:row-span-2 md:p-8",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1">
          {Array.from({ length: rating }).map((_, i) => (
            <Star key={i} size={16} className="fill-amber-300 text-amber-300" />
          ))}
        </div>
        <span className="text-4xl font-black leading-none text-white/10 transition group-hover:text-violet-400/20">
          “
        </span>
      </div>

      <p className={cn("mt-4 leading-7 text-white/80", featured ? "text-base sm:text-lg" : "text-sm")}>
        {quote}
      </p>

      <div className="mt-6 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-teal-400 text-sm font-black text-white">
          {name.charAt(0)}
        </span>
        <div>
          <p className="text-sm font-black text-white">{name}</p>
          {role ? <p className="text-xs font-bold text-white/50">{role}</p> : null}
        </div>
      </div>
    </div>
  );
}
