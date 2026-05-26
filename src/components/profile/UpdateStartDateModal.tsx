"use client";

import React, { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { CurrentJob } from "@/hooks/useJobHistory";

type Props = {
  open: boolean;
  onClose: () => void;
  currentJob: CurrentJob;
  onSubmit: (historyId: number, startDate: string) => Promise<{ success: boolean; error?: string }>;
};

export default function UpdateStartDateModal({ open, onClose, currentJob, onSubmit }: Props) {
  const [startDate, setStartDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && currentJob.start_date) {
      setStartDate(currentJob.start_date);
    }
  }, [open, currentJob]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!startDate) {
      setError("กรุณาระบุวันที่เริ่มต้น");
      return;
    }

    setLoading(true);

    // Note: We need history_id, but currentJob doesn't have it
    // We'll need to get it from the job history list
    // For now, we'll assume the API can handle it with employee_id
    const result = await onSubmit(0, startDate); // TODO: Fix history_id

    setLoading(false);

    if (!result.success) {
      setError(result.error || "เกิดข้อผิดพลาด");
    } else {
      setError(null);
    }
  };

  const handleClose = () => {
    setStartDate("");
    setError(null);
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="แก้ไขวันที่เริ่มต้น">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Current Info */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <div>
            <span className="text-xs text-gray-500">ตำแหน่งปัจจุบัน</span>
            <p className="text-sm font-medium text-gray-800">{currentJob.current_job.job_group_name}</p>
          </div>
          <div>
            <span className="text-xs text-gray-500">วันที่เริ่มต้นปัจจุบัน</span>
            <p className="text-sm font-medium text-gray-800">
              {currentJob.start_date
                ? new Date(currentJob.start_date).toLocaleDateString("th-TH", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "ไม่ระบุ"}
            </p>
          </div>
        </div>

        {/* New Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            วันที่เริ่มต้นใหม่ <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            * สามารถแก้ไขได้เฉพาะตำแหน่งปัจจุบัน
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "กำลังบันทึก..." : "บันทึก"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
