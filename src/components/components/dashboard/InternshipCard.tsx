"use client";

import { motion } from "framer-motion";
import Link from "next/link";


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
    <motion.div
      onClick={() =>
        (window.location.href =
          `/dashboard/internships/${id}`)
      }
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
      className="group cursor-pointer overflow-hidden rounded-[32px] border border-white/20 bg-white/70 shadow-2xl backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:shadow-[0_25px_80px_rgba(0,0,0,0.25)] dark:border-white/10 dark:bg-zinc-900/80"
    >
      <img
        src={
          image ||
          "https://images.unsplash.com/photo-1498050108023-c5249f4df085"
        }
        alt={title}
        className="h-48 w-full object-cover transition duration-700 group-hover:scale-110 sm:h-56"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

      <div className="absolute bottom-4 left-4">
        <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-zinc-900 backdrop-blur-md dark:text-white">
          {duration}
        </span>
      </div>


      <div className="space-y-6 p-5 sm:p-7">
    
        <div className="flex items-start justify-between gap-4">
     
          <div>
            <h2 className="text-xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-2xl">
              {title}
            </h2>

            <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-300">
              {company}
            </p>
      
          </div>
     
        </div>

        <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600 dark:text-gray-400 sm:leading-7">
          {description}
        </p>

        <div className="mt-8 flex items-center justify-between">
     
          <div>
     
            <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400">
              Stipend
            </p>

            <h3 className="mt-1 text-lg font-black text-zinc-900 dark:text-white sm:text-xl">
              {stipend}  
            </h3>
      
          </div>

          <Link
            href={`/dashboard/apply/${id}`}
            onClick={(e) => e.stopPropagation()}
            className="rounded-2xl bg-black px-4 py-2.5 text-sm font-semibold text-white transition duration-300 hover:scale-105 dark:bg-white dark:text-black sm:px-5 sm:py-3"
          >
            Apply
          </Link>
        </div>
   
      </div>
   
    </motion.div>
  );
}