"use client";

import React, { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { useJobHistory } from "@/hooks/useJobHistory";
import ChangeJobModal from "@/components/profile/ChangeJobModal";
import InitializeJobHistoryModal from "@/components/profile/InitializeJobHistoryModal";
import API from "@/lib/api";

type Props = {
  open: boolean;
  onClose: () => void;
  employeeId: string;
  jobGroups: { id: string; name: string }[];
  positionTypes?: { id: string; name: string }[];
  positionLevels?: { id: string; name: string }[];
};

export default function JobHistoryDetailModal({ open, onClose, employeeId, jobGroups, positionTypes, positionLevels }: Props) {
  const { history, currentJob, loading, error, refresh, changeJobGroup, updateStartDate, initializeJobHistory } =
    useJobHistory(employeeId);

  const [employeeName, setEmployeeName] = useState<string>("");
  const [changeJobOpen, setChangeJobOpen] = useState(false);
  const [initializeOpen, setInitializeOpen] = useState(false);

  // Fetch employee name
  useEffect(() => {
    if (open && employeeId) {
      API.get(`/employees/${employeeId}`)
        .then((res) => {
          const emp = res.data;
          setEmployeeName(`${emp.prefix_th}${emp.first_name_th} ${emp.last_name_th}`);
        })
        .catch((err) => {
          console.error("Error fetching employee:", err);
          setEmployeeName("ไม่ทราบชื่อ");
        });
    }
  }, [open, employeeId]);

  const currentJobRecord = history.find((h) => h.is_current);
  const pastJobs = history.filter((h) => !h.is_current);
  const hasNoHistory = history.length === 0;

  const handleUpdateStartDate = async () => {
    if (!currentJobRecord) return;

    const newDate = prompt(
      "กรุณาระบุวันที่เริ่มต้นใหม่ (YYYY-MM-DD):",
      currentJobRecord.start_date || ""
    );

    if (!newDate) return;

    const result = await updateStartDate(currentJobRecord.history_id, newDate);

    if (result.success) {
      alert("แก้ไขวันที่สำเร็จ");
      await refresh();
    } else {
      alert(result.error || "เกิดข้อผิดพลาด");
    }
  };

  const handleExportToExcel = async () => {
    try {
      const response = await API.get(`/employees/${employeeId}/job-history/export`, {
        responseType: 'blob',
      });

      // สร้าง URL สำหรับดาวน์โหลด
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // ตั้งชื่อไฟล์
      const fileName = `JobHistory_${employeeId}_${employeeName.replace(/\s+/g, '_')}_${Date.now()}.xlsx`;
      link.setAttribute('download', fileName);
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('Error exporting to Excel:', err);
      alert(err?.response?.data?.message || 'ไม่สามารถ Export ไฟล์ได้');
    }
  };

  return (
    <>
      <Modal open={open} onClose={onClose} title="จัดการประวัติการทำงาน" size="large">
        <div className="space-y-6">
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

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500">กำลังโหลด...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Job History Content */}
          {!loading && !error && (
            <>
              {/* Action Buttons */}
              <div className="flex gap-2 flex-wrap">
                {/* Export Button - แสดงเมื่อมีประวัติการทำงาน */}
                {!hasNoHistory && (
                  <button
                    onClick={handleExportToExcel}
                    className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm hover:bg-green-700 transition-colors flex items-center gap-2"
                    title="Export เป็นไฟล์ Excel"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export Excel
                  </button>
                )}
                
                {hasNoHistory ? (
                  <button
                    onClick={() => setInitializeOpen(true)}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition-colors"
                  >
                    + สร้างประวัติการทำงาน
                  </button>
                ) : (
                  <button
                    onClick={() => setChangeJobOpen(true)}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition-colors"
                  >
                    + เปลี่ยนตำแหน่ง
                  </button>
                )}
              </div>

              {/* Current Job */}
              {currentJob && currentJobRecord && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-semibold text-blue-600">ตำแหน่งปัจจุบัน</span>
                  </div>
                  <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-base font-semibold text-gray-800">
                            {currentJobRecord.job_group?.job_group_name || 'ไม่มีข้อมูลกลุ่มงาน'}
                          </p>
                          {currentJobRecord.position_type && (
                            <p className="text-sm text-gray-600 mt-1">
                              <span className="font-medium">ประเภท:</span> {currentJobRecord.position_type.position_type_name}
                            </p>
                          )}
                          {currentJobRecord.position_level && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">ระดับ:</span> {currentJobRecord.position_level.position_level_name}
                            </p>
                          )}
                          <p className="text-sm text-gray-600 mt-2">
                            <span className="font-medium">เริ่มต้น:</span>{" "}
                            {currentJobRecord.start_date
                              ? new Date(currentJobRecord.start_date).toLocaleDateString("th-TH", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })
                              : "ไม่ระบุ"}
                          </p>
                          {currentJobRecord.start_date && currentJobRecord.duration && (
                            <p className="text-sm text-blue-700 font-medium mt-1">
                              <span className="font-medium">ระยะเวลา:</span> {currentJobRecord.duration.years} ปี {currentJobRecord.duration.months} เดือน {currentJobRecord.duration.days} วัน
                            </p>
                          )}
                        </div>
                        <button
                          onClick={handleUpdateStartDate}
                          className="px-3 py-1 rounded-md bg-white border border-gray-300 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          แก้ไขวันที่
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Past Jobs */}
              {pastJobs.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-semibold text-gray-700">ประวัติย้อนหลัง</span>
                  </div>
                  <div className="space-y-3">
                    {pastJobs.map((job) => (
                      <div
                        key={job.history_id}
                        className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                      >
                        <p className="text-base font-medium text-gray-800">{job.job_group.job_group_name}</p>
                        {job.position_type && (
                          <p className="text-sm text-gray-600 mt-1">
                            <span className="font-medium">ประเภท:</span> {job.position_type.position_type_name}
                          </p>
                        )}
                        {job.position_level && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">ระดับ:</span> {job.position_level.position_level_name}
                          </p>
                        )}
                        <p className="text-sm text-gray-600 mt-2">
                          <span className="font-medium">ระยะเวลา:</span>{" "}
                          {job.start_date
                            ? new Date(job.start_date).toLocaleDateString("th-TH", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : "ไม่ระบุ"}
                          {" - "}
                          {job.end_date
                            ? new Date(job.end_date).toLocaleDateString("th-TH", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : "ปัจจุบัน"}
                        </p>
                        {job.duration && job.start_date && (
                          <p className="text-sm text-gray-500 mt-1">
                            <span className="font-medium">ระยะเวลา:</span> {job.duration.years} ปี {job.duration.months} เดือน{" "}
                            {job.duration.days} วัน
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No History */}
              {hasNoHistory && (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500 mb-4">ยังไม่มีประวัติการทำงาน</p>
                  <button
                    onClick={() => setInitializeOpen(true)}
                    className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm hover:bg-green-700 transition-colors"
                  >
                    + สร้างประวัติการทำงาน
                  </button>
                </div>
              )}
            </>
          )}

          {/* Close Button */}
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              ปิด
            </button>
          </div>
        </div>
      </Modal>

      {/* Initialize Job History Modal */}
      <InitializeJobHistoryModal
        open={initializeOpen}
        onClose={() => setInitializeOpen(false)}
        employeeId={employeeId}
        employeeName={employeeName}
        jobGroups={jobGroups}
        positionTypes={positionTypes || []}
        positionLevels={positionLevels || []}
        onSubmit={async (jobGroupId, startDate, positionTypeId, positionLevelId) => {
          const result = await initializeJobHistory(jobGroupId, startDate, positionTypeId, positionLevelId);
          if (result.success) {
            setInitializeOpen(false);
            await refresh();
          }
          return result;
        }}
      />

      {/* Change Job Modal */}
      <ChangeJobModal
        open={changeJobOpen}
        onClose={() => setChangeJobOpen(false)}
        employeeId={employeeId}
        currentJobGroup={currentJob?.current_job.job_group_name || "ไม่ระบุ"}
        jobGroups={jobGroups}
        positionTypes={positionTypes || []}
        positionLevels={positionLevels || []}
        onSubmit={async (newJobGroupId, startDate, positionTypeId, positionLevelId) => {
          const result = await changeJobGroup(newJobGroupId, startDate, positionTypeId, positionLevelId);
          if (result && result.success) {
            setChangeJobOpen(false);
            await refresh();
          }
          return result || { success: false, error: "เกิดข้อผิดพลาด" };
        }}
      />
    </>
  );
}
