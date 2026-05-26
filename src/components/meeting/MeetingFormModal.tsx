"use client";

import React, { useEffect, useState } from "react";
import API from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

/* ================= TYPES ================= */
type Employee = {
  id: string;
  prefix_th?: string | null;
  first_name_th?: string | null;
  last_name_th?: string | null;
  jobTitle?: { name?: string };
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  initialData?: any | null;
};

const MeetingFormModal: React.FC<Props> = ({
  open,
  onClose,
  onSaved,
  initialData,
}) => {
  const { user } = useAuth();

  /* ================= FORM STATES ================= */
  const [form, setForm] = useState({
    start_date: "",
    end_date: "",
    submit_date: "",
    topic: "",
    meeting_title: "",
    organizer: "",
    location: "",
    meeting_type: "Onsite",
    budget_source: "",
    note: "",
  });

  const [organizerName, setOrganizerName] = useState("");
  
  /* ================= ATTENDEE STATES ================= */
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState<Employee[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  /* ================= PRELOAD DATA ================= */
  useEffect(() => {
    if (!open) return;

    if (initialData) {
      setForm({
        start_date: initialData.start_date ?? "",
        end_date: initialData.end_date ?? "",
        submit_date: initialData.submit_date ?? "",
        topic: initialData.topic ?? "",
        meeting_title: initialData.meeting_title ?? "",
        organizer: initialData.organizer ?? user?.id ?? "",
        location: initialData.location ?? "",
        meeting_type: initialData.meeting_type ?? "Onsite",
        budget_source: initialData.budget_source ?? "",
        note: initialData.note ?? "",
      });
      
      // ⭐ ปรับ Mapping ให้ ID ตรงกัน
      if (initialData.meetingEmployees) {
        const existing = initialData.meetingEmployees.map((me: any) => ({
            id: me.employee_id, // ใช้ ID จากความสัมพันธ์
            prefix_th: me.employee?.prefix_th ?? "",
            first_name_th: me.employee?.first_name_th ?? "ไม่พบข้อมูล",
            last_name_th: me.employee?.last_name_th ?? "",
        }));
        setSelectedEmployees(existing);
      }
    } else {
      setForm({
        start_date: "",
        end_date: "",
        submit_date: "",
        topic: "",
        meeting_title: "",
        organizer: user?.id ?? "",
        location: "",
        meeting_type: "Onsite",
        budget_source: "",
        note: "",
      });
      setSelectedEmployees([]);
    }
    setSearch("");
    setSearchResult([]);
  }, [open, initialData, user?.id]);

  /* ================= FETCH ORGANIZER NAME ================= */
  useEffect(() => {
    if (!user?.id) return;
    API.get(`/employees/${user.id}`)
      .then((res) => {
        const emp = res.data;
        const name = `${emp.prefix_th ?? ""}${emp.first_name_th ?? ""} ${emp.last_name_th ?? ""}`;
        setOrganizerName(name.trim());
      })
      .catch(() => setOrganizerName(user.id));
  }, [user?.id]);

  /* ================= SEARCH LOGIC ================= */
  useEffect(() => {
    if (search.trim().length < 2) {
      setSearchResult([]);
      return;
    }
    const t = setTimeout(async () => {
      try {
        setLoadingSearch(true);
        const res = await API.get(`/employees/search?q=${search}`);
        // ⭐ เช็คว่า API ส่ง id หรือ employee_id มา เพื่อ map ให้เป็น id กลาง
        const mappedResult = (res.data || []).map((emp: any) => ({
          ...emp,
          id: emp.id || emp.employee_id // ป้องกันกรณี Key ชื่อไม่เหมือนกัน
        }));
        setSearchResult(mappedResult);
      } catch {
        setSearchResult([]);
      } finally {
        setLoadingSearch(false);
      }
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  /* ================= ACTIONS ================= */
  const addEmployee = (emp: Employee) => {
    if (selectedEmployees.some((e) => e.id === emp.id)) return;
    // เพิ่มเข้าไปในลิสต์ พร้อมล้างคำค้นหา
    setSelectedEmployees((prev) => [...prev, emp]);
    setSearch("");
    setSearchResult([]);
  };

  const removeEmployee = (id: string) => {
    setSelectedEmployees((prev) => prev.filter((e) => e.id !== id));
  };

/* ================= SAVE ACTION ================= */
const handleSave = async () => {
  if (!form.meeting_title || !form.topic || !form.start_date || !form.end_date) {
    alert("กรุณากรอก ชื่อการอบรม หัวข้อ และวันที่ให้ครบถ้วน");
    return;
  }

  try {
    const payload = {
      ...form,
      organizer: user?.id,
      // ⭐ แก้จาก employees เป็น participants และส่งแค่ ID เป็น Array
      participants: selectedEmployees.map(e => e.id) 
    };



    if (initialData) {
      await API.put(`/meeting/${initialData.meeting_id}`, payload);
    } else {
      await API.post("/meeting/create", payload);
    }

    onSaved();
    onClose();
  } catch (err) {
    console.error(err);
    alert("บันทึกไม่สำเร็จ");
  }
};

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative bg-white p-6 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h2 className="text-xl font-bold text-gray-800">
            {initialData ? "แก้ไขข้อมูลการอบรม" : "ลงทะเบียนการอบรมใหม่"}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-bold text-xl">✕</button>
        </div>

        {/* 1. ข้อมูลการอบรม */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-6">
          <div className="md:col-span-2">
            <label className="block mb-1 font-semibold text-gray-700">ชื่อการอบรม/โครงการ</label>
            <input
              className="border p-2.5 rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.meeting_title}
              onChange={(e) => setForm({ ...form, meeting_title: e.target.value })}
              placeholder="ระบุชื่อหลักของการอบรม"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block mb-1 font-semibold text-blue-600">หัวข้อ/รายละเอียดปลีกย่อย (Topic)</label>
            <input
              className="border p-2.5 rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none bg-blue-50"
              value={form.topic}
              onChange={(e) => setForm({ ...form, topic: e.target.value })}
              placeholder="เช่น อบรมการใช้งานระบบสารบรรณ รุ่นที่ 1"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-600">ผู้จัด (Organizer)</label>
            <input className="border p-2.5 rounded-lg w-full bg-gray-50 text-gray-500" value={organizerName} disabled />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-600">ประเภท</label>
            <select 
              className="border p-2.5 rounded-lg w-full"
              value={form.meeting_type}
              onChange={(e) => setForm({...form, meeting_type: e.target.value})}
            >
              <option value="Onsite">Onsite</option>
              <option value="Online">Online</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-600">วันที่เริ่ม</label>
            <input type="date" className="border p-2.5 rounded-lg w-full" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-600">วันที่สิ้นสุด</label>
            <input type="date" className="border p-2.5 rounded-lg w-full" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-red-600">กำหนดส่งรายงาน</label>
            <input type="date" className="border p-2.5 rounded-lg w-full" value={form.submit_date} onChange={(e) => setForm({ ...form, submit_date: e.target.value })} />
          </div>

          <div className="md:col-span-3">
            <label className="block mb-1 font-medium text-gray-600">สถานที่ / แหล่งงบประมาณ</label>
            <input className="border p-2.5 rounded-lg w-full" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="ระบุสถานที่ หรือแหล่งงบ" />
          </div>
        </div>

        <hr className="my-6" />

        {/* 2. ส่วนการเลือกรายชื่อผู้เข้าอบรม */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
             <h3 className="font-bold text-gray-700">
               รายชื่อบุคลากรผู้เข้าอบรม (<span className="text-blue-600">{selectedEmployees.length}</span> คน)
             </h3>
          </div>

          <div className="relative">
            <input
              placeholder="พิมพ์ชื่อ-นามสกุล เพื่อค้นหาและเพิ่มพนักงาน..."
              className="border-2 border-blue-50 p-3 rounded-xl w-full focus:border-blue-500 outline-none transition-all shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {loadingSearch && <div className="absolute right-3 top-3.5 text-xs text-blue-400 animate-pulse">กำลังค้นหา...</div>}
            
            {searchResult.length > 0 && (
              <div className="absolute z-20 w-full bg-white border border-gray-100 rounded-xl mt-1 shadow-2xl max-h-60 overflow-y-auto">
                {searchResult.map((emp) => (
                  <div
                    key={emp.id}
                    className="p-3 hover:bg-blue-50 cursor-pointer flex justify-between items-center border-b last:border-0 transition-colors"
                    onClick={() => addEmployee(emp)}
                  >
                    <div>
                        <p className="text-sm font-bold text-gray-800">{emp.prefix_th}{emp.first_name_th} {emp.last_name_th}</p>
                        <p className="text-xs text-gray-500">ID: {emp.id}</p>
                    </div>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">+ เพิ่มรายชื่อ</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* รายชื่อที่ถูกเลือก */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto p-1">
            {selectedEmployees.map((e) => (
              <div key={e.id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-blue-200 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                    {e.first_name_th?.charAt(0) || "E"}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                     {e.prefix_th}{e.first_name_th} {e.last_name_th}
                  </span>
                </div>
                <button 
                  onClick={() => removeEmployee(e.id)}
                  className="text-gray-300 hover:text-red-500 font-bold p-1 transition-colors"
                >
                  ✕
                </button>
              </div>
            ))}
            {selectedEmployees.length === 0 && (
              <div className="col-span-full py-10 text-center text-gray-400 border-2 border-dashed rounded-2xl bg-gray-50/50">
                <p className="text-sm">ยังไม่มีรายชื่อผู้เข้าอบรมในรายการนี้</p>
                <p className="text-[10px] mt-1 italic">ค้นหาชื่อจากช่องด้านบนเพื่อเริ่มเพิ่มรายชื่อ</p>
              </div>
            )}
          </div>
        </div>

        {/* 3. ส่วนปุ่มกดยืนยัน */}
        <div className="mt-10 flex justify-end gap-3 border-t pt-5">
          <button 
            onClick={onClose} 
            className="px-6 py-2.5 text-sm font-medium border rounded-xl hover:bg-gray-50 transition-colors"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-10 py-2.5 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95"
          >
            {initialData ? "บันทึกการแก้ไข" : "สร้างรายการอบรม"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeetingFormModal;