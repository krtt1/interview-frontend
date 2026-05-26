"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useEmployees } from "@/hooks/useEmployees";
import JobHistoryDetailModal from "@/components/job-history/JobHistoryDetailModal";
import API from "@/lib/api";

type EmployeeJobHistoryStatus = {
  id: string;
  name: string;
  job_group_id: number;
  has_job_history: boolean;
};

export default function JobHistoryPage() {
  const { currentUser, jobGroups, positionTypes, positionLevels } = useEmployees() as any;
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "has" | "none">("all");
  const [employees, setEmployees] = useState<EmployeeJobHistoryStatus[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const isAdmin = currentUser?.role === "admin" || currentUser?.role === "superadmin";

  // Convert jobGroups to array
  const jobGroupsArray = useMemo(() => {
    if (!jobGroups) return [];
    
    // ถ้าเป็น Array อยู่แล้ว
    if (Array.isArray(jobGroups)) {
      return jobGroups.map((jg: any) => ({
        id: String(jg.job_group_id || jg.id),
        name: String(jg.job_group_name || jg.name),
      }));
    }
    
    // ถ้าเป็น Object
    return Object.entries(jobGroups).map(([id, value]: [string, any]) => {
      if (typeof value === 'object' && value !== null) {
        return {
          id: String(value.job_group_id || id),
          name: String(value.job_group_name || value.name),
        };
      }
      return {
        id: String(id),
        name: String(value),
      };
    });
  }, [jobGroups]);

  // Fetch employees with job history status
  useEffect(() => {
    if (!isAdmin) return;

    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const response = await API.get('/employees-job-history-status');
        setEmployees(response.data.data || []);
      } catch (error) {
        console.error('Error fetching employees:', error);
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [isAdmin]);

  // Filter employees
  const filteredEmployees = useMemo(() => {
    let result = employees;

    // Search filter
    if (searchQuery) {
      result = result.filter((emp) =>
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.id.includes(searchQuery)
      );
    }

    // Status filter
    if (filterStatus === "has") {
      result = result.filter((emp) => emp.has_job_history);
    } else if (filterStatus === "none") {
      result = result.filter((emp) => !emp.has_job_history);
    }

    return result;
  }, [employees, searchQuery, filterStatus]);

  // Pagination
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEmployees = filteredEmployees.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus]);

  const handleViewJobHistory = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    setDetailOpen(true);
  };

  const handleModalClose = () => {
    setDetailOpen(false);
    setSelectedEmployeeId(null);
    
    // Refresh employee list
    API.get('/employees-job-history-status')
      .then(response => setEmployees(response.data.data || []))
      .catch(error => console.error('Error refreshing employees:', error));
  };

  if (!isAdmin) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">คุณไม่มีสิทธิ์เข้าถึงหน้านี้</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">จัดการประวัติการทำงาน</h1>
          <p className="text-sm text-gray-500 mt-1">
            จัดการประวัติการทำงานของบุคลากรทั้งหมด
          </p>
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="ค้นหาด้วยชื่อหรือรหัสบัตรประชาชน..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="md:w-64">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">ทั้งหมด</option>
              <option value="has">มีประวัติการทำงาน</option>
              <option value="none">ยังไม่มีประวัติการทำงาน</option>
            </select>
          </div>
        </div>
      </div>

      {/* EMPLOYEE TABLE */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <p className="text-sm text-gray-500">กำลังโหลด...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      รหัสบัตรประชาชน
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ชื่อ-นามสกุล
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      สถานะ
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      จัดการ
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentEmployees.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                        ไม่พบข้อมูลพนักงาน
                      </td>
                    </tr>
                  ) : (
                    currentEmployees.map((employee) => (
                      <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {employee.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {employee.has_job_history ? (
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                              มีแล้ว
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
                              ยังไม่มี
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            onClick={() => handleViewJobHistory(employee.id)}
                            className="px-3 py-1 rounded-md bg-blue-600 text-white text-xs hover:bg-blue-700 transition-colors"
                          >
                            จัดการ
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredEmployees.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-600">
                    แสดง {startIndex + 1}-{Math.min(endIndex, filteredEmployees.length)} จาก {filteredEmployees.length} รายการ
                    {filterStatus === "has" && " (มีประวัติการทำงาน)"}
                    {filterStatus === "none" && " (ยังไม่มีประวัติการทำงาน)"}
                  </p>
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 rounded-md border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      ก่อนหน้า
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        // Show first page, last page, current page, and pages around current
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                                currentPage === page
                                  ? "bg-blue-600 text-white"
                                  : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              {page}
                            </button>
                          );
                        } else if (
                          page === currentPage - 2 ||
                          page === currentPage + 2
                        ) {
                          return <span key={page} className="px-2 text-gray-400">...</span>;
                        }
                        return null;
                      })}
                    </div>

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 rounded-md border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      ถัดไป
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Job History Detail Modal */}
      {selectedEmployeeId && (
        <JobHistoryDetailModal
          open={detailOpen}
          onClose={handleModalClose}
          employeeId={selectedEmployeeId}
          jobGroups={jobGroupsArray}
          positionTypes={positionTypes}
          positionLevels={positionLevels}
        />
      )}
    </div>
  );
}
