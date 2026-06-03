"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";

import { saveSiteContentAction } from "@/actions/adminSiteSettings";
import MentorImageField from "@/components/components/dashboard/MentorImageField";
import SectionHeader from "@/components/marketing/SectionHeader";
import { marketingImages } from "@/lib/images";
import type { SiteContent } from "@/lib/site-content";

export default function AdminSiteContentPanel({
  initial,
  tableReady,
}: {
  initial: SiteContent;
  tableReady: boolean;
}) {
  const [content, setContent] = useState(initial);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function save() {
    setMessage("");
    startTransition(async () => {
      const result = await saveSiteContentAction(content);
      setMessage(result.ok ? "Marketing content saved." : result.error);
    });
  }

  return (
    <section className="mm-section-panel">
      <SectionHeader
        eyebrow="Marketing"
        title="Home & about content"
        description="Trust badges, stats, mentor profile, and testimonials. Replace images in public/images/marketing/ (see README there)."
      />

      {!tableReady ? (
        <p className="relative mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-200">
          Run supabase/content-cms-schema.sql to persist edits.
        </p>
      ) : null}

      <div className="relative mt-6 grid gap-5">
        <label className="block">
          <span className="text-sm font-semibold mm-heading">Trust badges (one per line)</span>
          <textarea
            rows={3}
            value={content.trustBadges.join("\n")}
            onChange={(e) =>
              setContent((c) => ({
                ...c,
                trustBadges: e.target.value.split("\n").map((l) => l.trim()).filter(Boolean),
              }))
            }
            disabled={!tableReady || isPending}
            className="mt-2 mm-input w-full resize-none"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          {content.stats.map((stat, index) => (
            <div key={stat.label} className="grid gap-2 sm:grid-cols-2">
              <input
                value={stat.label}
                onChange={(e) =>
                  setContent((c) => ({
                    ...c,
                    stats: c.stats.map((s, i) => (i === index ? { ...s, label: e.target.value } : s)),
                  }))
                }
                disabled={!tableReady || isPending}
                className="mm-input w-full"
                placeholder="Stat label"
              />
              <input
                value={stat.value}
                onChange={(e) =>
                  setContent((c) => ({
                    ...c,
                    stats: c.stats.map((s, i) => (i === index ? { ...s, value: e.target.value } : s)),
                  }))
                }
                disabled={index === 0 || !tableReady || isPending}
                className="mm-input w-full"
                placeholder="Value"
                title={index === 0 ? "Course count is auto-filled from your catalog" : undefined}
              />
            </div>
          ))}
        </div>

        <div className="rounded-2xl border mm-border bg-zinc-50/80 p-4 dark:bg-white/[0.02]">
          <p className="text-sm font-bold mm-heading">Mentor profile</p>
          <MentorImageField
            value={content.mentor.imageUrl}
            onChange={(imageUrl) => setContent((c) => ({ ...c, mentor: { ...c.mentor, imageUrl } }))}
            disabled={!tableReady || isPending}
            fallbackSrc={marketingImages.mentorPortrait}
            mentorName={content.mentor.name}
          />
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <input
              value={content.mentor.name}
              onChange={(e) => setContent((c) => ({ ...c, mentor: { ...c.mentor, name: e.target.value } }))}
              disabled={!tableReady || isPending}
              className="mm-input w-full"
              placeholder="Name"
            />
            <input
              value={content.mentor.title}
              onChange={(e) => setContent((c) => ({ ...c, mentor: { ...c.mentor, title: e.target.value } }))}
              disabled={!tableReady || isPending}
              className="mm-input w-full"
              placeholder="Title"
            />
            <input
              value={content.mentor.email}
              onChange={(e) => setContent((c) => ({ ...c, mentor: { ...c.mentor, email: e.target.value } }))}
              disabled={!tableReady || isPending}
              className="mm-input w-full sm:col-span-2"
              placeholder="Email"
            />
          </div>
          <textarea
            rows={4}
            value={content.mentor.bio}
            onChange={(e) => setContent((c) => ({ ...c, mentor: { ...c.mentor, bio: e.target.value } }))}
            disabled={!tableReady || isPending}
            className="mt-3 mm-input w-full resize-none"
          />
        </div>

        <div className="rounded-2xl border mm-border p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-bold mm-heading">Testimonials</p>
            <button
              type="button"
              disabled={!tableReady || isPending}
              onClick={() =>
                setContent((c) => ({
                  ...c,
                  testimonials: [...c.testimonials, { quote: "", name: "", role: "", rating: 5 }],
                }))
              }
              className="inline-flex items-center gap-1 rounded-lg border mm-border px-3 py-1.5 text-xs font-bold mm-heading disabled:opacity-60"
            >
              <Plus size={14} />
              Add
            </button>
          </div>
          <div className="mt-4 space-y-4">
            {content.testimonials.map((item, index) => (
              <div key={index} className="rounded-xl border mm-border bg-zinc-50/50 p-3 dark:bg-white/[0.02]">
                <div className="flex justify-end">
                  <button
                    type="button"
                    disabled={!tableReady || isPending || content.testimonials.length <= 1}
                    onClick={() =>
                      setContent((c) => ({
                        ...c,
                        testimonials: c.testimonials.filter((_, i) => i !== index),
                      }))
                    }
                    className="text-zinc-400 hover:text-red-600 disabled:opacity-40"
                    aria-label="Remove testimonial"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={item.quote}
                  onChange={(e) =>
                    setContent((c) => ({
                      ...c,
                      testimonials: c.testimonials.map((t, i) =>
                        i === index ? { ...t, quote: e.target.value } : t
                      ),
                    }))
                  }
                  disabled={!tableReady || isPending}
                  className="mm-input w-full resize-none text-sm"
                  placeholder="Quote"
                />
                <div className="mt-2 grid gap-2 sm:grid-cols-3">
                  <input
                    value={item.name}
                    onChange={(e) =>
                      setContent((c) => ({
                        ...c,
                        testimonials: c.testimonials.map((t, i) =>
                          i === index ? { ...t, name: e.target.value } : t
                        ),
                      }))
                    }
                    disabled={!tableReady || isPending}
                    className="mm-input w-full text-sm"
                    placeholder="Name"
                  />
                  <input
                    value={item.role ?? ""}
                    onChange={(e) =>
                      setContent((c) => ({
                        ...c,
                        testimonials: c.testimonials.map((t, i) =>
                          i === index ? { ...t, role: e.target.value } : t
                        ),
                      }))
                    }
                    disabled={!tableReady || isPending}
                    className="mm-input w-full text-sm"
                    placeholder="Role / track"
                  />
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={item.rating ?? 5}
                    onChange={(e) =>
                      setContent((c) => ({
                        ...c,
                        testimonials: c.testimonials.map((t, i) =>
                          i === index ? { ...t, rating: Number(e.target.value) || 5 } : t
                        ),
                      }))
                    }
                    disabled={!tableReady || isPending}
                    className="mm-input w-full text-sm"
                    placeholder="Rating"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={save}
        disabled={!tableReady || isPending}
        className="relative mt-4 rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white disabled:opacity-60"
      >
        {isPending ? "Saving…" : "Save marketing content"}
      </button>
      {message ? <p className="relative mt-3 text-sm font-semibold text-violet-600 dark:text-violet-300">{message}</p> : null}
    </section>
  );
}
