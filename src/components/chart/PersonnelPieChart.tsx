"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

export interface ChartData {
  label?: string;
  name?: string;
  value: number;
  colorCode?: string;
  [key: string]: any;
}

/** -------------------------------
 *  Custom Tooltip
 *  ------------------------------- */
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    // ปรับแก้ตรงนี้: เช็คให้ชัวร์ว่า __total มีค่าและไม่ใช่ 0
    const total = item?.__total ?? 0;
    const percent = total > 0 ? ((item.value / total) * 100).toFixed(1) : "0.0";

    return (
      <div className="p-2 bg-white border border-gray-200 shadow-lg rounded-md">
        <p className="text-sm font-semibold text-gray-800">
          {item.label ?? item.name}
        </p>
        <p className="text-xs text-gray-600">จำนวน: {item.value} คน</p>
        <p className="text-xs text-gray-600">สัดส่วน: {percent}%</p>
      </div>
    );
  }
  return null;
};

/** -------------------------------
 *  Personnel Pie Chart
 *  ------------------------------- */
const PersonnelPieChart: React.FC<{
  data?: ChartData[];
  isLoading?: boolean;
}> = ({ data = [], isLoading = false }) => {
  // fix container height to avoid Recharts width/height = -1
  const containerHeight = 288; // 18rem (h-72)

  /** Loading state */
  if (isLoading) {
    return (
      <div
        className="w-full min-w-0"
        style={{ height: containerHeight }}
      >
        <div className="h-full flex items-center justify-center text-sm text-gray-500">
          กำลังโหลดข้อมูล...
        </div>
      </div>
    );
  }

  /** Empty data state */
  const hasData =
    Array.isArray(data) && data.some((d) => (d?.value ?? 0) > 0);

  if (!hasData) {
    return (
      <div
        className="w-full min-w-0"
        style={{ height: containerHeight }}
      >
        <div className="h-full flex flex-col items-center justify-center text-sm text-gray-500 italic">
          <div>ยังไม่มีข้อมูลสำหรับแสดงกราฟ</div>
          <div className="text-xs text-gray-300 mt-2">
            ระบบจะแสดงกราฟเมื่อมีข้อมูลบุคลากร
          </div>
        </div>
      </div>
    );
  }

  /** Prepare chart data */
  const total = data.reduce((sum, it) => sum + (it.value || 0), 0);
  const chartData = data.map((d) => ({
    ...d,
    label: d.label ?? d.name,
    __total: total,
  }));

  const COLORS = chartData.map(
    (d) => d.colorCode ?? "#cbd5e1"
  );

  /** Render chart */
  return (
    <div
      className="w-full min-w-0"
      style={{ height: containerHeight, minHeight: containerHeight }}
    >
      <ResponsiveContainer width="100%" height="100%" minHeight={containerHeight}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={6}
            dataKey="value"
            nameKey="label"
          >
            {chartData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip content={<CustomTooltip />} />
          <Legend
            layout="vertical"
            verticalAlign="middle"
            align="right"
            wrapperStyle={{ paddingLeft: 10 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PersonnelPieChart;
