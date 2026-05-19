export default function Loading() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-10">

      <div className="animate-pulse">

        <div className="mb-14">

          <div className="h-4 w-40 rounded-full bg-gray-200" />

          <div className="mt-6 h-16 w-[420px] rounded-2xl bg-gray-200" />

          <div className="mt-6 h-6 w-[500px] rounded-full bg-gray-200" />

        </div>

        <div className="mb-14 grid gap-8 md:grid-cols-3">

          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="rounded-[32px] bg-white p-8 shadow-xl"
            >

              <div className="h-4 w-32 rounded-full bg-gray-200" />

              <div className="mt-6 h-14 w-24 rounded-2xl bg-gray-200" />

              <div className="mt-6 h-4 w-full rounded-full bg-gray-200" />

              <div className="mt-3 h-4 w-3/4 rounded-full bg-gray-200" />

            </div>
          ))}

        </div>

        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">

          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="overflow-hidden rounded-[32px] bg-white shadow-xl"
            >

              <div className="h-56 bg-gray-200" />

              <div className="p-6">

                <div className="h-8 w-3/4 rounded-full bg-gray-200" />

                <div className="mt-4 h-4 w-1/2 rounded-full bg-gray-200" />

                <div className="mt-6 h-4 w-full rounded-full bg-gray-200" />

                <div className="mt-3 h-4 w-5/6 rounded-full bg-gray-200" />

                <div className="mt-10 flex items-center justify-between">

                  <div className="h-10 w-24 rounded-2xl bg-gray-200" />

                  <div className="h-12 w-32 rounded-2xl bg-gray-200" />

                </div>

              </div>

            </div>
          ))}

        </div>

      </div>

    </main>
  );
}