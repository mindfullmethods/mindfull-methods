import { createApplication } from "@/actions/createApplications";

export default function ApplyPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <main className="min-h-screen p-8 bg-gray-50 dark:bg-black">

      <div className="mx-auto max-w-2xl rounded-3xl border border-black/10 bg-white p-8 shadow-2xl dark:border-white/10 dark:bg-zinc-900">

        <h1 className="text-4xl font-black text-black dark:text-white">
          Apply Internship
        </h1>

        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Complete the form below to apply.
        </p>

        <form
          action={createApplication}
          className="mt-10 space-y-6"
        >

          <input
            type="hidden"
            name="internship_id"
            value={params.id}
          />

          <div>

            <label className="mb-2 block font-medium text-black dark:text-white">
              Full Name
            </label>

            <input
              type="text"
              name="student_name"
              required
              className="w-full rounded-2xl border border-black/10 p-4 outline-none dark:border-white/10 dark:bg-zinc-800 dark:text-white"
            />

          </div>

          <div>

            <label className="mb-2 block font-medium text-black dark:text-white">
              Email
            </label>

            <input
              type="email"
              name="email"
              required
              className="w-full rounded-2xl border border-black/10 p-4 outline-none dark:border-white/10 dark:bg-zinc-800 dark:text-white"
            />

          </div>

          <div>

            <label className="mb-2 block font-medium text-black dark:text-white">
              Resume Link
            </label>

            <input
              type="text"
              name="resume"
              placeholder="Google Drive / Resume URL"
              className="w-full rounded-2xl border border-black/10 p-4 outline-none dark:border-white/10 dark:bg-zinc-800 dark:text-white"
            />

          </div>

          <button
            type="submit"
            className="w-full rounded-2xl bg-black py-4 font-semibold text-white transition hover:scale-[1.02] dark:bg-white dark:text-black"
          >
            Submit Application
          </button>

        </form>

      </div>

    </main>
  );
}