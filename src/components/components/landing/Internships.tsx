const internships = [
  {
    title: "Frontend Development",
    description:
      "Master React, Next.js and Tailwind CSS with real-world projects.",
    level: "Beginner to Advanced",
  },
  {
    title: "UI/UX Design",
    description:
      "Design premium digital experiences using modern UI systems.",
    level: "Intermediate",
  },
  {
    title: "Data Science",
    description:
      "Work on machine learning, AI models and data analytics projects.",
    level: "Advanced",
  },
];

export default function Internships() {
  return (
    <section className="bg-white py-28 transition-colors dark:bg-black">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Section Header */}
        <div className="mb-16 text-center">
          <span className="rounded-full border bg-white px-4 py-2 text-sm font-medium shadow-sm dark:border-white/10 dark:bg-zinc-900 dark:text-white">
            Popular Programs
          </span>

          <h2 className="mt-6 text-4xl font-black tracking-tight text-zinc-900 dark:text-white md:text-6xl">
            Explore Top Internships
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-zinc-400">
            Practical learning experiences designed for ambitious students.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-8 md:grid-cols-3">
          {internships.map((item) => (
            <div
              key={item.title}
              className="group overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl dark:border-white/10 dark:bg-zinc-900"
            >
              
              {/* Card Image */}
              <div 
                  className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-zinc-800 dark:to-zinc-900">
                <div className="absolute inset-0 bg-black/5 opacity-0 transition group-hover:opacity-100" />
              </div>

              {/* Card Content */}
              <div className="p-8">
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-zinc-700 dark:bg-white/10 dark:text-white">
                  {item.level}
                </span>

                <h3 className="mt-5 text-2xl font-bold text-zinc-900 dark:text-white">
                  {item.title}
                </h3>

                <p className="mt-4 leading-relaxed text-gray-600 dark:text-gray-400">
                  {item.description}
                </p>

                <button
                  onClick={() =>
                   window.scrollTo({
                     top: 900,
                     behavior: "smooth",
                    })
                  }
                  className="rounded-3xl border border-black/10 bg-white px-8 py-4 text-lg font-semibold text-black shadow-xl transition duration-300 hover:scale-[1.03] dark:bg-white/10 dark:text-white"
                 >
                   Learn More
                 </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}