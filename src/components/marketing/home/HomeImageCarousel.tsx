"use client";

import { useEffect, useState } from "react";

type Slide = { src: string; caption: string };

export default function HomeImageCarousel({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative">
      <div className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-violet-600/20 blur-3xl" />
      <div className="mm-landing-glass relative overflow-hidden rounded-[1.5rem] p-2">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.1rem]">
          {slides.map((slide, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={slide.src + i}
              src={slide.src}
              alt={slide.caption}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                i === index ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
          <div className="absolute right-3 top-3 rounded-full border border-white/15 bg-black/50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/80 backdrop-blur-sm">
            {slides[index]?.caption}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2">
        {slides.map((slide, i) => (
          <button
            key={slide.src + i}
            type="button"
            aria-label={`Show ${slide.caption}`}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-6 bg-violet-400" : "w-1.5 bg-white/25 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
