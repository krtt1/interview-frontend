"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import API from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import SectionPanel from "@/components/ui/SectionPanel";

import CommandEmployeeTable from "./CommandEmployeeTable";
import UploadCommandAttachment from "./UploadCommandAttachment";

/* ================= TYPES ================= */
type CommandEmployee = {
  id: number;
  employee_id: string;
  command_file?: string | null;
};

type CommandDetail = {
  command_id: number;
  command_title: string;
  command_detail: string;
  date: string;
  note?: string | null;
  commandEmployees: CommandEmployee[];
};

/* ================= COMPONENT ================= */
const CommandDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const commandId = params?.id as string;

  const { user, loading: authLoading } = useAuth();
  const isAdminLevel = user?.role !== "user";

  const [data, setData] = useState<CommandDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadEmployeeId, setUploadEmployeeId] = useState("");

  /* ================= FETCH DETAIL ================= */
  useEffect(() => {
    if (!commandId) return;

    const fetchDetail = async () => {
      try {
        const res = await API.get(`/command/${commandId}`);
        setData(res.data);
      } catch {
        alert("ไม่พบข้อมูลคำสั่ง");
        router.push("/command");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [commandId, router]);

  /* ================= DOWNLOAD ================= */
  const handleDownload = async (employeeId: string) => {
    try {
      const res = await API.get(
        `/command/${commandId}/download/${employeeId}`,
        { responseType: "blob" }
      );

      const blob = new Blob([res.data]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `command_${commandId}_${employeeId}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("ดาวน์โหลดไฟล์ไม่สำเร็จ");
    }
  };

  /* ================= RELOAD ================= */
  const reloadDetail = async () => {
    const res = await API.get(`/command/${commandId}`);
    setData(res.data);
  };

  /* ================= UPLOAD ================= */
  const handleUpload = async () => {
    if (!uploadFile || !uploadEmployeeId) {
      alert("กรุณาเลือกไฟล์และระบุรหัสบุคลากร");
      return;
    }

    try {
      const formData = new FormData();
      formData.append(uploadEmployeeId, uploadFile);

      await API.post(`/command/create`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("อัปโหลดสำเร็จ");
      setUploadFile(null);
      setUploadEmployeeId("");

      await reloadDetail();
    } catch {
      alert("อัปโหลดไม่สำเร็จ");
    }
  };

  if (authLoading || loading) {
    return <div className="p-6">กำลังโหลดข้อมูล...</div>;
  }

  if (!data) return null;

  /* ================= UI ================= */
  return (
    <div className="p-4 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">{data.command_title}</h1>
        <p className="text-sm text-gray-500">
          ประเภทคำสั่ง: {data.command_detail}
        </p>
      </div>

      {/* DETAIL */}
      <SectionPanel title="รายละเอียดคำสั่ง">
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>วันที่คำสั่ง: {data.date}</div>
          <div className="md:col-span-2">
            หมายเหตุ: {data.note || "-"}
          </div>
        </div>
      </SectionPanel>

      {/* EMPLOYEE TABLE */}
      <SectionPanel title="บุคลากรที่เกี่ยวข้อง">
        <CommandEmployeeTable
          data={data.commandEmployees}
          isAdmin={isAdminLevel}
          commandId={Number(commandId)}
          onChanged={reloadDetail}
          onDownload={(row) => handleDownload(row.employee_id)}
        />
      </SectionPanel>

      {/* UPLOAD (ADMIN ONLY) */}
      {isAdminLevel && (
        <SectionPanel title="อัปโหลดไฟล์คำสั่ง">
          <div className="grid md:grid-cols-3 gap-3 items-end">
            <input
              placeholder="รหัสบุคลากร"
              className="border p-2 rounded text-sm"
              value={uploadEmployeeId}
              onChange={(e) => setUploadEmployeeId(e.target.value)}
            />

            <UploadCommandAttachment onChange={setUploadFile} />

            <button
              onClick={handleUpload}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              อัปโหลด
            </button>
          </div>
        </SectionPanel>
      )}
    </div>
  );
};

export default CommandDetailPage;
