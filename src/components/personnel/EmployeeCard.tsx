"use client";
import React from "react";
import { UIEmployee, WorkStatus } from "@/hooks/useEmployees";

// สีและสไตล์สำหรับแต่ละสถานะ
const STATUS_STYLES: Record<WorkStatus, { bg: string; text: string; dot: string }> = {
  'ปฏิบัติหน้าที่': { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
  'หมดสัญญา': { bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-500' },
  'โอนย้าย': { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
  'ลาออก': { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
  'เสียชีวิต': { bg: 'bg-gray-200', text: 'text-gray-700', dot: 'bg-gray-600' },
};

type Props = {
  emp: UIEmployee;
  onOpenDetail: (emp: UIEmployee) => void;
  onEdit?: (emp: UIEmployee) => void;     // ← ทำให้เป็น optional
  onDelete?: (id: string) => void;        // ← ทำให้เป็น optional
};

const EmployeeCard: React.FC<Props> = ({ emp, onOpenDetail, onEdit, onDelete }) => {
  const status = emp.workStatus ?? 'ปฏิบัติหน้าที่';
  const style = STATUS_STYLES[status];

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border flex flex-col gap-3">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="text-xl font-semibold">{emp.name}</div>
        <div className="text-sm px-2 py-1 rounded bg-gray-100 text-gray-700">
          {(emp as any).position || emp.role}
        </div>
      </div>

      {/* WORK STATUS BADGE */}
      <div className="flex items-center">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
          <span className={`w-2 h-2 rounded-full ${style.dot}`}></span>
          {status}
        </span>
      </div>

      {/* BASIC INFO */}
      <div className="text-sm text-gray-600 space-y-1">
        <div>เพศ: {emp.gender ?? "—"}</div>
        <div>อายุ: {emp.age ? `${emp.age} ปี` : "—"}</div>
        <div>โทร: {emp.phone ?? "—"}</div>
        <div className="text-xs text-gray-400">
          สร้างเมื่อ: {emp.createdAt ? new Date(emp.createdAt).toLocaleString() : "—"}
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-2 pt-2">
        <button
          onClick={() => onOpenDetail(emp)}
          className="flex-1 px-3 py-2 border rounded text-sm bg-blue-500 text-white"
        >
          ดูรายละเอียด
        </button>

        {/* แสดงปุ่มแก้ไขเฉพาะถ้ามี onEdit */}
        {onEdit && (
          <button
            onClick={() => onEdit(emp)}
            className="px-3 py-2 bg-yellow-500 text-white rounded text-sm"
          >
            แก้ไข
          </button>
        )}

        {/* แสดงปุ่มลบเฉพาะถ้ามี onDelete */}
        {onDelete && (
          <button
            onClick={() => onDelete(emp.id)}
            className="px-3 py-2 bg-red-600 text-white rounded text-sm"
          >
            ลบ
          </button>
        )}
      </div>
    </div>
  );
};

export default EmployeeCard;