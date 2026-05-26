"use client";

import React from "react";

interface GenItem {
  label: string;
  value: number;
  color?: string;
}

const GenBarChart: React.FC<{ data?: GenItem[] }> = ({ data = [] }) => {
  const genData = data.length
    ? data
    : [
        { label: "Gen Y (1981-1996)", value: 160, color: "bg-blue-500" },
        { label: "Gen X (1965-1980)", value: 130, color: "bg-green-500" },
        { label: "Baby Boomer (1946-1964)", value: 78, color: "bg-red-500" },
        { label: "Gen Z (1997-2012)", value: 30, color: "bg-yellow-500" },
      ];

  const maxCount = Math.max(...genData.map((d) => Number(d.value) || 0), 1);

  return (
    <div className="p-4 space-y-4">
      {genData.map((item) => (
        <div key={item.label}>
          <div className="flex justify-between mb-1 text-sm">
            <span className="font-medium text-gray-700">{item.label}</span>
            <span className="font-bold text-gray-900">{item.value} คน</span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className={`h-3 rounded-full ${item.color ?? "bg-blue-500"}`} style={{ width: `${(item.value / maxCount) * 100}%` }} />
          </div>
        </div>
      ))}
      <p className="text-sm text-gray-500 pt-2 text-center">แสดงสัดส่วนบุคลากรตามช่วงอายุ (Generation)</p>
    </div>
  );
};

export default GenBarChart;
