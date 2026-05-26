"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useEmployees, WORK_STATUS_OPTIONS, WorkStatus } from "@/hooks/useEmployees";

import InfoCard from "@/components/ui/InfoCard";
import SectionPanel from "@/components/ui/SectionPanel";
import PersonnelPieChart from "@/components/chart/PersonnelPieChart";

import EmployeeCard from "@/components/personnel/EmployeeCard";
import EmployeeDetailModal from "@/components/personnel/EmployeeDetailModal";
import EmployeeFormModal from "@/components/personnel/EmployeeFormModal";

const ITEMS_PER_PAGE = 9; // กำหนดจำนวนต่อหน้า (3x3 เหมาะสำหรับ Grid)

const EmployeePage: React.FC = () => {
  const {
    filtered = [],
    search = "",
    setSearch = (() => {}),
    isModalOpen = false,
    openForm = (() => {}),
    closeForm = (() => {}),
    editing = null,
    form = null,
    setForm = (() => {}),
    save = (() => {}),
    remove = (() => {}),

    // detail modal
    detailOpen = false,
    detailEmp = null,
    openDetail = (() => {}),
    closeDetail = (() => {}),

    // stats
    totalCountVisible = 0,
    genderCounts = {},
    genderChartData = [],

    // role
    isAdmin = false,

    // masters
    jobTitles = [],
    positionLevels = [],
    positionTypes = [],

    // loading
    loading = false,
  } = useEmployees() as any;

  /* --- Pagination Logic --- */
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<WorkStatus | "">("");
  const [jobTitleFilter, setJobTitleFilter] = useState<string>("");
  const [positionTypeFilter, setPositionTypeFilter] = useState<string>("");

  // คำนวณจำนวนหน้าทั้งหมด (หลังกรองทั้งหมด)
  const filteredByAll = useMemo(() => {
    let result = filtered;

    // กรองตามสถานะ
    if (statusFilter) {
      result = result.filter((emp: any) => emp.workStatus === statusFilter);
    }

    // กรองตาม job_title
    if (jobTitleFilter) {
      result = result.filter((emp: any) => 
        String(emp.raw?.job_title_id) === jobTitleFilter
      );
    }

    // กรองตาม position_type
    if (positionTypeFilter) {
      result = result.filter((emp: any) => 
        String(emp.raw?.position_type_id) === positionTypeFilter
      );
    }

    return result;
  }, [filtered, statusFilter, jobTitleFilter, positionTypeFilter]);

  const totalPages = Math.ceil((filteredByAll?.length || 0) / ITEMS_PER_PAGE);

  // ตัดข้อมูลมาแสดงเฉพาะหน้าที่เลือก
  const paginatedEmployees = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredByAll.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredByAll, currentPage]);

  // เมื่อมีการค้นหาหรือเปลี่ยน filter ให้ดีดกลับไปหน้า 1
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, jobTitleFilter, positionTypeFilter]);

  /* --- Maps Conversion --- */
  const jobTitlesMap = useMemo(() => {
    return (jobTitles ?? []).reduce((acc: Record<string, string>, t: any) => {
      const id = String(t.id ?? t.job_title_id ?? "");
      const name = t.name ?? t.job_title_name ?? "";
      if (id) acc[id] = name;
      return acc;
    }, {});
  }, [jobTitles]);

  const positionLevelsMap = useMemo(() => {
    return (positionLevels ?? []).reduce((acc: Record<string, string>, l: any) => {
      const id = String(l.id ?? l.position_level_id ?? "");
      const name = l.name ?? l.position_level_name ?? "";
      if (id) acc[id] = name;
      return acc;
    }, {});
  }, [positionLevels]);

  const positionTypesMap = useMemo(() => {
    return (positionTypes ?? []).reduce((acc: Record<string, string>, p: any) => {
      const id = String(p.id ?? p.position_type_id ?? "");
      const name = p.name ?? p.position_type_name ?? "";
      if (id) acc[id] = name;
      return acc;
    }, {});
  }, [positionTypes]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">ข้อมูลบุคลากร</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            ข้อมูลบุคลากรจากฐานข้อมูลกลางขององค์กร
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <InfoCard
          title="บุคลากรทั้งหมด"
          value={totalCountVisible}
          unit="คน"
          subText="ข้อมูลตามสิทธิ์การเข้าถึง"
          color="border-blue-500"
        />
        <InfoCard
          title="บุคลากรชาย"
          value={genderCounts?.["ชาย"] ?? 0}
          unit="คน"
          color="border-green-500"
        />
        <InfoCard
          title="บุคลากรหญิง"
          value={genderCounts?.["หญิง"] ?? 0}
          unit="คน"
          color="border-pink-500"
        />
      </div>

      {/* Chart */}
      <SectionPanel title="สัดส่วนบุคลากรตามเพศ" heightClass="min-h-[360px]" paddingClass="p-4 sm:p-6" showHint={false}>
        <PersonnelPieChart data={genderChartData ?? []} isLoading={loading} />
      </SectionPanel>

      {/* Search + Filter + Add button */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <input
            type="text"
            placeholder="ค้นหาบุคลากร..."
            value={search}
            onChange={(e) => setSearch?.(e.target.value)}
            className="flex-1 p-2 sm:p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base"
          />

          {isAdmin && (
            <button
              onClick={() => openForm()}
              className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg shadow hover:bg-blue-700 whitespace-nowrap transition-colors text-sm sm:text-base"
            >
              + เพิ่มบุคลากร
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as WorkStatus | "")}
            className="p-2 sm:p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white text-sm sm:text-base"
          >
            <option value="">สถานะทั้งหมด</option>
            {WORK_STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          <select
            value={jobTitleFilter}
            onChange={(e) => setJobTitleFilter(e.target.value)}
            className="p-2 sm:p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white text-sm sm:text-base"
          >
            <option value="">ตำแหน่งทั้งหมด</option>
            {jobTitles.map((jt: any) => (
              <option key={jt.job_title_id} value={jt.job_title_id}>
                {jt.job_title_name || jt.name_th || jt.name}
              </option>
            ))}
          </select>

          <select
            value={positionTypeFilter}
            onChange={(e) => setPositionTypeFilter(e.target.value)}
            className="p-2 sm:p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white text-sm sm:text-base"
          >
            <option value="">ประเภททั้งหมด</option>
            {positionTypes.map((pt: any) => (
              <option key={pt.position_type_id} value={pt.position_type_id}>
                {pt.position_type_name || pt.name_th || pt.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* List */}
      <SectionPanel title="รายชื่อบุคลากร" heightClass="min-h-[400px]" paddingClass="p-4 sm:p-6" showHint={false}>
        {Array.isArray(paginatedEmployees) && paginatedEmployees.length > 0 ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-4">
              {paginatedEmployees.map((emp: any) => (
                <EmployeeCard
                  key={emp.id}
                  emp={emp}
                  onOpenDetail={openDetail}
                  onEdit={isAdmin ? (e: any) => openForm(e) : undefined}
                  onDelete={isAdmin ? (id: string) => remove(id) : undefined}
                />
              ))}
            </div>

            {/* Pagination UI - สไตล์เดียวกับหน้าคำสั่ง */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-xs sm:text-sm border rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all w-full sm:w-auto"
                >
                  ก่อนหน้า
                </button>
                
                <span className="text-xs sm:text-sm text-gray-600 font-medium">
                  หน้า {currentPage} / {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-xs sm:text-sm border rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all w-full sm:w-auto"
                >
                  ถัดไป
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <p>ไม่พบบุคลากร</p>
          </div>
        )}
      </SectionPanel>

      {/* Modals */}
      {isAdmin && (
        <EmployeeFormModal
          show={isModalOpen}
          form={form}
          setForm={setForm}
          onClose={closeForm}
          onSave={save}
          editing={editing}
        />
      )}

      <EmployeeDetailModal
        show={detailOpen}
        emp={detailEmp}
        onClose={closeDetail}
        jobTitlesMap={jobTitlesMap}
        positionLevelsMap={positionLevelsMap}
        positionTypesMap={positionTypesMap}
      />
    </div>
  );
};

export default EmployeePage;