"use client";

import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Mon",
    applications: 4,
  },
  {
    name: "Tue",
    applications: 7,
  },
  {
    name: "Wed",
    applications: 5,
  },
  {
    name: "Thu",
    applications: 9,
  },
  {
    name: "Fri",
    applications: 6,
  },
  {
    name: "Sat",
    applications: 11,
  },
  {
    name: "Sun",
    applications: 8,
  },
];

export default function AnalyticsChart() {
  return (
    <div className="h-[320px] w-full">

      <ResponsiveContainer width="100%" height="100%">

        <BarChart data={data}>

          <XAxis
            dataKey="name"
            stroke="#888888"
          />

          <Tooltip />

          <Bar
            dataKey="applications"
            radius={[12, 12, 0, 0]}
          />

        </BarChart>

      </ResponsiveContainer>

    </div>
  );
}