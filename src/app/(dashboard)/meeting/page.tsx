"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import InfoCard from "@/components/ui/InfoCard";
import SectionPanel from "@/components/ui/SectionPanel";
import MeetingFormModal from "@/components/meeting/MeetingFormModal";

import { useAuth } from "@/hooks/useAuth";
import API from "@/lib/api";

/* ================= TYPES ================= */
type MeetingEmployee = {
  employee_id: string;
  tracking_status: "อยู่ระหว่างติดตาม" | "ส่งแล้ว" | "เกินกำหนด";
};

type Meeting = {
  meeting_id: number;
  meeting_title: string;
  start_date: string;
  end_date: string;
  meetingEmployees: MeetingEmployee[];
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

const LIMIT = 10;

/* ================= PAGE ================= */
const MeetingPage: React.FC = () => {
  const { user } = useAuth();
  const isAdminLevel = user?.role !== "user";

  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: LIMIT,
    total: 0,
    totalPages: 1,
  });

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState<Meeting | null>(null);

  const [search, setSearch] = useState("");
  const [filterMode, setFilterMode] = useState<"all" | "follow-up">("all");

  /* ================= EXPORT LOGIC (NEW) ================= */
  const handleExport = async (endpoint: string, fileName: string) => {
    try {
      const res = await API.get(endpoint, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export error:", err);
      alert("ไม่สามารถส่งออกข้อมูลได้ในขณะนี้");
    }
  };

  /* ================= FETCH ================= */
  const fetchMeetings = async (pageNo = page) => {
    try {
      setLoading(true);

      const res = await API.get(
        `/meeting/getall?page=${pageNo}&limit=${LIMIT}`
      );

      let meetingsData: Meeting[] = [];
      let paginationData: Pagination;

      if (Array.isArray(res.data)) {
        meetingsData = res.data;
        paginationData = {
          page: pageNo,
          limit: LIMIT,
          total: meetingsData.length,
          totalPages: 1,
        };
      } else {
        meetingsData = res.data?.data || [];
        paginationData = res.data?.pagination || {
          page: pageNo,
          limit: LIMIT,
          total: meetingsData.length,
          totalPages: 1,
        };
      }

      setMeetings(meetingsData);
      setPagination(paginationData);
    } catch (err) {
      console.error("fetchMeetings error:", err);
      setMeetings([]);
      setPagination({
        page: pageNo,
        limit: LIMIT,
        total: 0,
        totalPages: 1,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  /* ================= DELETE ================= */
  const handleDelete = async (id: number) => {
    if (!confirm("ยืนยันการลบการอบรมนี้ ?")) return;
    await API.delete(`/meeting/${id}`);
    setPage(1);
    fetchMeetings(1);
  };

  /* ================= SUMMARY ================= */
  const summary = useMemo(() => {
    const total = pagination.total;
    const totalParticipants = meetings.reduce(
      (sum, m) => sum + m.meetingEmployees.length,
      0
    );
    const followUp = meetings.filter((m) =>
      m.meetingEmployees.some((e) => e.tracking_status !== "ส่งแล้ว")
    ).length;

    return { total, totalParticipants, followUp };
  }, [meetings, pagination.total]);

  /* ================= FILTER + SEARCH ================= */
  const filteredMeetings = useMemo(() => {
    let result = meetings;
    if (filterMode === "follow-up") {
      result = result.filter((m) =>
        m.meetingEmployees.some((e) => e.tracking_status !== "ส่งแล้ว")
      );
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((m) =>
        m.meeting_title.toLowerCase().includes(q)
      );
    }
    return result;
  }, [meetings, filterMode, search]);

  if (loading) {
    return <div className="p-6 text-gray-500">กำลังโหลดข้อมูล...</div>;
  }

  return (
    <div className="p-4 space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            การฝึกอบรมและพัฒนา
          </h1>
          <p className="text-sm text-gray-500">
            (รายการส่งบุคลากรเข้ารับการอบรม)
          </p>
        </div>

        {isAdminLevel && (
          <div className="flex flex-wrap gap-2">
            {/* BUTTON: Export All Meetings */}
            <button
              onClick={() => handleExport("/meeting/export-excel", "สรุปรายการอบรมทั้งหมด.xlsx")}
              className="bg-white border border-blue-600 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-all flex items-center gap-2"
            >
              สรุปรายการอบรมทั้งหมด (Excel)
            </button>

            {/* BUTTON: Export All Participants */}
            <button
              onClick={() => handleExport("/meeting/export-meeting-employees", "สรุปสถานะพนักงาน.xlsx")}
              className="bg-white border border-indigo-600 text-indigo-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-50 transition-all flex items-center gap-2"
            >
              👥 รายชื่อผู้เข้าอบรม (Excel)
            </button>

            <button
              onClick={() => {
                setEditing(null);
                setOpenModal(true);
              }}
              className="bg-green-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-all"
            >
              + เพิ่มการอบรม
            </button>
          </div>
        )}
      </div>

      {/* ================= SEARCH ================= */}
      <div className="flex justify-end">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ค้นหาชื่อการอบรม"
          className="w-full md:w-96 px-4 py-2 border rounded-lg text-sm"
        />
      </div>

      {/* ================= SUMMARY ================= */}
      {isAdminLevel && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InfoCard
            title="การอบรมทั้งหมด"
            value={summary.total}
            color="border-blue-500"
            onClick={() => setFilterMode("all")}
          />
          <InfoCard
            title="ผู้เข้าอบรมทั้งหมด"
            value={summary.totalParticipants}
            color="border-green-500"
            onClick={() => setFilterMode("all")}
          />
          <InfoCard
            title="อบรมที่ต้องติดตาม"
            value={summary.followUp}
            color="border-yellow-500"
            onClick={() => setFilterMode("follow-up")}
            subText={
              filterMode === "follow-up"
                ? "กำลังแสดงเฉพาะรายการที่ต้องติดตาม"
                : undefined
            }
          />
        </div>
      )}

      {/* ================= TABLE ================= */}
      <SectionPanel
        title={
          filterMode === "follow-up"
            ? "รายการอบรมที่ต้องติดตาม"
            : "รายการอบรม"
        }
      >
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-1">
            <thead className="border-b">
              <tr className="text-base font-semibold text-gray-700">
                <th className="px-4 py-3 text-left">ชื่อการอบรม</th>
                <th className="px-4 py-3 text-left">วันที่เริ่ม</th>
                <th className="px-4 py-3 text-left">วันที่สิ้นสุด</th>
                <th className="px-4 py-3 text-center">ผู้เข้าอบรม</th>
                <th className="px-4 py-3 text-center">จัดการ</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredMeetings.map((item) => (
                <tr
                  key={item.meeting_id}
                  className="bg-white hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-sm">
                    {item.meeting_title}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {item.start_date}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {item.end_date}
                  </td>
                  <td className="px-4 py-3 text-center text-sm font-medium">
                    {item.meetingEmployees.length}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-2">
                      <Link
                        href={`/meeting/${item.meeting_id}`}
                        className="h-9 px-4 flex items-center justify-center rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
                      >
                        ดูรายละเอียด
                      </Link>

                      {isAdminLevel && (
                        <>
                          <button
                            onClick={() => {
                              setEditing(item);
                              setOpenModal(true);
                            }}
                            className="h-9 px-4 rounded-md bg-yellow-500 text-white text-sm hover:bg-yellow-600"
                          >
                            แก้ไข
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(item.meeting_id)
                            }
                            className="h-9 px-4 rounded-md bg-red-600 text-white text-sm hover:bg-red-700"
                          >
                            ลบ
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredMeetings.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-8 text-gray-500"
                  >
                    ไม่พบรายการอบรม
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ================= PAGINATION ================= */}
        <div className="flex justify-end items-center gap-3 mt-4 text-sm">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            ก่อนหน้า
          </button>
          <span>
            หน้า {pagination.page} / {pagination.totalPages}
          </span>
          <button
            disabled={page === pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            ถัดไป
          </button>
        </div>
      </SectionPanel>

      {/* ================= MODAL ================= */}
      {isAdminLevel && (
        <MeetingFormModal
          open={openModal}
          initialData={editing}
          onClose={() => setOpenModal(false)}
          onSaved={() => fetchMeetings(page)}
        />
      )}
    </div>
  );
};

export default MeetingPage;