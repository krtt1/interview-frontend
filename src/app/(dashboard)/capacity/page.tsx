"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCapacityList, useCapacityExport, useCapacityImport, useCapacityDelete } from "@/hooks/useCapacity";

const ITEMS_PER_PAGE = 10;

export default function CapacityPage() {
  const router = useRouter();
  const { capacities, loading, error, total, refetch } = useCapacityList();
  const { exportToExcel, loading: exportLoading } = useCapacityExport();
  const { importFromExcel, loading: importLoading } = useCapacityImport();
  const { deleteCapacity, loading: deleteLoading } = useCapacityDelete();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [userRole, setUserRole] = useState<string>("");

  // Check user role
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      router.replace("/login");
      return;
    }
    
    try {
      const parsed = JSON.parse(stored);
      const role = String(parsed.role || "").toLowerCase();
      setUserRole(role);
      
      // Redirect if not admin or superadmin
      if (role !== "admin" && role !== "superadmin") {
        alert("คุณไม่มีสิทธิ์เข้าถึงหน้านี้");
        router.replace("/dashboard");
      }
    } catch {
      router.replace("/login");
    }
  }, [router]);

  // Move useMemo before early return to maintain hooks order
  const filteredCapacities = useMemo(() => {
    return capacities.filter(cap => 
      cap.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cap.employee_id?.includes(searchTerm) ||
      cap.department?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [capacities, searchTerm]);

  // Don't render if not authorized
  if (!userRole || (userRole !== "admin" && userRole !== "superadmin")) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">กำลังตรวจสอบสิทธิ์...</p>
        </div>
      </div>
    );
  }

  // Pagination calculations
  const totalPages = Math.ceil(filteredCapacities.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCapacities = filteredCapacities.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExport = async () => {
    const result = await exportToExcel();
    if (result.success) {
      alert("Export สำเร็จ");
    } else {
      alert(`เกิดข้อผิดพลาด: ${result.error}`);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      alert("กรุณาเลือกไฟล์");
      return;
    }

    const result = await importFromExcel(selectedFile);
    if (result.success) {
      alert(`Import สำเร็จ ${result.imported} รายการ${result.failed > 0 ? `, ล้มเหลว ${result.failed} รายการ` : ''}`);
      setShowImportModal(false);
      setSelectedFile(null);
      refetch();
    } else {
      alert(`เกิดข้อผิดพลาด: ${result.error}`);
    }
  };

  const handleDelete = async (employeeId: string, fullName: string) => {
    if (!confirm(`ต้องการลบข้อมูลของ ${fullName} ใช่หรือไม่?`)) {
      return;
    }

    const result = await deleteCapacity(employeeId);
    if (result.success) {
      alert("ลบข้อมูลสำเร็จ");
      refetch();
    } else {
      alert(`เกิดข้อผิดพลาด: ${result.error}`);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">จัดการข้อมูลสมรรถนะ</h1>
        <div className="flex gap-3">
          <button
            onClick={handleExport}
            disabled={exportLoading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
          >
            {exportLoading ? "กำลัง Export..." : "Export Excel"}
          </button>
          <button
            onClick={() => setShowImportModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Import Excel
          </button>
          <button
            onClick={() => router.push('/capacity/new')}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            เพิ่มข้อมูลใหม่
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <input
          type="text"
          placeholder="ค้นหา (ชื่อ, รหัสบัตรประชาชน, หน่วยงาน)"
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {loading && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p>กำลังโหลด...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              แสดง {startIndex + 1}-{Math.min(endIndex, filteredCapacities.length)} จาก {filteredCapacities.length} รายการ
              {searchTerm && ` (กรองจากทั้งหมด ${total} รายการ)`}
            </p>
            <p className="text-sm text-gray-600">
              หน้า {currentPage} / {totalPages || 1}
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">ลำดับ</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">รหัสบัตรประชาชน</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">ชื่อ-นามสกุล</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">หน่วยงาน</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">อายุ</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">การศึกษา</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {currentCapacities.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                      {searchTerm ? "ไม่พบข้อมูลที่ค้นหา" : "ไม่พบข้อมูล"}
                    </td>
                  </tr>
                ) : (
                  currentCapacities.map((capacity, index) => (
                    <tr key={capacity.employee_id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-600">{startIndex + index + 1}</td>
                      <td className="px-4 py-3 text-sm">{capacity.employee_id}</td>
                      <td className="px-4 py-3 text-sm font-medium">{capacity.full_name || '-'}</td>
                      <td className="px-4 py-3 text-sm">{capacity.department || '-'}</td>
                      <td className="px-4 py-3 text-sm">{capacity.age || '-'}</td>
                      <td className="px-4 py-3 text-sm">{capacity.education_level || '-'}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => router.push(`/capacity/${capacity.employee_id}`)}
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                          >
                            ดู/แก้ไข
                          </button>
                          <button
                            onClick={() => handleDelete(capacity.employee_id, capacity.full_name || capacity.employee_id)}
                            disabled={deleteLoading}
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs disabled:bg-gray-400"
                          >
                            ลบ
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t bg-gray-50">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← ก่อนหน้า
                </button>

                <div className="flex gap-2">
                  {/* First page */}
                  {currentPage > 3 && (
                    <>
                      <button
                        onClick={() => handlePageChange(1)}
                        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        1
                      </button>
                      {currentPage > 4 && (
                        <span className="px-3 py-2 text-gray-500">...</span>
                      )}
                    </>
                  )}

                  {/* Page numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      return page === currentPage || 
                             page === currentPage - 1 || 
                             page === currentPage + 1 ||
                             (currentPage <= 2 && page <= 3) ||
                             (currentPage >= totalPages - 1 && page >= totalPages - 2);
                    })
                    .map(page => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg ${
                          page === currentPage
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                  {/* Last page */}
                  {currentPage < totalPages - 2 && (
                    <>
                      {currentPage < totalPages - 3 && (
                        <span className="px-3 py-2 text-gray-500">...</span>
                      )}
                      <button
                        onClick={() => handlePageChange(totalPages)}
                        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ถัดไป →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Import ข้อมูลจาก Excel</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">เลือกไฟล์ Excel</label>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="w-full px-3 py-2 border rounded-lg"
              />
              {selectedFile && (
                <p className="text-sm text-gray-600 mt-2">
                  ไฟล์: {selectedFile.name}
                </p>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
              <p className="text-sm text-blue-800">
                ไฟล์ Excel ต้องมีรูปแบบตามที่กำหนด<br/>
                ดาวน์โหลด Template ได้จากปุ่ม Export
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleImport}
                disabled={!selectedFile || importLoading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                {importLoading ? "กำลัง Import..." : "Import"}
              </button>
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setSelectedFile(null);
                }}
                disabled={importLoading}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
