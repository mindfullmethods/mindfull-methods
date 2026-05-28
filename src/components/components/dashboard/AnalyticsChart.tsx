export type ChartPoint = { name: string; value: number };

export default function AnalyticsChart({
  data,
  emptyLabel = "No activity yet",
  barClassName = "bg-zinc-950 dark:bg-white",
}: {
  data: ChartPoint[];
  emptyLabel?: string;
  barClassName?: string;
}) {
  const max = Math.max(1, ...data.map((item) => item.value));
  const hasData = data.some((item) => item.value > 0);

  if (!hasData) {
    return (
      <div className="flex h-[320px] items-center justify-center rounded-2xl bg-[#f7f8f5] p-5 dark:bg-zinc-950">
        <p className="text-sm font-semibold text-zinc-500">{emptyLabel}</p>
      </div>
    );
  }

  return (
    <div className="flex h-[320px] items-end gap-3 rounded-2xl bg-[#f7f8f5] p-5 dark:bg-zinc-950">
      {data.map((item) => (
        <div key={item.name} className="flex h-full flex-1 flex-col justify-end gap-3">
          <div className="flex flex-1 items-end">
            <div
              className={`w-full rounded-t-xl transition ${barClassName}`}
              style={{ height: `${Math.max(14, (item.value / max) * 100)}%` }}
            />
          </div>
          <div className="text-center">
            <p className="text-sm font-black">{item.value}</p>
            <p className="mt-1 text-xs font-bold text-zinc-500">{item.name}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
