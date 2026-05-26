"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface ChartData {
  label: string;
  value: number;
  colorCode?: string;
  [k: string]: any;
}

const EducationPieChart: React.FC<{ data?: ChartData[] }> = ({ data = [] }) => {
  const hasData = Array.isArray(data) && data.some((d) => d.value > 0);
  const total = hasData ? data.reduce((s, d) => s + (d.value || 0), 0) : 0;
  const chartData = hasData ? data : [{ label: "ไม่มีข้อมูล", value: 1, colorCode: "#E5E7EB" }];
  const COLORS = chartData.map((d) => d.colorCode ?? "#ccc");

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
    if (percent * 100 > 5) {
      return (
        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="font-bold text-xs">
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      );
    }
    return null;
  };

  return (
    <div className="p-4 flex flex-col items-center justify-center">
      <div className="w-full h-64 min-h-[256px] mb-4">
        <ResponsiveContainer width="100%" height="100%" minHeight={256}>
          <PieChart>
            <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value" labelLine={false} label={renderCustomizedLabel}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2 w-full max-w-xs">
        {chartData.map((item) => (
          <div key={item.label} className="flex justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full`} style={{ backgroundColor: item.colorCode ?? "#999" }} />
              <span className="text-gray-700">{item.label}</span>
            </div>
            <span className="font-bold">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EducationPieChart;
