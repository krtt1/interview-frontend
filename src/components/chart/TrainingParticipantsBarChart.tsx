"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  { name: "เจ้าหน้าที่", participants: 25 },
  { name: "หัวหน้างาน", participants: 15 },
  { name: "นักวิชาการ", participants: 12 },
  { name: "ผู้บริหาร", participants: 8 },
];

const TrainingParticipantsBarChart = () => {
  return (
    <div className="w-full h-64 min-h-[256px]">
      <ResponsiveContainer width="100%" height="100%" minHeight={256}>
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="participants" fill="#3b82f6" name="จำนวนผู้เข้าร่วม" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrainingParticipantsBarChart;
