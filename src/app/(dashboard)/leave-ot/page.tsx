"use client";

import React, { useEffect, useState } from "react";
import InfoCard from "@/components/ui/InfoCard";
import SectionPanel from "@/components/ui/SectionPanel";

// initial mock data (convert dates to ISO-like strings for date inputs if needed)
const INITIAL_LEAVES = [
  { id: 1, name: "สมชาย ใจดี", type: "ลาป่วย", start: "2025-11-12", end: "2025-11-13", days: 2, status: "รออนุมัติ" },
  { id: 2, name: "อรพิน ขยันงาน", type: "ลาพักผ่อน", start: "2025-11-01", end: "2025-11-03", days: 3, status: "อนุมัติแล้ว" },
  { id: 3, name: "พิสิฐ สายทอง", type: "ลากิจ", start: "2025-11-10", end: "2025-11-10", days: 1, status: "ไม่อนุมัติ" },
];

const INITIAL_OTS = [
  { id: 101, name: "สมชาย ใจดี", date: "2025-11-14", hours: 3, status: "รออนุมัติ" },
  { id: 102, name: "อรพิน ขยันงาน", date: "2025-11-10", hours: 2, status: "อนุมัติแล้ว" },
];

type LeaveItem = {
  id: number | string;
  name: string;
  type: string;
  start: string; // YYYY-MM-DD
  end: string;   // YYYY-MM-DD
  days: number;
  status: "รออนุมัติ" | "อนุมัติแล้ว" | "ไม่อนุมัติ" | string;
  reason?: string;
};

type OTItem = {
  id: number | string;
  name: string;
  date: string;
  hours: number;
  status: "รออนุมัติ" | "อนุมัติแล้ว" | "ไม่อนุมัติ" | string;
  reason?: string;
};

export default function LeaveOTPage() {
  const [tab, setTab] = useState<"leave" | "ot">("leave");

  const [leaves, setLeaves] = useState<LeaveItem[]>(INITIAL_LEAVES);
  const [ots, setOts] = useState<OTItem[]>(INITIAL_OTS);

  // modal state for leave
  const [openLeaveModal, setOpenLeaveModal] = useState(false);
  const [editingLeave, setEditingLeave] = useState<LeaveItem | null>(null);
  const [leaveForm, setLeaveForm] = useState<Partial<LeaveItem>>({
    name: "",
    type: "ลาพักผ่อน",
    start: "",
    end: "",
    days: 1,
    reason: "",
  });

  // modal state for OT
  const [openOtModal, setOpenOtModal] = useState(false);
  const [editingOt, setEditingOt] = useState<OTItem | null>(null);
  const [otForm, setOtForm] = useState<Partial<OTItem>>({
    name: "",
    date: "",
    hours: 1,
    reason: "",
  });

  // summary values derived
  const totalLeaves = leaves.length;
  const pendingLeaves = leaves.filter((l) => l.status === "รออนุมัติ").length;
  const approvedLeaves = leaves.filter((l) => l.status === "อนุมัติแล้ว").length;
  const rejectedLeaves = leaves.filter((l) => l.status === "ไม่อนุมัติ").length;

  useEffect(() => {
    // reset form when modal closed
    if (!openLeaveModal) {
      setEditingLeave(null);
      setLeaveForm({ name: "", type: "ลาพักผ่อน", start: "", end: "", days: 1, reason: "" });
    }
    if (!openOtModal) {
      setEditingOt(null);
      setOtForm({ name: "", date: "", hours: 1, reason: "" });
    }
  }, [openLeaveModal, openOtModal]);

  // ---------- Leave handlers ----------
  const openCreateLeave = () => {
    setEditingLeave(null);
    setLeaveForm({ name: "", type: "ลาพพักผ่อน", start: "", end: "", days: 1, reason: "" });
    setOpenLeaveModal(true);
    setTab("leave");
  };

  const openEditLeave = (l: LeaveItem) => {
    setEditingLeave(l);
    setLeaveForm({ name: l.name, type: l.type, start: l.start, end: l.end, days: l.days, reason: l.reason || "" });
    setOpenLeaveModal(true);
    setTab("leave");
  };

  const saveLeave = () => {
    if (!leaveForm.name || !leaveForm.start || !leaveForm.end) {
      alert("กรุณากรอกชื่อและวันที่เริ่ม/สิ้นสุด");
      return;
    }
    if (editingLeave) {
      setLeaves((s) => s.map((x) => (x.id === editingLeave.id ? { ...x, ...leaveForm } as LeaveItem : x)));
    } else {
      const newItem: LeaveItem = {
        id: Date.now(),
        name: String(leaveForm.name),
        type: String(leaveForm.type || "ลาพักผ่อน"),
        start: String(leaveForm.start),
        end: String(leaveForm.end),
        days: Number(leaveForm.days || 1),
        status: "รออนุมัติ",
        reason: String(leaveForm.reason || ""),
      };
      setLeaves((s) => [newItem, ...s]);
    }
    setOpenLeaveModal(false);
  };

  const deleteLeave = (id: number | string) => {
    if (!confirm("แน่ใจจะลบคำขอนี้ (mock)?")) return;
    setLeaves((s) => s.filter((x) => x.id !== id));
  };

  const approveLeave = (id: number | string) => {
    if (!confirm("อนุมัติคำขอ (mock)?")) return;
    setLeaves((s) => s.map((x) => (x.id === id ? { ...x, status: "อนุมัติแล้ว" } : x)));
  };

  const rejectLeave = (id: number | string) => {
    if (!confirm("ไม่อนุมัติคำขอ (mock)?")) return;
    setLeaves((s) => s.map((x) => (x.id === id ? { ...x, status: "ไม่อนุมัติ" } : x)));
  };

  // ---------- OT handlers ----------
  const openCreateOt = () => {
    setEditingOt(null);
    setOtForm({ name: "", date: "", hours: 1, reason: "" });
    setOpenOtModal(true);
    setTab("ot");
  };

  const openEditOt = (o: OTItem) => {
    setEditingOt(o);
    setOtForm({ name: o.name, date: o.date, hours: o.hours, reason: o.reason || "" });
    setOpenOtModal(true);
    setTab("ot");
  };

  const saveOt = () => {
    if (!otForm.name || !otForm.date) {
      alert("กรุณากรอกชื่อและวันที่");
      return;
    }
    if (editingOt) {
      setOts((s) => s.map((x) => (x.id === editingOt.id ? { ...x, ...otForm } as OTItem : x)));
    } else {
      const newItem: OTItem = {
        id: Date.now(),
        name: String(otForm.name),
        date: String(otForm.date),
        hours: Number(otForm.hours || 1),
        status: "รออนุมัติ",
        reason: String(otForm.reason || ""),
      };
      setOts((s) => [newItem, ...s]);
    }
    setOpenOtModal(false);
  };

  const deleteOt = (id: number | string) => {
    if (!confirm("แน่ใจจะลบคำขอ OT นี้ (mock)?")) return;
    setOts((s) => s.filter((x) => x.id !== id));
  };

  const approveOt = (id: number | string) => {
    if (!confirm("อนุมัติคำขอ OT (mock)?")) return;
    setOts((s) => s.map((x) => (x.id === id ? { ...x, status: "อนุมัติแล้ว" } : x)));
  };

  const rejectOt = (id: number | string) => {
    if (!confirm("ไม่อนุมัติคำขอ OT (mock)?")) return;
    setOts((s) => s.map((x) => (x.id === id ? { ...x, status: "ไม่อนุมัติ" } : x)));
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">การลาและ OT (Leave & Overtime)</h1>

      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <InfoCard title="คำขอลาทั้งหมด" value={totalLeaves + " รายการ"} color="border-blue-500" />
        <InfoCard title="รออนุมัติ" value={pendingLeaves + " รายการ"} color="border-yellow-500" />
        <InfoCard title="อนุมัติแล้ว" value={approvedLeaves + " รายการ"} color="border-green-600" />
        <InfoCard title="ไม่อนุมัติ" value={rejectedLeaves + " รายการ"} color="border-red-600" />
      </div>

      {/* Tab + actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex gap-4">
          <button
            onClick={() => setTab("leave")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold ${
              tab === "leave" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            คำขอลา
          </button>

          <button
            onClick={() => setTab("ot")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold ${
              tab === "ot" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            คำขอ OT
          </button>
        </div>

        <div className="flex gap-3">
          {tab === "leave" ? (
            <button onClick={openCreateLeave} className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
              + ยื่นคำขอลา
            </button>
          ) : (
            <button onClick={openCreateOt} className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
              + ยื่นคำขอ OT
            </button>
          )}
        </div>
      </div>

      {/* Leave Table */}
      {tab === "leave" && (
        <SectionPanel title="รายการคำขอลา">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-bold text-gray-600">ชื่อบุคลากร</th>
                  <th className="px-3 py-2 text-left text-xs font-bold text-gray-600">ประเภทการลา</th>
                  <th className="px-3 py-2 text-left text-xs font-bold text-gray-600">วันที่เริ่ม</th>
                  <th className="px-3 py-2 text-left text-xs font-bold text-gray-600">วันที่สิ้นสุด</th>
                  <th className="px-3 py-2 text-center text-xs font-bold text-gray-600">จำนวนวัน</th>
                  <th className="px-3 py-2 text-left text-xs font-bold text-gray-600">สถานะ</th>
                  <th className="px-3 py-2 text-center text-xs font-bold text-gray-600">จัดการ</th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-100">
                {leaves.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-sm">{item.name}</td>
                    <td className="px-3 py-2 text-sm">{item.type}</td>
                    <td className="px-3 py-2 text-sm">{item.start}</td>
                    <td className="px-3 py-2 text-sm">{item.end}</td>
                    <td className="px-3 py-2 text-center text-sm font-bold">{item.days}</td>
                    <td className={`px-3 py-2 text-sm font-semibold ${
                      item.status === "อนุมัติแล้ว" ? "text-green-600" : item.status === "รออนุมัติ" ? "text-yellow-600" : "text-red-600"
                    }`}>{item.status}</td>
                    <td className="px-3 py-2 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openEditLeave(item)} className="px-3 py-1 bg-yellow-500 text-white rounded">แก้ไข</button>

                        {item.status !== "อนุมัติแล้ว" && (
                          <>
                            <button onClick={() => approveLeave(item.id)} className="px-3 py-1 bg-green-600 text-white rounded">อนุมัติ</button>
                            <button onClick={() => rejectLeave(item.id)} className="px-3 py-1 bg-red-600 text-white rounded">ไม่อนุมัติ</button>
                          </>
                        )}

                        <button onClick={() => deleteLeave(item.id)} className="px-3 py-1 bg-gray-300 text-gray-800 rounded">ลบ</button>
                      </div>
                    </td>
                  </tr>
                ))}

                {leaves.length === 0 && (
                  <tr><td colSpan={7} className="text-center p-6 text-gray-500">ยังไม่มีคำขอ</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </SectionPanel>
      )}

      {/* OT Table */}
      {tab === "ot" && (
        <SectionPanel title="รายการคำขอทำงานล่วงเวลา (OT)">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-bold text-gray-600">ชื่อบุคลากร</th>
                  <th className="px-3 py-2 text-left text-xs font-bold text-gray-600">วันที่</th>
                  <th className="px-3 py-2 text-center text-xs font-bold text-gray-600">ชั่วโมง OT</th>
                  <th className="px-3 py-2 text-left text-xs font-bold text-gray-600">สถานะ</th>
                  <th className="px-3 py-2 text-center text-xs font-bold text-gray-600">จัดการ</th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-100">
                {ots.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-sm">{item.name}</td>
                    <td className="px-3 py-2 text-sm">{item.date}</td>
                    <td className="px-3 py-2 text-center text-sm font-bold">{item.hours}</td>
                    <td className={`px-3 py-2 text-sm font-semibold ${item.status === "อนุมัติแล้ว" ? "text-green-600" : "text-yellow-600"}`}>{item.status}</td>
                    <td className="px-3 py-2 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openEditOt(item)} className="px-3 py-1 bg-yellow-500 text-white rounded">แก้ไข</button>

                        {item.status !== "อนุมัติแล้ว" && (
                          <>
                            <button onClick={() => approveOt(item.id)} className="px-3 py-1 bg-green-600 text-white rounded">อนุมัติ</button>
                            <button onClick={() => rejectOt(item.id)} className="px-3 py-1 bg-red-600 text-white rounded">ไม่อนุมัติ</button>
                          </>
                        )}

                        <button onClick={() => deleteOt(item.id)} className="px-3 py-1 bg-gray-300 text-gray-800 rounded">ลบ</button>
                      </div>
                    </td>
                  </tr>
                ))}

                {ots.length === 0 && (
                  <tr><td colSpan={5} className="text-center p-6 text-gray-500">ยังไม่มีคำขอ OT</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </SectionPanel>
      )}

      {/* Leave Modal */}
      {openLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpenLeaveModal(false)} />
          <div className="relative bg-white rounded-lg p-6 w-full max-w-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-3">{editingLeave ? "แก้ไขคำขอลา" : "ยื่นคำขอลา"}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-600">ชื่อพนักงาน</label>
                <input className="p-2 border rounded w-full" value={leaveForm.name || ""} onChange={(e) => setLeaveForm((f) => ({ ...f, name: e.target.value }))} />
              </div>

              <div>
                <label className="text-sm text-gray-600">ประเภทการลา</label>
                <select className="p-2 border rounded w-full" value={leaveForm.type || "ลาพักผ่อน"} onChange={(e) => setLeaveForm((f) => ({ ...f, type: e.target.value }))}>
                  <option>ลาพักผ่อน</option>
                  <option>ลาป่วย</option>
                  <option>ลากิจ</option>
                  <option>ลาคลอด</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600">วันที่เริ่ม</label>
                <input type="date" className="p-2 border rounded w-full" value={leaveForm.start || ""} onChange={(e) => setLeaveForm((f) => ({ ...f, start: e.target.value }))} />
              </div>

              <div>
                <label className="text-sm text-gray-600">วันที่สิ้นสุด</label>
                <input type="date" className="p-2 border rounded w-full" value={leaveForm.end || ""} onChange={(e) => setLeaveForm((f) => ({ ...f, end: e.target.value }))} />
              </div>

              <div>
                <label className="text-sm text-gray-600">จำนวนวัน</label>
                <input type="number" min={1} className="p-2 border rounded w-full" value={leaveForm.days ?? 1} onChange={(e) => setLeaveForm((f) => ({ ...f, days: Number(e.target.value) }))} />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm text-gray-600">เหตุผล / หมายเหตุ</label>
                <textarea className="p-2 border rounded w-full" value={leaveForm.reason || ""} onChange={(e) => setLeaveForm((f) => ({ ...f, reason: e.target.value }))} />
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setOpenLeaveModal(false)} className="px-3 py-2 border rounded">ยกเลิก</button>
              <button onClick={saveLeave} className="px-4 py-2 bg-blue-600 text-white rounded">{editingLeave ? "บันทึกการแก้ไข" : "ยื่นคำขอ"}</button>
            </div>
          </div>
        </div>
      )}

      {/* OT Modal */}
      {openOtModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpenOtModal(false)} />
          <div className="relative bg-white rounded-lg p-6 w-full max-w-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-3">{editingOt ? "แก้ไขคำขอ OT" : "ยื่นคำขอ OT"}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-600">ชื่อพนักงาน</label>
                <input className="p-2 border rounded w-full" value={otForm.name || ""} onChange={(e) => setOtForm((f) => ({ ...f, name: e.target.value }))} />
              </div>

              <div>
                <label className="text-sm text-gray-600">วันที่</label>
                <input type="date" className="p-2 border rounded w-full" value={otForm.date || ""} onChange={(e) => setOtForm((f) => ({ ...f, date: e.target.value }))} />
              </div>

              <div>
                <label className="text-sm text-gray-600">จำนวนชั่วโมง</label>
                <input type="number" min={1} className="p-2 border rounded w-full" value={otForm.hours ?? 1} onChange={(e) => setOtForm((f) => ({ ...f, hours: Number(e.target.value) }))} />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm text-gray-600">เหตุผล / หมายเหตุ</label>
                <textarea className="p-2 border rounded w-full" value={otForm.reason || ""} onChange={(e) => setOtForm((f) => ({ ...f, reason: e.target.value }))} />
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setOpenOtModal(false)} className="px-3 py-2 border rounded">ยกเลิก</button>
              <button onClick={saveOt} className="px-4 py-2 bg-blue-600 text-white rounded">{editingOt ? "บันทึกการแก้ไข" : "ยื่นคำขอ OT"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
