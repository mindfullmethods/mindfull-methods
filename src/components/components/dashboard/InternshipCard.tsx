"use client";

import { motion } from "framer-motion";
import Link from "next/link";
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
  <Link
    href={`/dashboard/internships/${id}`}
  >
    

      <motion.div
        initial={{
          opacity: 0,
          y: 40,
        }}
        animate={{
         opacity: 1,
         y: 0,
       }}
       transition={{
         duration: 0.5,
        }}
        whileHover={{
          y: -8,
        }}
        className="group overflow-hidden rounded-[32px] border border-white/20 bg-white/70 shadow-xl backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:shadow-2xl"
        
        >

        <img
          src={image}
          alt={title}
          className="h-56 w-full object-cover transition duration-700 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        <div className="absolute bottom-4 left-4">

          <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
            {duration}
          </span>

        </div>

      

      <div className="p-6">

        <div className="flex items-start justify-between gap-4">

          <div>

            <h2 className="text-2xl font-black tracking-tight text-black">
              {title}
            </h2>

            <p className="mt-2 text-sm font-medium text-gray-500">
              {company}
            </p>

          </div>

        </div>

        <p className="mt-5 line-clamp-3 text-sm leading-7 text-gray-600">
          {description}
        </p>

        <div className="mt-8 flex items-center justify-between">

          <div>

            <p className="text-xs uppercase tracking-widest text-gray-400">
              Stipend
            </p>

            <h3 className="mt-1 text-xl font-black">
              {stipend}
            </h3>

          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              applyToInternship(id);
            }}
            className="rounded-2xl bg-black px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:scale-105 hover:bg-gray-800"
          >
            Apply
          </button>

        </div>

      </div>

    </motion.div>
  </Link>
);
}