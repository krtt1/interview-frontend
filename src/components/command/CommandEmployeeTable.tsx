"use client";

import React, { useState } from "react";
import API from "@/lib/api";


interface CommandEmployee {
  employee_id: string | number;
  prefix_th?: string | null;      
  first_name_th?: string | null; 
  last_name_th?: string | null;  
  command_job?: string | null;   
  command_file?: string | null;  
}

type Props = {
  data: CommandEmployee[]; 
  isAdmin: boolean;
  commandId: number;
  onChanged: () => void;
  onDownload: (row: any) => void;
};

const CommandEmployeeTable: React.FC<Props> = ({
  data,
  isAdmin,
  commandId,
  onChanged,
  onDownload,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File | null>>({});
  const [isUploading, setIsUploading] = useState<string | null>(null);

  const handleRowUpload = async (employeeId: string) => {
    const file = selectedFiles[employeeId];
    if (!file) {
      alert("กรุณาเลือกไฟล์ก่อน");
      return;
    }

    try {
      setIsUploading(employeeId);
      const formData = new FormData();
      formData.append("file", file);

      await API.post(
        `/command/${commandId}/upload/${employeeId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("อัปโหลดสำเร็จ");
      setSelectedFiles((prev) => ({ ...prev, [employeeId]: null }));
      onChanged();
    } catch {
      alert("อัปโหลดไม่สำเร็จ");
    } finally {
      setIsUploading(null);
    }
  };

  return (
    <div className="overflow-x-auto border rounded-xl shadow-sm">
      <table className="min-w-full text-sm bg-white">
        <thead className="bg-gray-50 border-b">
          <tr className="text-gray-600 font-bold">
            {/* 2. เปลี่ยนหัวข้อจากรหัสเป็นรายชื่อ */}
            <th className="py-4 px-6 text-left">รายชื่อบุคลากร</th>
            <th className="py-4 px-6 text-center">หน้าที่ตามคำสั่ง</th>
            <th className="py-4 px-6 text-center">ไฟล์เอกสาร</th>
            {isAdmin && <th className="py-4 px-6 text-center">จัดการ</th>}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {data.map((e) => (
            <tr key={e.employee_id} className="hover:bg-blue-50/30 transition-colors">
              
              {/* 3. แสดงชื่อ-นามสกุล พร้อมรหัสตัวเล็กๆ ด้านล่าง */}
              <td className="py-4 px-6">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800">
                    {e.prefix_th || ""}{e.first_name_th || "ไม่ทราบชื่อ"} {e.last_name_th || ""}
                  </span>
                  <span className="text-[11px] text-gray-400 font-mono">
                    ID: {String(e.employee_id).trim()}
                  </span>
                </div>
              </td>

              <td className="py-4 px-6 text-center text-gray-600">
                {e.command_job || <span className="text-gray-300">-</span>}
              </td>

              <td className="py-4 px-6 text-center">
                {e.command_file ? (
                  <button
                    onClick={() => onDownload(e)}
                    className="px-4 py-1.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                  >
                    ดาวน์โหลด
                  </button>
                ) : (
                  <span className="text-gray-300 italic">ไม่มีไฟล์</span>
                )}
              </td>

              {isAdmin && (
                <td className="py-4 px-6">
                  <div className="flex justify-center gap-2">
                    <label className="px-4 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 cursor-pointer transition-all">
                      {selectedFiles[String(e.employee_id)] ? "เลือกแล้ว" : "เลือกไฟล์"}
                      <input
                        type="file"
                        className="hidden"
                        onChange={(ev) =>
                          setSelectedFiles((prev) => ({
                            ...prev,
                            [String(e.employee_id)]: ev.target.files?.[0] || null,
                          }))
                        }
                      />
                    </label>

                    <button
                      onClick={() => handleRowUpload(String(e.employee_id))}
                      disabled={isUploading === String(e.employee_id) || !selectedFiles[String(e.employee_id)]}
                      className="px-5 py-1.5 rounded-full text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-gray-200 disabled:text-gray-400 transition-all shadow-sm"
                    >
                      {isUploading === String(e.employee_id) ? "..." : "ยืนยัน"}
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CommandEmployeeTable;