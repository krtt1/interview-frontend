"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "ดีเยี่ยม", value: 30, color: "#3b82f6" },
  { name: "ดีมาก", value: 25, color: "#10b981" },
  { name: "ดี", value: 15, color: "#f59e0b" },
  { name: "พอใช้", value: 8, color: "#6366f1" },
  { name: "ต้องปรับปรุง", value: 5, color: "#ef4444" },
];

export default function PerfPieChart() {
  return (
    <div className="w-full h-64 min-h-[256px]">
      <ResponsiveContainer width="100%" height="100%" minHeight={256}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={85}
            dataKey="value"
            label={({ name, value }) => `${name}: ${value}`}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
