export default function Stats() {
  return (
    <section className="border-y bg-gray-50">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-16 md:grid-cols-4">
        <div>
          <h2 className="text-4xl font-bold text-zinc-900 dark:text-white">10K+</h2>
          <p className="mt-2 text-gray-600 dark:text-zinc-400">Students Enrolled</p>
        </div>

        <div>
          <h2 className="text-4xl font-bold text-zinc-900 dark:text-white">500+</h2>
          <p className="mt-2 text-gray-600 dark:text-zinc-400">Internships</p>
        </div>

        <div>
          <h2 className="text-4xl font-bold text-zinc-900 dark:text-white">95%</h2>
          <p className="mt-2 text-gray-600 dark:text-zinc-400">Completion Rate</p>
        </div>

        <div>
          <h2 className="text-4xl font-bold text-zinc-900 dark:text-white">4.9★</h2>
          <p className="mt-2 text-gray-600 dark:text-zinc-400">Student Rating</p>
        </div>
      </div>
    </section>
  );
}