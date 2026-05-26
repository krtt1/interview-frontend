"use client";

import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
  { name: "ผ่านการอบรม", value: 45 },
  { name: "ไม่ผ่าน", value: 10 },
  { name: "กำลังอบรม", value: 5 },
];

const COLORS = ["#4ade80", "#f87171", "#60a5fa"];

const TrainingStatusPieChart = () => {
  return (
    <div className="w-full h-64 min-h-[256px]">
      <ResponsiveContainer width="100%" height="100%" minHeight={256}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="value"
            label={({ name, value }) => `${name}: ${value}`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrainingStatusPieChart;
