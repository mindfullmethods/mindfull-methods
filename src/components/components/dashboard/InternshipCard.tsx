"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Building2, Clock3, WalletCards } from "lucide-react";
import { marketingImages } from "@/lib/images";

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
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      whileHover={{ y: -6 }}
      className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-2xl dark:border-white/10 dark:bg-white/5"
    >
      <Link href={`/dashboard/internships/${id}`} className="block">
        <div className="relative h-52 overflow-hidden">
          <img
            src={image || marketingImages.internshipFallback}
            alt={title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/75 via-zinc-950/10 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-xs font-black text-zinc-950 backdrop-blur">
              <Clock3 size={14} />
              {duration}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-zinc-950/75 px-3 py-2 text-xs font-black text-white backdrop-blur">
              <WalletCards size={14} />
              {stipend}
            </span>
          </div>
        </div>
      </Link>

      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-sm font-bold text-zinc-500">
              <Building2 size={16} />
              {company}
            </p>
            <h3 className="mt-3 text-2xl font-black tracking-tight">{title}</h3>
          </div>
        </div>

        <p className="mt-4 line-clamp-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{description}</p>

        <div className="mt-6 flex items-center justify-between gap-3">
          <Link
            href={`/dashboard/internships/${id}`}
            className="inline-flex items-center gap-2 text-sm font-black text-zinc-700 transition hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white"
          >
            Details
            <ArrowRight size={16} />
          </Link>
          <Link
            href={`/dashboard/apply/${id}`}
            className="rounded-xl bg-zinc-950 px-4 py-3 text-sm font-black text-white transition hover:scale-[1.02] dark:bg-white dark:text-zinc-950"
          >
            Apply Now
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
