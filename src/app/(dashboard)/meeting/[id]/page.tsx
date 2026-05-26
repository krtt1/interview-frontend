"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import SectionPanel from "@/components/ui/SectionPanel";
import { useAuth } from "@/hooks/useAuth";
import API, { API_FILE } from "@/lib/api";

// นำเข้า Component
import MeetingParticipantTable from "@/components/meeting/MeetingParticipantTable"; 
import UploadAttachment from "@/components/meeting/UploadAttachment";

export default function MeetingDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const meetingId = Number(id);

  const { user, isAdminLevel, loading: authLoading } = useAuth();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [organizerName, setOrganizerName] = useState<string>("");

  // State สำหรับเปิด/ปิด Modal อัปโหลดสำหรับส่วน "ข้อมูลของฉัน"
  const [showUploadModal, setShowUploadModal] = useState(false);

  /* ================= FETCH DATA ================= */
  const loadData = useCallback(() => {
    if (!meetingId) return;
    setLoading(true);
    // ดึงข้อมูล Meeting หลักซึ่งมีรายชื่อพนักงาน (meetingEmployees) ติดมาด้วยอยู่แล้ว
    API.get(`/meeting/${meetingId}`)
      .then((res) => setData(res.data))
      .catch(() => {
        alert("ไม่สามารถเข้าถึงข้อมูลการอบรม");
        router.push("/meeting");
      })
      .finally(() => setLoading(false));
  }, [meetingId, router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /* ================= FETCH ORGANIZER NAME ================= */
  useEffect(() => {
    if (!data?.organizer) return;
    API.get(`/employees/${data.organizer}`)
      .then((res) => {
        const emp = res.data;
        const name = `${emp.prefix_th ?? ""}${emp.first_name_th ?? ""} ${emp.last_name_th ?? ""}`;
        setOrganizerName(name.trim());
      })
      .catch(() => setOrganizerName(data.organizer));
  }, [data?.organizer]);

  /* ================= USER ROW (ข้อมูลของตัวเราเอง) ================= */
  const myRow = useMemo(() => {
    if (!data || !user) return null;
    return data.meetingEmployees?.find(
      (e: any) => String(e.employee_id) === String(user.id)
    );
  }, [data, user]);

  /* ================= DOWNLOAD (สำหรับข้อมูลของฉัน) ================= */
  const handleDownloadSelf = async () => {
    if (!myRow) return;
    try {
      const res = await API_FILE.get(
        `/meeting/${meetingId}/download/${myRow.employee_id}`,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `report_${myRow.employee_id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("ไม่พบไฟล์เอกสาร");
    }
  };

  if (authLoading || loading) return <div className="p-6 text-gray-500 text-center">กำลังโหลดข้อมูล...</div>;
  if (!data || !user) return null;

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800">{data.meeting_title}</h1>
        <p className="text-sm text-gray-500 mt-1">{data.topic}</p>
      </div>

      {/* ================= 1. รายละเอียดการอบรม (เห็นทุกคน) ================= */}
      <SectionPanel title="รายละเอียดการอบรม">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="space-y-2">
            <div><b className="text-gray-600">วันที่เริ่ม:</b> {data.start_date}</div>
            <div><b className="text-gray-600">วันที่สิ้นสุด:</b> {data.end_date}</div>
            <div><b className="text-gray-600">รูปแบบ:</b> {data.meeting_type}</div>
          </div>
          <div className="space-y-2">
            <div><b className="text-gray-600">สถานที่:</b> {data.location || "-"}</div>
            <div><b className="text-gray-600">ผู้จัด:</b> {organizerName || "-"}</div>
            <div><b className="text-gray-600">แหล่งงบ:</b> {data.budget_source || "-"}</div>
          </div>
          <div className="md:col-span-2 bg-gray-50 p-3 rounded">
            <b className="text-gray-600">หมายเหตุ:</b> {data.note || "-"}
          </div>

          {/* ================= 2. ส่วนข้อมูลของฉัน (แสดงเฉพาะ User ทั่วไป) ================= */}
          {!isAdminLevel && myRow && (
            <div className="md:col-span-2 border-t pt-6 mt-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-blue-800 flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-blue-600 rounded-full"></span>
                  ข้อมูลการส่งรายงานของฉัน
                </h3>
                <button 
                  onClick={() => setShowUploadModal(true)}
                  className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-700 transition-all shadow-md"
                >
                  {myRow.attachment_file ? "🔄 แก้ไขไฟล์เอกสาร" : "📤 คลิกเพื่อส่งรายงาน"}
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                <div><b className="text-blue-900">รหัสบุคลากร:</b> {myRow.employee_id}</div>
                <div><b className="text-blue-900">วันที่ส่งล่าสุด:</b> {myRow.submit_date || "-"}</div>
                <div><b className="text-blue-900">สถานะ:</b> {myRow.tracking_status}</div>
                <div className="flex items-center gap-2">
                  <b className="text-blue-900">ไฟล์เอกสาร:</b> 
                  {myRow.attachment_file ? (
                    <button onClick={handleDownloadSelf} className="text-blue-600 underline">📄 ดาวน์โหลดไฟล์</button>
                  ) : (
                    <span className="text-gray-400">❌ ยังไม่มีไฟล์</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </SectionPanel>

      {/* ================= 3. ตารางรายชื่อพนักงาน (แสดงเฉพาะ ADMIN เท่านั้น) ================= */}
      {/* แก้ไข: ส่ง data.meetingEmployees เข้าไปเป็น props แทนการให้ตารางไปยิง API เองเพื่อเลี่ยง Error 500 */}
      {isAdminLevel && (
        <MeetingParticipantTable 
          meetingId={meetingId} 
          initialData={data.meetingEmployees || []} 
          onUploadSuccess={loadData} 
        />
      )}

      {/* Modal อัปโหลด */}
      {showUploadModal && (
        <UploadAttachment
          meetingId={meetingId}
          employeeId={user.id}
          onClose={() => setShowUploadModal(false)}
          onSuccess={() => {
            setShowUploadModal(false);
            loadData(); 
          }}
        />
      )}
    </div>
  );
}