"use client";

import { useState } from "react";
import { API_FILE } from "@/lib/api";

type Props = {
  meetingId: number;
  employeeId: string;
  onClose: () => void;
  onSuccess: () => void;
};

export default function UploadAttachment({
  meetingId,
  employeeId,
  onClose,
  onSuccess
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const form = new FormData();
    form.append("file", file);

    try {
      setLoading(true);

      await API_FILE.post(
        `/meeting/${meetingId}/submit/${employeeId}`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("อัปโหลดไฟล์เรียบร้อย");
      onSuccess();
      onClose();
    } catch (err) {
      alert("อัปโหลดไม่สำเร็จ");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* modal */}
      <div className="relative bg-white rounded-xl p-6 w-full max-w-sm">
        <h3 className="font-bold mb-4 text-lg">
          อัปโหลดไฟล์รายงาน
        </h3>

        <input
          type="file"
          onChange={handleUpload}
          disabled={loading}
          className="block w-full text-sm"
        />

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            ยกเลิก
          </button>

          <button
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {loading ? "กำลังอัปโหลด..." : "เลือกไฟล์"}
          </button>
        </div>
      </div>
    </div>
  );
}
