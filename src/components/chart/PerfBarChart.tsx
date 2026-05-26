"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const data = [
  { name: "กลุ่มอำนวยการ", avg: 82 },
  { name: "กลุ่มควบคุมโรค", avg: 76 },
  { name: "ศูนย์ฝึกอบรม", avg: 88 },
  { name: "ฝ่ายสนับสนุน", avg: 70 },
];

export default function PerfBarChart() {
  return (
    <div className="w-full h-64 min-h-[256px]">
      <ResponsiveContainer width="100%" height="100%" minHeight={256}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="avg" fill="#3b82f6" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
