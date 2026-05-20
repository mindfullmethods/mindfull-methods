import { createInternship } from "@/actions/createInternships";
export default function AdminPage()  {
  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 xl:px-12">

      <div className="mb-12">

        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-400">
          Admin Dashboard
        </p>

        <h1 className="mt-4 text-4xl font-black text-black dark:text-white sm:text-5xl">
          Manage Internships
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-8 text-gray-500 dark:text-gray-400 sm:text-lg">
          Add and manage internship
          opportunities across the platform.
        </p>

      </div>

      <div className="rounded-[32px] border border-white/20 bg-white/80 p-6 shadow-2xl backdrop-blur-xl transition duration-500 dark:border-white/10 dark:bg-white/5 sm:p-8">

        <form 
        action={createInternship}
        className="grid gap-6"
        >

          <div>

            <label className="mb-3 block text-sm font-semibold text-gray-600 dark:text-gray-300">
              
              Internship Title
            </label>

            <input
              type="text"
              name="title"
              placeholder="Frontend Developer Internship"
              className="w-full rounded-3xl border border-black/10 bg-white/70 px-5 py-5 outline-none transition focus:border-black focus:ring-4 focus:ring-black/5 dark:border-white/10 dark:bg-black/20 dark:text-white"
            />

          </div>

          <div>

            <label className="mb-3 block text-sm font-semibold text-gray-600 dark:text-gray-300">
              
              Company Name
            </label>

            <input
              type="text"
              name="company"
              placeholder="Google"
              className="w-full rounded-3xl border border-black/10 bg-white/70 px-5 py-5 outline-none transition focus:border-black focus:ring-4 focus:ring-black/5 dark:border-white/10 dark:bg-black/20 dark:text-white"
            />

          </div>

          <div>

            <label className="mb-3 block text-sm font-semibold text-gray-600 dark:text-gray-300">
              Internship Description
            </label>

            <textarea
              rows={6}
              name="description"
              placeholder="Describe internship responsibilities..."
              className="w-full rounded-3xl border border-black/10 bg-white/70 px-5 py-5 outline-none transition focus:border-black focus:ring-4 focus:ring-black/5 dark:border-white/10 dark:bg-black/20 dark:text-white"
            />

          </div>

          <div className="grid gap-6 sm:grid-cols-2">

            <div>

              <label className="mb-3 block text-sm font-semibold text-gray-600 dark:text-gray-300">
                
                Duration
              </label>

              <input
                type="text"
                name="duration"
                placeholder="3 Months"
                className="w-full rounded-3xl border border-black/10 bg-white/70 px-5 py-5 outline-none transition focus:border-black focus:ring-4 focus:ring-black/5 dark:border-white/10 dark:bg-black/20 dark:text-white"
              />

            </div>

            <div>

              <label className="mb-3 block text-sm font-semibold text-gray-600 dark:text-gray-300">
                
                Stipend
              </label>

              <input
                type="text"
                name="stipend"
                placeholder="₹25,000/month"
                className="w-full rounded-3xl border border-black/10 bg-white/70 px-5 py-5 outline-none transition focus:border-black focus:ring-4 focus:ring-black/5 dark:border-white/10 dark:bg-black/20 dark:text-white"
              />

            </div>

          </div>

          <div>

            <label className="mb-3 block text-sm font-semibold text-gray-600 dark:text-gray-300">
              Image URL
            </label>

            <input
              type="text"
              name="image_url"
              placeholder="https://example.com/image.jpg"
              className="w-full rounded-3xl border border-black/10 bg-white/70 px-5 py-5 outline-none transition focus:border-black focus:ring-4 focus:ring-black/5 dark:border-white/10 dark:bg-black/20 dark:text-white"
            />

          </div>

          <button
            type="submit"
            className="mt-6 rounded-3xl bg-black px-8 py-5 text-lg font-semibold text-white shadow-2xl transition duration-300 hover:scale-[1.02] hover:shadow-black/30 dark:bg-white dark:text-black"
          >
            Add Internship
          </button>

        </form>

      </div>

    </main>
  );
}