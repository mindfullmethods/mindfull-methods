export type ChartPoint = { name: string; value: number; key?: string };

const BAR_WIDTH_PX = 40;
const CHART_HEIGHT_PX = 260;

export default function AnalyticsChart({
  data,
  emptyLabel = "No activity yet",
  barClassName = "bg-zinc-950 dark:bg-white",
}: {
  data: ChartPoint[];
  emptyLabel?: string;
  barClassName?: string;
}) {
  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-2xl bg-[#f7f8f5] p-5 dark:bg-zinc-950"
        style={{ height: CHART_HEIGHT_PX }}
      >
        <p className="text-sm font-semibold text-zinc-500">{emptyLabel}</p>
      </div>
    );
  }

  const max = Math.max(1, ...data.map((item) => item.value));
  const hasValues = data.some((item) => item.value > 0);
  const trackMinWidth = data.length * BAR_WIDTH_PX + (data.length - 1) * 6;

  return (
    <div className="rounded-2xl bg-[#f7f8f5] dark:bg-zinc-950">
      <div className="overflow-x-auto overscroll-x-contain px-3 pb-3 pt-4 sm:px-4">
        <div
          className="flex items-end gap-1.5 sm:gap-2"
          style={{ minWidth: trackMinWidth, height: CHART_HEIGHT_PX }}
          role="img"
          aria-label="Activity bar chart"
        >
          {data.map((item) => {
            const heightPct = item.value > 0 ? Math.max(12, (item.value / max) * 100) : 4;

            return (
              <div
                key={item.key ?? item.name}
                className="flex h-full shrink-0 flex-col justify-end"
                style={{ width: BAR_WIDTH_PX }}
              >
                <div className="flex flex-1 items-end justify-center">
                  <div
                    className={`w-7 rounded-t-lg transition sm:w-8 ${barClassName} ${item.value === 0 ? "opacity-25" : ""}`}
                    style={{ height: `${heightPct}%` }}
                    title={`${item.name}: ${item.value}`}
                  />
                </div>
                <div className="mt-2 text-center">
                  {item.value > 0 ? (
                    <p className="text-xs font-black leading-none">{item.value}</p>
                  ) : (
                    <p className="text-[10px] font-bold leading-none text-zinc-400">0</p>
                  )}
                  <p className="mt-1 text-[10px] font-bold leading-tight text-zinc-500 sm:text-[11px]">
                    {item.name}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {!hasValues ? (
        <p className="border-t border-zinc-200/80 px-4 py-3 text-center text-xs font-semibold text-zinc-500 dark:border-white/10">
          {emptyLabel}
        </p>
      ) : null}
    </div>
  );
}
