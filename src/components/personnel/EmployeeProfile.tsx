"use client";
import React from "react";
import Image from "next/image";
import { UIEmployee, WorkStatus } from "@/hooks/useEmployees";

// สีและสไตล์สำหรับแต่ละสถานะ
const STATUS_STYLES: Record<WorkStatus, { bg: string; text: string; dot: string }> = {
  'ปฏิบัติหน้าที่': { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
  'หมดสัญญา': { bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-500' },
  'โอนย้าย': { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
  'ลาออก': { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
  'เสียชีวิต': { bg: 'bg-gray-200', text: 'text-gray-700', dot: 'bg-gray-600' },
};

export interface EmployeeProfileProps {
  employee: UIEmployee;
  onEdit?: (emp: UIEmployee) => void;
  onDelete?: (id: string) => void;
  onView?: (emp: UIEmployee) => void;
}

const EmployeeProfile: React.FC<EmployeeProfileProps> = ({ employee, onEdit, onDelete, onView }) => {
  const name = employee.name || "—";
  const position = (employee as any).position || "—";
  const phone = employee.phone && employee.phone.trim() !== "" ? employee.phone : "—";
  const age = employee.age != null ? `${employee.age} ปี` : "—";
  const gender = employee.gender || "—";
  const role = employee.role || "—";
  const workStatus = employee.workStatus ?? 'ปฏิบัติหน้าที่';
  const statusStyle = STATUS_STYLES[workStatus];

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <div className="flex gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
          <Image
            src={(employee as any).image || "/avatars/default.jpg"}
            alt={name}
            width={64}
            height={64}
            className="object-cover"
          />
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg text-gray-800">{name}</h3>
              <div className="text-sm text-gray-500">{position}</div>
            </div>

            <div className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">{role}</div>
          </div>

          {/* WORK STATUS BADGE */}
          <div className="mt-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
              <span className={`w-2 h-2 rounded-full ${statusStyle.dot}`}></span>
              {workStatus}
            </span>
          </div>

          <div className="mt-3 text-sm text-gray-600 space-y-1">
            <div>เพศ: {gender}</div>
            <div>อายุ: {age}</div>
            <div>โทร: {phone}</div>
          </div>

          <div className="mt-3 flex gap-2">
            <button onClick={() => onView?.(employee)} className="px-3 py-2 border rounded text-sm">ดูรายละเอียด</button>
            <button onClick={() => onEdit?.(employee)} className="px-3 py-2 bg-yellow-500 text-white rounded text-sm">แก้ไข</button>
            <button onClick={() => onDelete?.(employee.id)} className="px-3 py-2 bg-red-600 text-white rounded text-sm">ลบ</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;