import { notFound } from "next/navigation";
import BrandWordmark from "@/components/marketing/BrandWordmark";
import SyllabusActions from "@/components/marketing/SyllabusActions";
import { getCourseBySlug, getCourseSlugs } from "@/lib/courses";
import { hasSyllabusPdf, syllabusPdfPublicUrl } from "@/lib/syllabus-files";
import { syllabusUrl } from "@/lib/site";
import type { Metadata } from "next";

export function generateStaticParams() {
  return getCourseSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) return { title: "Syllabus not found" };
  return { title: `${course.title} Syllabus` };
}

export default async function SyllabusPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) notFound();

  const pdfUrl = hasSyllabusPdf(course.slug) ? syllabusPdfPublicUrl(course.slug) : undefined;

  return (
    <div className="min-h-screen bg-white text-zinc-950 print:bg-white">
      <div className="syllabus-print mx-auto max-w-3xl px-5 py-12 sm:px-8 print:max-w-none print:py-0">
      <SyllabusActions courseSlug={course.slug} txtUrl={syllabusUrl(course.slug)} pdfUrl={pdfUrl} />

      <header className="border-b border-zinc-200 pb-8">
        <BrandWordmark size="md" />
        <p className="mt-6 text-sm font-black uppercase tracking-[0.24em] text-violet-600">Course syllabus</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight">{course.title}</h1>
        <p className="mt-4 text-sm leading-7 text-zinc-600">{course.longDescription}</p>
        <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-black text-zinc-500">Level</dt>
            <dd className="font-bold">{course.level}</dd>
          </div>
          <div>
            <dt className="font-black text-zinc-500">Duration</dt>
            <dd className="font-bold">{course.duration}</dd>
          </div>
          <div>
            <dt className="font-black text-zinc-500">Format</dt>
            <dd className="font-bold">{course.mode}</dd>
          </div>
          <div>
            <dt className="font-black text-zinc-500">Pricing</dt>
            <dd className="font-bold">{course.priceLabel}</dd>
          </div>
        </dl>
      </header>

      <section className="mt-10">
        <h2 className="text-xl font-black">What you&apos;ll learn</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-zinc-700">
          {course.learnOutcomes.map((o) => (
            <li key={o}>{o}</li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-black">Weekly milestones</h2>
        <div className="mt-4 space-y-6">
          {course.curriculum.map((item) => (
            <div key={item.week}>
              <h3 className="font-black text-violet-700">{item.week}</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700">
                {item.topics.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <footer className="mt-12 border-t border-zinc-200 pt-6 text-xs text-zinc-500 print:fixed print:bottom-0 print:left-0 print:right-0 print:bg-white print:py-4">
        Mindfull Methods · mindfullmethods.com · support@mindfullmethods.com
      </footer>
      </div>
    </div>
  );
}
