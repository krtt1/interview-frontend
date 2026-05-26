"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import API from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import SectionPanel from "@/components/ui/SectionPanel";
import CommandEmployeeTable from "@/components/command/CommandEmployeeTable";

/* ================= TYPES ================= */
type CommandEmployee = {
  employee_id: string;
  command_job?: string | null;
  command_file?: string | null;
  employee?: {
    prefix_th?: string;
    first_name_th?: string;
    last_name_th?: string;
  };
};

type CommandDetail = {
  command_id: number;
  command_title: string;
  command_detail: string;
  date: string;
  note?: string | null;
  commandEmployees: CommandEmployee[];
};

/* ================= PAGE ================= */
const CommandDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const commandId = params?.id as string;

  const { user, loading: authLoading } = useAuth();
  const isAdminLevel =
    user?.role === "admin" || user?.role === "superadmin";

  const [data, setData] = useState<CommandDetail | null>(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH DETAIL ================= */
  const fetchDetail = useCallback(async () => {
    if (!commandId) return;
    try {
      setLoading(true);
      const res = await API.get(`/command/${commandId}`);
      setData(res.data);
    } catch {
      alert("ไม่พบข้อมูลคำสั่ง");
      router.push("/command");
    } finally {
      setLoading(false);
    }
  }, [commandId, router]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  /* ================= VIEW MODEL ================= */
  const myDocument = useMemo(() => {
    if (!data || !user) return null;
    return data.commandEmployees?.find(
      (e) => String(e.employee_id) === String(user.id)
    ) || null;
  }, [data, user]);

  /* ================= DOWNLOAD ================= */
  const handleDownload = async (row: CommandEmployee) => {
    try {
      const res = await API.get(
        `/command/${commandId}/download/${row.employee_id}`,
        { responseType: "blob" }
      );

      const disposition = res.headers["content-disposition"];
      let ext = "";
      if (disposition) {
        const m = disposition.match(/filename="?(.+?)"?$/);
        if (m?.[1]) ext = m[1].substring(m[1].lastIndexOf("."));
      }

      const filename = `${row.employee_id}_${data?.command_title}${ext}`;
      const blob = new Blob([res.data], {
        type: res.headers["content-type"],
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("ดาวน์โหลดไฟล์ไม่สำเร็จ");
    }
  };

  if (authLoading || loading) {
    return <div className="p-6 text-center">กำลังโหลด...</div>;
  }

  if (!data || !user) return null;

  return (
    <div className="p-4 space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold">{data.command_title}</h1>
        <p className="text-sm text-gray-500">
          ประเภท: {data.command_detail}
        </p>
      </div>

      <SectionPanel title="รายละเอียดคำสั่ง">
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div><strong>วันที่คำสั่ง:</strong> {data.date}</div>
          <div><strong>หมายเหตุ:</strong> {data.note || "-"}</div>

          {!isAdminLevel && myDocument && (
            <>
              <div className="md:col-span-2 border-t pt-4 mt-2" />
              <div><strong>รหัสบุคลากร:</strong> {String(myDocument.employee_id).trim()}</div>
              <div><strong>ชื่อ:</strong> {myDocument.employee?.prefix_th}{myDocument.employee?.first_name_th} {myDocument.employee?.last_name_th}</div>
              <div><strong>หน้าที่ตามคำสั่ง:</strong> {myDocument.command_job || "-"}</div>
              <div>
                <strong>ไฟล์เอกสาร:</strong>{" "}
                {myDocument.command_file ? (
                  <button
                    onClick={() => handleDownload(myDocument)}
                    className="ml-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold"
                  >
                    ดาวน์โหลด
                  </button>
                ) : (
                  <span className="ml-2 text-gray-400">ยังไม่มีไฟล์</span>
                )}
              </div>
            </>
          )}
        </div>

        {isAdminLevel && (
          <>
            <div className="border-t pt-4 mt-6 mb-2 font-semibold">
              บุคลากรที่เกี่ยวข้องและเอกสาร
            </div>

            <CommandEmployeeTable
            data={data.commandEmployees.map((e) => ({
            ...e,
            prefix_th: e.employee?.prefix_th ?? null,
            first_name_th: e.employee?.first_name_th ?? null,
            last_name_th: e.employee?.last_name_th ?? null,
            command_job: e.command_job ?? null, 
            }))}
            isAdmin={isAdminLevel}
            commandId={Number(commandId)}
            onChanged={fetchDetail}
            onDownload={handleDownload}
            />
          </>
        )}
      </SectionPanel>
    </div>
  );
};

export default CommandDetailPage;
