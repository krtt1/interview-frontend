"use client";

import React, { useState } from "react";
import Modal from "@/components/ui/Modal";

type Props = {
  open: boolean;
  onClose: () => void;
  employeeId: string;
  currentJobGroup: string;
  jobGroups: { id: string; name: string }[];
  positionTypes: { id: string; name: string }[];
  positionLevels: { id: string; name: string }[];
  onSubmit: (
    newJobGroupId: number, 
    startDate: string, 
    positionTypeId: number | null, 
    positionLevelId: number | null
  ) => Promise<{ success: boolean; error?: string }>;
};

export default function ChangeJobModal({
  open,
  onClose,
  employeeId,
  currentJobGroup,
  jobGroups,
  positionTypes,
  positionLevels,
  onSubmit,
}: Props) {
  const [newJobGroupId, setNewJobGroupId] = useState("");
  const [positionTypeId, setPositionTypeId] = useState("");
  const [positionLevelId, setPositionLevelId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!newJobGroupId) {
      setError("กรุณาเลือกตำแหน่งใหม่");
      return;
    }

    if (!startDate) {
      setError("กรุณาระบุวันที่เริ่มต้น");
      return;
    }

    setLoading(true);

    const result = await onSubmit(
      parseInt(newJobGroupId), 
      startDate,
      positionTypeId ? parseInt(positionTypeId) : null,
      positionLevelId ? parseInt(positionLevelId) : null
    );

    setLoading(false);

    if (!result.success) {
      setError(result.error || "เกิดข้อผิดพลาด");
    } else {
      // Reset form
      setNewJobGroupId("");
      setPositionTypeId("");
      setPositionLevelId("");
      setStartDate("");
      setError(null);
    }
  };

  const handleClose = () => {
    setNewJobGroupId("");
    setPositionTypeId("");
    setPositionLevelId("");
    setStartDate("");
    setError(null);
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="เปลี่ยนตำแหน่งงาน">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Current Info */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <div>
            <span className="text-xs text-gray-500">รหัสบัตรประชาชน</span>
            <p className="text-sm font-medium text-gray-800">{employeeId}</p>
          </div>
          <div>
            <span className="text-xs text-gray-500">ตำแหน่งปัจจุบัน</span>
            <p className="text-sm font-medium text-gray-800">{currentJobGroup}</p>
          </div>
        </div>

        {/* New Job Group */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ตำแหน่งใหม่ <span className="text-red-500">*</span>
          </label>
          <select
            value={newJobGroupId}
            onChange={(e) => setNewJobGroupId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">-- เลือกกลุ่มงาน --</option>
            {jobGroups.map((jg, index) => (
              <option key={`jg-${jg.id || index}`} value={jg.id}>
                {jg.name}
              </option>
            ))}
          </select>
        </div>

        {/* Position Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ประเภทตำแหน่ง
          </label>
          <select
            value={positionTypeId}
            onChange={(e) => setPositionTypeId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">-- เลือกประเภทตำแหน่ง --</option>
            {positionTypes && Array.isArray(positionTypes) && positionTypes.length > 0 ? (
              positionTypes.map((pt, index) => (
                <option key={`pt-${pt.id || index}`} value={pt.id}>
                  {pt.name}
                </option>
              ))
            ) : (
              <option disabled>ไม่มีข้อมูล</option>
            )}
          </select>
        </div>

        {/* Position Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ระดับตำแหน่ง
          </label>
          <select
            value={positionLevelId}
            onChange={(e) => setPositionLevelId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">-- เลือกระดับตำแหน่ง --</option>
            {positionLevels && Array.isArray(positionLevels) && positionLevels.length > 0 ? (
              positionLevels.map((pl, index) => (
                <option key={`pl-${pl.id || index}`} value={pl.id}>
                  {pl.name}
                </option>
              ))
            ) : (
              <option disabled>ไม่มีข้อมูล</option>
            )}
          </select>
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            วันที่เริ่มต้น <span className="text-red-500">*</span>
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
            * ตำแหน่งเก่าจะถูกปิดอัตโนมัติในวันก่อนหน้า
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
