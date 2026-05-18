const companies = [
  "Google",
  "Microsoft",
  "Amazon",
  "Netflix",
  "Spotify",
];

export default function Companies() {
  return (
    <section className="border-y bg-white py-16">
      <div className="mx-auto max-w-7xl px-6">
        
        <p className="text-center text-sm font-medium uppercase tracking-[0.2em] text-gray-500">
          Trusted by students placed in
        </p>

        <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-5">
          {companies.map((company) => (
            <div
              key={company}
              className="flex items-center justify-center rounded-2xl border border-black/5 bg-gray-50 py-6 text-lg font-bold shadow-sm"
            >
              {company}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}