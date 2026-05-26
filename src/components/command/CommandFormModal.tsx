"use client";

import React, { useEffect, useState } from "react";
import API from "@/lib/api";

/* ================= TYPES ================= */
type Employee = {
  id: string;
  prefix_th?: string;
  first_name_th?: string;
  last_name_th?: string;
  jobTitle?: { name: string };
  jobGroup?: { group_name: string };
};

type SelectedEmployee = {
  id: string;
  prefix_th?: string;
  first_name_th?: string;
  last_name_th?: string;
  command_job?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
};

const CommandFormModal: React.FC<Props> = ({ open, onClose, onSaved }) => {
  const [form, setForm] = useState({
    command_title: "",
    command_detail: "",
    date: "",
    note: "",
  });

  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState<Employee[]>([]);
  const [employees, setEmployees] = useState<SelectedEmployee[]>([]);

  /* ================= SEARCH LOGIC ================= */
  useEffect(() => {
    if (search.trim().length < 2) {
      setSearchResult([]);
      return;
    }
    const t = setTimeout(async () => {
      try {
        const res = await API.get(`/employees/search?q=${search}`);
        setSearchResult(res.data || []);
      } catch {
        setSearchResult([]);
      }
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const addEmployee = (emp: Employee) => {
    if (employees.some((e) => e.id === emp.id)) return;
    setEmployees((prev) => [
      ...prev,
      {
        id: emp.id,
        prefix_th: emp.prefix_th,
        first_name_th: emp.first_name_th,
        last_name_th: emp.last_name_th,
        command_job: "",
      },
    ]);
    setSearch("");
    setSearchResult([]);
  };

  const handleSubmit = async () => {
    if (!form.command_title || !form.command_detail || !form.date) {
      alert("กรุณากรอกข้อมูลคำสั่งให้ครบ");
      return;
    }
    try {
      await API.post("/command/create", {
        ...form,
        employees: employees.map((e) => ({
          employee_id: e.id,
          command_job: e.command_job || null,
        })),
      });
      onSaved();
      onClose();
    } catch (err) {
      alert("บันทึกข้อมูลไม่สำเร็จ");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-8 py-5 border-b flex justify-between items-center bg-white">
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">เพิ่มคำสั่งใหม่</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl transition-colors">×</button>
        </div>

        <div className="p-8 overflow-y-auto bg-gray-50/50">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* ฝั่งซ้าย: ข้อมูลคำสั่ง (5 ส่วน) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider border-b pb-2">1. ข้อมูลรายละเอียดคำสั่ง</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">ชื่อคำสั่ง</label>
                    <input
                      className="w-full bg-blue-50 border-blue-100 border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      value={form.command_title}
                      onChange={(e) => setForm({ ...form, command_title: e.target.value })}
                      placeholder="ระบุชื่อคำสั่ง..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">ประเภทคำสั่ง</label>
                    <input
                      className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      value={form.command_detail}
                      onChange={(e) => setForm({ ...form, command_detail: e.target.value })}
                      placeholder="เช่น คำสั่งไปราชการ, คำสั่งแต่งตั้ง..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">วันที่ออกคำสั่ง</label>
                    <input
                      type="date"
                      className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-red-600">หมายเหตุ</label>
                    <textarea
                      rows={3}
                      className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      value={form.note}
                      onChange={(e) => setForm({ ...form, note: e.target.value })}
                      placeholder="ระบุหมายเหตุเพิ่มเติม (ถ้ามี)"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ฝั่งขวา: เลือกพนักงาน (7 ส่วน) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5 flex flex-col min-h-[500px]">
                <div className="flex justify-between items-center border-b pb-2">
                   <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider">2. มอบหมายบุคลากร ({employees.length} ท่าน)</h3>
                </div>

                {/* Search */}
                <div className="relative">
                  <input
                    placeholder="พิมพ์ชื่อ-นามสกุล เพื่อค้นหาบุคลากร..."
                    className="w-full border-2 border-blue-50 p-3 pl-4 rounded-xl focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {searchResult.length > 0 && (
                    <div className="absolute z-10 w-full bg-white border rounded-xl mt-2 shadow-xl max-h-56 overflow-y-auto overflow-x-hidden">
                      {searchResult.map((emp) => (
                        <div
                          key={emp.id}
                          className="p-3 hover:bg-blue-50 cursor-pointer flex justify-between items-center border-b last:border-0 transition-colors"
                          onClick={() => addEmployee(emp)}
                        >
                          <div className="text-sm">
                            <span className="font-bold">{emp.prefix_th}{emp.first_name_th} {emp.last_name_th}</span>
                            <p className="text-xs text-gray-500">{emp.jobTitle?.name ?? "-"}</p>
                          </div>
                          <span className="text-xs font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">+ เพิ่ม</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* List พนักงานที่เลือก */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                  <div className="grid grid-cols-1 gap-3">
                    {employees.map((e) => (
                      <div key={e.id} className="p-4 bg-gray-50 border border-gray-100 rounded-xl relative group transition-all hover:border-blue-200">
                        <button 
                           onClick={() => setEmployees(x => x.filter(i => i.id !== e.id))}
                           className="absolute top-2 right-2 text-gray-300 hover:text-red-500 font-bold p-1"
                        >✕</button>
                        
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                          <div className="flex-1">
                            <p className="text-sm font-bold text-gray-700">{e.prefix_th}{e.first_name_th} {e.last_name_th}</p>
                          </div>
                          <div className="flex-[2]">
                            <input
                              placeholder="ระบุหน้าที่ตามคำสั่ง..."
                              className="w-full border border-gray-200 p-2 rounded-lg text-sm focus:border-blue-400 outline-none bg-white"
                              value={e.command_job || ""}
                              onChange={(ev) => setEmployees(prev => prev.map(x => x.id === e.id ? { ...x, command_job: ev.target.value } : x))}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {employees.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-2xl bg-gray-50 text-gray-400">
                       <p className="text-sm tracking-wide font-medium text-center">ยังไม่ได้เลือกบุคลากร<br/>กรุณาค้นหาและเลือกชื่อจากช่องด้านบน</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t bg-white flex justify-end gap-3 shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
          <button 
            onClick={onClose} 
            className="px-8 py-2.5 border rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-all active:scale-95"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSubmit}
            className="px-12 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            บันทึกข้อมูลคำสั่ง
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommandFormModal;