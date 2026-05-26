"use client";

import React, { useState, useEffect, useMemo } from "react";
import Modal from "@/components/ui/Modal";

type Props = {
  open: boolean;
  onClose: () => void;
  employeeId: string;
  employeeName: string;
  jobGroups: { id: string; name: string }[];
  positionTypes: { id: string; name: string }[];
  positionLevels: { id: string; name: string }[];
  onSubmit: (
    jobGroupId: number, 
    startDate: string | null, 
    positionTypeId: number | null, 
    positionLevelId: number | null
  ) => Promise<{ success: boolean; error?: string }>;
};

export default function InitializeJobHistoryModal({
  open,
  onClose,
  employeeId,
  employeeName,
  jobGroups,
  positionTypes,
  positionLevels,
  onSubmit,
}: Props) {
  const [jobGroupId, setJobGroupId] = useState("");
  const [positionTypeId, setPositionTypeId] = useState("");
  const [positionLevelId, setPositionLevelId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // แปลง jobGroups ให้เป็น Array ที่ถูกต้อง
  const jobGroupsArray = useMemo(() => {
    if (Array.isArray(jobGroups)) {
      return jobGroups.map((jg: any) => ({
        id: String(jg.job_group_id || jg.id),
        name: String(jg.job_group_name || jg.name),
      }));
    }
    if (jobGroups && typeof jobGroups === 'object') {
      return Object.entries(jobGroups).map(([id, value]: [string, any]) => {
        if (typeof value === 'object' && value !== null) {
          return {
            id: String(value.job_group_id || id),
            name: String(value.job_group_name || value.name),
          };
        }
        return { id: String(id), name: String(value) };
      });
    }
    return [];
  }, [jobGroups]);

  // แปลง positionTypes ให้เป็น Array
  const positionTypesArray = useMemo(() => {
    if (Array.isArray(positionTypes)) {
      return positionTypes.map((pt: any) => ({
        id: String(pt.position_type_id || pt.id),
        name: String(pt.position_type_name || pt.name),
      }));
    }
    if (positionTypes && typeof positionTypes === 'object') {
      return Object.entries(positionTypes).map(([id, value]: [string, any]) => {
        if (typeof value === 'object' && value !== null) {
          return {
            id: String(value.position_type_id || id),
            name: String(value.position_type_name || value.name),
          };
        }
        return { id: String(id), name: String(value) };
      });
    }
    return [];
  }, [positionTypes]);

  // แปลง positionLevels ให้เป็น Array
  const positionLevelsArray = useMemo(() => {
    if (Array.isArray(positionLevels)) {
      return positionLevels.map((pl: any) => ({
        id: String(pl.position_level_id || pl.id),
        name: String(pl.position_level_name || pl.name),
      }));
    }
    if (positionLevels && typeof positionLevels === 'object') {
      return Object.entries(positionLevels).map(([id, value]: [string, any]) => {
        if (typeof value === 'object' && value !== null) {
          return {
            id: String(value.position_level_id || id),
            name: String(value.position_level_name || value.name),
          };
        }
        return { id: String(id), name: String(value) };
      });
    }
    return [];
  }, [positionLevels]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!jobGroupId) {
      setError("กรุณาเลือกกลุ่มงาน");
      return;
    }

    if (!startDate) {
      setError("กรุณาระบุวันที่เริ่มต้น");
      return;
    }

    setLoading(true);

    const result = await onSubmit(
      parseInt(jobGroupId), 
      startDate,
      positionTypeId ? parseInt(positionTypeId) : null,
      positionLevelId ? parseInt(positionLevelId) : null
    );

    setLoading(false);

    if (!result.success) {
      setError(result.error || "เกิดข้อผิดพลาด");
    } else {
      // Reset form
      setJobGroupId("");
      setPositionTypeId("");
      setPositionLevelId("");
      setStartDate("");
      setError(null);
      onClose();
    }
  };

  const handleClose = () => {
    setJobGroupId("");
    setPositionTypeId("");
    setPositionLevelId("");
    setStartDate("");
    setError(null);
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="สร้างประวัติการทำงาน">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Employee Info */}
        <div className="bg-blue-50 rounded-lg p-4 space-y-2">
          <div>
            <span className="text-xs text-gray-500">รหัสบัตรประชาชน</span>
            <p className="text-sm font-medium text-gray-800">{employeeId}</p>
          </div>
          <div>
            <span className="text-xs text-gray-500">ชื่อ-นามสกุล</span>
            <p className="text-sm font-medium text-gray-800">{employeeName}</p>
          </div>
        </div>

        {/* Job Group */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            กลุ่มงานปัจจุบัน <span className="text-red-500">*</span>
          </label>
          <select
            value={jobGroupId}
            onChange={(e) => setJobGroupId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">-- เลือกกลุ่มงาน --</option>
            {jobGroupsArray.map((jg, index) => (
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
            {positionTypesArray && positionTypesArray.length > 0 ? (
              positionTypesArray.map((pt, index) => (
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
            {positionLevelsArray && positionLevelsArray.length > 0 ? (
              positionLevelsArray.map((pl, index) => (
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
        </div>

        {/* Info Message */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-xs text-yellow-800">
            ใช้สำหรับพนักงานเก่าที่ยังไม่มีประวัติการทำงานในระบบ
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
            {loading ? "กำลังสร้าง..." : "สร้างประวัติ"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
