const data = [
  { name: "Mon", applications: 4 },
  { name: "Tue", applications: 7 },
  { name: "Wed", applications: 5 },
  { name: "Thu", applications: 9 },
  { name: "Fri", applications: 6 },
  { name: "Sat", applications: 11 },
  { name: "Sun", applications: 8 },
];

export default function AnalyticsChart() {
  const max = Math.max(...data.map((item) => item.applications));

  return (
    <div className="flex h-[320px] items-end gap-3 rounded-2xl bg-[#f7f8f5] p-5 dark:bg-zinc-950">
      {data.map((item) => (
        <div key={item.name} className="flex h-full flex-1 flex-col justify-end gap-3">
          <div className="flex flex-1 items-end">
            <div
              className="w-full rounded-t-xl bg-zinc-950 transition dark:bg-white"
              style={{ height: `${Math.max(14, (item.applications / max) * 100)}%` }}
            />
          </div>
          <div className="text-center">
            <p className="text-sm font-black">{item.applications}</p>
            <p className="mt-1 text-xs font-bold text-zinc-500">{item.name}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
