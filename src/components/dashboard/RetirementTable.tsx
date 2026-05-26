"use client";

import React, { useState } from "react";
import { useRetirement } from "@/hooks/useRetirement";

export default function RetirementTable() {
  const { retirementData, jobTitlesSummary } = useRetirement(10);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const selectedYearData = retirementData.find((d) => d.year === selectedYear);

  return (
    <div className="p-4">
      {/* ตาราง */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="py-3 px-4 text-left font-semibold text-gray-700">ปีงบฯ</th>
              <th className="py-3 px-4 text-center font-semibold text-gray-700">รวม (คน)</th>
              <th className="py-3 px-4 text-left font-semibold text-blue-600">ตำแหน่ง</th>
            </tr>
          </thead>
          <tbody>
            {retirementData.slice(0, 10).map((yearData, index) => {
              const titlesSummary = jobTitlesSummary.find((jts) => jts.year === yearData.year);
              const isHighlight = index === 0 || yearData.count > 15;

              return (
                <tr
                  key={yearData.year}
                  className={`border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors ${
                    isHighlight ? "bg-yellow-50" : ""
                  } ${selectedYear === yearData.year ? "bg-blue-100" : ""}`}
                  onClick={() => setSelectedYear(yearData.year)}
                >
                  <td className={`py-3 px-4 ${isHighlight ? "font-bold" : ""}`}>
                    {yearData.buddhistYear}
                  </td>
                  <td className={`py-3 px-4 text-center ${isHighlight ? "font-bold text-lg" : ""}`}>
                    {yearData.count}
                  </td>
                  <td className="py-3 px-4 text-blue-700 text-xs">
                    {titlesSummary && titlesSummary.titles.length > 0
                      ? titlesSummary.titles.slice(0, 3).map((t) => `${t.title} (${t.count})`).join(", ")
                      : "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* รายละเอียดเมื่อคลิกแถว */}
      {selectedYearData && selectedYearData.employees.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">
              รายละเอียดปี {selectedYearData.buddhistYear} ({selectedYearData.count} คน)
            </h3>
            <button
              onClick={() => setSelectedYear(null)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ✕ ปิด
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
            {selectedYearData.employees.map((emp) => (
              <div
                key={emp.id}
                className="p-3 bg-white rounded border border-gray-200 text-sm"
              >
                <div className="font-medium text-gray-800">{emp.name}</div>
                <div className="text-xs text-gray-600 mt-1 space-y-1">
                  {emp.jobTitle && (
                    <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      {emp.jobTitle}
                    </span>
                  )}
                  {emp.jobGroup && (
                    <span className="block text-gray-700">
                      <span className="font-medium">กลุ่มงาน:</span> {emp.jobGroup}
                    </span>
                  )}
                  {emp.positionType && (
                    <span className="block">
                      <span className="font-medium">ประเภท:</span> {emp.positionType}
                    </span>
                  )}
                  {emp.positionLevel && (
                    <span className="block">
                      <span className="font-medium">ระดับ:</span> {emp.positionLevel}
                    </span>
                  )}
                  <span className="block text-gray-500">
                    <span className="font-medium">อายุ:</span> {emp.age} ปี
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="mt-4 text-xs text-gray-500">
        * คำนวณจากอายุปัจจุบัน (เกษียณอายุ 60 ปี) | คลิกแถวเพื่อดูรายละเอียด
      </p>
    </div>
  );
}
