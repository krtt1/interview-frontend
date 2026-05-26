"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import SectionPanel from "@/components/ui/SectionPanel";
import { useAuth } from "@/hooks/useAuth";
import API, { API_FILE } from "@/lib/api";
import { downloadBlob } from "@/lib/download";

// Import component ที่อยู่ในโฟลเดอร์เดียวกัน
import MeetingParticipantTable from "./MeetingParticipantTable"; 
import UploadAttachment from "./UploadAttachment";

export default function MeetingDetail() {
  const { id } = useParams();
  const router = useRouter();
  const meetingId = Number(id);

  const { user, isAdminLevel, loading: authLoading } = useAuth();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [organizerName, setOrganizerName] = useState<string>("");
  
  // State สำหรับเปิด Modal อัปโหลด
  const [showUploadModal, setShowUploadModal] = useState(false);

  const loadData = useCallback(() => {
    if (!meetingId) return;
    setLoading(true);
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

  // ดึงชื่อผู้จัด
  useEffect(() => {
    if (!data?.organizer) return;
    API.get(`/employees/${data.organizer}`)
      .then((res) => {
        const emp = res.data;
        setOrganizerName(`${emp.prefix_th ?? ""}${emp.first_name_th ?? ""} ${emp.last_name_th ?? ""}`);
      })
      .catch(() => setOrganizerName(data.organizer));
  }, [data?.organizer]);

  // ข้อมูลของตัวเราเอง
  const myRow = useMemo(() => {
    if (!data || !user) return null;
    return data.meetingEmployees?.find(
      (e: any) => String(e.employee_id) === String(user.id)
    );
  }, [data, user]);

  if (authLoading || loading) return <div className="p-6 text-center">กำลังโหลดข้อมูล...</div>;
  if (!data) return null;

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto">
      {/* ส่วนหัวข้อ */}
      <div>
        <h1 className="text-2xl font-bold">{data.meeting_title}</h1>
        <p className="text-sm text-gray-500">{data.topic}</p>
      </div>

      <SectionPanel title="รายละเอียดการอบรม">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div><b>วันที่เริ่ม:</b> {data.start_date}</div>
          <div><b>วันที่สิ้นสุด:</b> {data.end_date}</div>
          <div><b>รูปแบบ:</b> {data.meeting_type}</div>
          <div><b>สถานที่:</b> {data.location || "-"}</div>
          <div><b>ผู้จัด:</b> {organizerName}</div>
          <div><b>แหล่งงบ:</b> {data.budget_source || "-"}</div>
          <div className="md:col-span-2"><b>หมายเหตุ:</b> {data.note || "-"}</div>

          {/* ส่วนแสดงข้อมูลของฉัน + ปุ่มอัปโหลด */}
          {myRow && (
            <div className="md:col-span-2 border-t pt-4 mt-2">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-blue-700">ข้อมูลการส่งรายงานของฉัน</h3>
                {/* ปุ่มอัปโหลดจะปรากฏตรงนี้ */}
                <button 
                  onClick={() => setShowUploadModal(true)}
                  className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-700 shadow-sm"
                >
                  {myRow.attachment_file ? "🔄 แก้ไขไฟล์เอกสาร" : "📤 คลิกเพื่อส่งรายงาน"}
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                <p><b>รหัสบุคลากร:</b> {myRow.employee_id}</p>
                <p><b>วันที่ส่ง:</b> {myRow.submit_date || "-"}</p>
                <p><b>ไฟล์เอกสาร:</b> {myRow.attachment_file ? "📄 ส่งเรียบร้อย" : "❌ ยังไม่ได้ส่ง"}</p>
              </div>
            </div>
          )}
        </div>
      </SectionPanel>

      {/* เรียกใช้ Component ตารางรายชื่อ */}
      <MeetingParticipantTable 
        meetingId={meetingId} 
        onUploadSuccess={loadData} 
        initialData={data?.meetingEmployees || []}
      />

      {/* Modal สำหรับการอัปโหลด */}
      {showUploadModal && user && (
        <UploadAttachment
          meetingId={meetingId}
          employeeId={user.id}
          onClose={() => setShowUploadModal(false)}
          onSuccess={() => {
            setShowUploadModal(false);
            loadData(); // รีเฟรชหน้าจอเมื่ออัปโหลดเสร็จ
          }}
        />
      )}
    </div>
  );
}