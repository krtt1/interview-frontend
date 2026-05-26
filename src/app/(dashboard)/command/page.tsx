"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import API from "@/lib/api";

import InfoCard from "@/components/ui/InfoCard";
import SectionPanel from "@/components/ui/SectionPanel";
import CommandTable from "@/components/command/CommandTable";
import CommandFormModal from "@/components/command/CommandFormModal";
import EditCommandModal from "@/components/command/EditCommandModal";

/* ================= TYPES ================= */
export type Command = {
  command_id: number;
  command_title: string;
  command_detail: string;
  date: string;
  note?: string | null;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

const LIMIT = 10;

const CommandPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const isAdmin = user?.role !== "user";

  const [data, setData] = useState<Command[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: LIMIT,
    total: 0,
    totalPages: 1,
  });

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editCommand, setEditCommand] = useState<Command | null>(null);

  const [filterMode, setFilterMode] =
    useState<"all" | "latest" | "by-type">("all");
  const [selectedType, setSelectedType] = useState("");

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
      alert("ไม่สามารถส่งออกข้อมูลคำสั่งได้");
    }
  };

  /* ================= FETCH ================= */
  const fetchCommands = useCallback(
    async (pageNo = page) => {
      try {
        setLoading(true);
        const res = await API.get(
          `/command/getall?page=${pageNo}&limit=${LIMIT}`
        );

        if (res.data?.pagination) {
          setData(res.data.data);
          setPagination(res.data.pagination);
        } else {
          setData(res.data);
          setPagination({
            page: 1,
            limit: res.data.length,
            total: res.data.length,
            totalPages: 1,
          });
        }
      } catch {
        alert("ไม่สามารถโหลดข้อมูลคำสั่งได้");
      } finally {
        setLoading(false);
      }
    },
    [page]
  );

  useEffect(() => {
    if (!authLoading && user) fetchCommands(page);
  }, [authLoading, user, page, fetchCommands]);

  /* ================= DELETE ================= */
  const handleDelete = async (id: number) => {
    if (!confirm("ยืนยันการลบคำสั่งนี้ ?")) return;
    await API.delete(`/command/${id}`);
    setPage(1);
    fetchCommands(1);
  };

  /* ================= SUMMARY ================= */
  const summary = useMemo(() => {
    const total = pagination.total ?? data.length;
    const types = new Set(data.map((d) => d.command_detail)).size;
    return { total, types };
  }, [pagination, data]);

  /* ================= FILTER + SEARCH ================= */
  const filteredData = useMemo(() => {
    let result = [...data];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.command_title.toLowerCase().includes(q) ||
          c.command_detail.toLowerCase().includes(q)
      );
    }

    if (filterMode === "latest") {
      result.sort(
        (a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    }

    if (filterMode === "by-type" && selectedType) {
      result = result.filter(
        (c) => c.command_detail === selectedType
      );
    }

    return result;
  }, [data, search, filterMode, selectedType]);

  if (authLoading || loading) {
    return <div className="p-6 text-gray-500">กำลังโหลดข้อมูล...</div>;
  }

  const commandTypes = [...new Set(data.map((d) => d.command_detail))];

  return (
    <div className="p-4 space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            จัดการคำสั่ง (Command)
          </h1>
          <p className="text-sm text-gray-500">
            รายการคำสั่งที่สร้างในระบบ
          </p>
        </div>

        {isAdmin && (
          <div className="flex flex-wrap gap-2">
             {/* NEW EXPORT BUTTONS */}
             <button
              onClick={() => handleExport("/command/export-excel", "รายการคำสั่งทั้งหมด.xlsx")}
              className="bg-white border border-blue-600 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-all flex items-center gap-2"
            >
              คำสั่งทั้งหมด
            </button>
            <button
              onClick={() => handleExport("/command/export-command-employees", "รายชื่อพนักงานตามคำสั่ง.xlsx")}
              className="bg-white border border-indigo-600 text-indigo-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-50 transition-all flex items-center gap-2"
            >
              👥 รายชื่อผู้ได้รับคำสั่ง
            </button>

            <button
              onClick={() => setOpenModal(true)}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-all"
            >
              + เพิ่มคำสั่ง
            </button>
          </div>
        )}
      </div>

      {/* ================= SEARCH ================= */}
      <div className="flex justify-end">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ค้นหาชื่อคำสั่ง / ประเภทคำสั่ง"
          className="w-full md:w-96 px-4 py-2 border rounded-lg text-sm"
        />
      </div>

      {/* ================= SUMMARY ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InfoCard
          title="คำสั่งทั้งหมด"
          value={summary.total}
          color="border-blue-500"
          onClick={() => {
            setFilterMode("all");
            setSelectedType("");
          }}
        />
        <InfoCard
          title="คำสั่งใหม่ล่าสุด"
          value={data.length}
          color="border-green-500"
          onClick={() => {
            setFilterMode("latest");
            setSelectedType("");
          }}
          subText={
            filterMode === "latest"
              ? "เรียงจากวันที่ล่าสุด"
              : undefined
          }
        />
        <InfoCard
          title="ประเภทคำสั่ง"
          value={summary.types}
          color="border-yellow-500"
          onClick={() => setFilterMode("by-type")}
          subText={
            filterMode === "by-type"
              ? "เลือกประเภทด้านล่าง"
              : undefined
          }
        />
      </div>

      {filterMode === "by-type" && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedType("")}
            className={`px-4 py-1.5 rounded-full text-sm border ${
              selectedType === ""
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            ทั้งหมด
          </button>
          {commandTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-1.5 rounded-full text-sm border ${
                selectedType === type
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      )}

      {/* ================= TABLE ================= */}
      <SectionPanel title="รายการคำสั่ง">
        <CommandTable
          data={filteredData}
          isAdmin={isAdmin}
          onEdit={(c) => setEditCommand(c)}
          onDelete={handleDelete}
        />
        
        {/* PAGINATION */}
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

      <CommandFormModal
        open={isAdmin && openModal}
        onClose={() => setOpenModal(false)}
        onSaved={() => fetchCommands(1)}
      />

      {editCommand && (
        <EditCommandModal
          open
          command={editCommand}
          onClose={() => setEditCommand(null)}
          onSaved={async () => {
            await fetchCommands(page);
            setEditCommand(null);
          }}
        />
      )}
    </div>
  );
};

export default CommandPage;