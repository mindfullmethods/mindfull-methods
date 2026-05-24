const companies = [
  "Google",
  "Microsoft",
  "Amazon",
  "Netflix",
  "Spotify",
];

export default function Companies() {
  return (
    <section className="border-y bg-white py-16 dark:bg-black">
      <div className="mx-auto max-w-7xl px-6">
        
        <p className="text-center text-sm font-medium uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
          Trusted by students placed in
        </p>

        <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-5">
          {companies.map((company) => (
            <div
              key={company}
              className="flex items-center justify-center rounded-2xl border border-black/5 bg-gray-50 py-6 text-lg font-bold text-zinc-800 shadow-sm dark:border-white/10 dark:bg-zinc-900 dark:text-white"
            >
              {company}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}