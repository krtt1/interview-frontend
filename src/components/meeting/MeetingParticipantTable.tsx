"use client";

import { useEffect, useState } from "react";
import API, { API_FILE } from "@/lib/api";
import { downloadBlob } from "@/lib/download";
import UploadAttachment from "./UploadAttachment";
import { useAuth } from "@/hooks/useAuth";

type Props = {
  meetingId: number;
  initialData: any[];
  onUploadSuccess: () => void;
};

export default function MeetingParticipantTable({ meetingId, initialData, onUploadSuccess }: Props) {
  const { user, isAdminLevel } = useAuth();
  const [rows, setRows] = useState<any[]>(initialData);
  const [targetEmployeeId, setTargetEmployeeId] = useState<string | null>(null);

  useEffect(() => {
    setRows(initialData);
  }, [initialData]);

  const handleDownload = async (employeeId: string) => {
    try {
      const res = await API_FILE.get(`/meeting/${meetingId}/download/${employeeId}`, { 
        responseType: "blob" 
      });
      downloadBlob(res.data, `report_${employeeId}`);
    } catch (err) {
      alert("ไม่พบไฟล์ในระบบ หรือเกิดข้อผิดพลาดในการดาวน์โหลด");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header ส่วนหัวตาราง */}
      <div className="px-6 py-5 border-b bg-gray-50/30 flex justify-between items-center">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
          รายชื่อผู้เข้าอบรมและสถานะรายงาน
        </h3>
        <span className="text-xs font-medium text-gray-500 bg-white px-3 py-1 rounded-full border shadow-sm">
          ทั้งหมด {rows.length} ท่าน
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-gray-500 bg-gray-50/50 border-b uppercase text-[11px] tracking-wider">
            <tr>
              <th className="px-6 py-4 font-bold">บุคลากร</th>
              <th className="px-6 py-4 text-center font-bold">สถานะรายงาน</th>
              <th className="px-6 py-4 text-center font-bold">ไฟล์</th>
              <th className="px-6 py-4 text-right font-bold">การจัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((row) => {
              const isMyRow = user && String(user.id) === String(row.employee_id);
              const hasFile = !!row.attachment_file;
              
              return (
                <tr key={row.employee_id} className={`hover:bg-blue-50/20 transition-colors ${isMyRow ? "bg-blue-50/40" : ""}`}>
                  {/* คอลัมน์พนักงาน: ชื่อ-นามสกุล + ID */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${isMyRow ? "text-blue-700" : "text-gray-800"}`}>
                            {row.employee?.prefix_th}{row.employee?.first_name_th} {row.employee?.last_name_th}
                          </span>
                          {isMyRow && (
                            <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold shadow-sm">
                              ฉัน
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-gray-400 font-mono">ID: {row.employee_id}</span>
                      </div>
                    </div>
                  </td>

                  {/* คอลัมน์สถานะ: Badge สีสวยๆ */}
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold shadow-sm ${
                      row.tracking_status === "ส่งแล้ว" 
                        ? "bg-emerald-100 text-emerald-700 border border-emerald-200" 
                        : "bg-amber-100 text-amber-700 border border-amber-200"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${row.tracking_status === "ส่งแล้ว" ? "bg-emerald-500" : "bg-amber-500"}`}></span>
                      {row.tracking_status}
                    </span>
                  </td>

                  {/* คอลัมน์ไฟล์: Icon บ่งบอก */}
                  <td className="px-6 py-4 text-center">
                    {hasFile ? (
                      <span className="text-xl" title="มีไฟล์แนบ">📄</span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>

                  {/* คอลัมน์จัดการ: ปุ่มกดสไตล์ Command */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {hasFile && (isAdminLevel || isMyRow) && (
                        <button 
                          onClick={() => handleDownload(row.employee_id)} 
                          className="px-4 py-1.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-100 transition-all active:scale-95"
                        >
                          ดาวน์โหลด
                        </button>
                      )}
                      
                      {(isMyRow || isAdminLevel) && (
                        <button 
                          onClick={() => setTargetEmployeeId(row.employee_id)}
                          className={`px-4 py-1.5 rounded-full text-[11px] font-bold border transition-all active:scale-95 shadow-sm ${
                            hasFile 
                              ? "bg-white text-amber-600 border-amber-200 hover:bg-amber-50" 
                              : "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700"
                          }`}
                        >
                          {hasFile ? "แก้ไขไฟล์" : "ส่งรายงาน"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {rows.length === 0 && (
          <div className="p-12 text-center text-gray-400 italic">
            ไม่พบรายชื่อผู้เข้าอบรมในระบบ
          </div>
        )}
      </div>

      {/* Modal อัปโหลด */}
      {targetEmployeeId && (
        <UploadAttachment
          meetingId={meetingId}
          employeeId={targetEmployeeId}
          onClose={() => setTargetEmployeeId(null)}
          onSuccess={() => {
            setTargetEmployeeId(null);
            onUploadSuccess();
          }}
        />
      )}
    </div>
  );
}