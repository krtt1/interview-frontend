"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";

type Employee = {
  id: string;
  prefix_th?: string;
  first_name_th?: string;
  last_name_th?: string;
  jobTitle?: { name: string };
  jobGroup?: { group_name: string };
};

type Props = {
  open: boolean;
  command: any;
  onClose: () => void;
  onSaved: () => void;
};

const EditCommandModal: React.FC<Props> = ({
  open,
  command,
  onClose,
  onSaved,
}) => {
  const [form, setForm] = useState({
    command_title: "",
    command_detail: "",
    date: "",
    note: "",
  });

  const [employees, setEmployees] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState<Employee[]>([]);

  useEffect(() => {
    if (command) {
      setForm({
        command_title: command.command_title,
        command_detail: command.command_detail,
        date: command.date,
        note: command.note || "",
      });

      setEmployees(command.commandEmployees || []);
    }
  }, [command]);

  // Search logic
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

  if (!open) return null;

  const addEmployee = (emp: Employee) => {
    if (employees.some((e) => e.employee_id === emp.id)) return;
    setEmployees((prev) => [
      ...prev,
      {
        employee_id: emp.id,
        employee: {
          prefix_th: emp.prefix_th,
          first_name_th: emp.first_name_th,
          last_name_th: emp.last_name_th,
        },
        command_job: "",
      },
    ]);
    setSearch("");
    setSearchResult([]);
  };

  const removeEmployee = (employeeId: string) => {
    setEmployees((prev) => prev.filter((e) => e.employee_id !== employeeId));
  };

  const handleSave = async () => {
    try {
      // update หัวคำสั่งพร้อมรายชื่อพนักงานทั้งหมด
      await API.put(`/command/${command.command_id}`, {
        ...form,
        employees: employees.map((e) => ({
          employee_id: e.employee_id,
          command_job: e.command_job || null,
        })),
      });

      alert("บันทึกสำเร็จ");
      onSaved();
      onClose();
      
      // Reload page to show updated data
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (err) {
      console.error("Update error:", err);
      alert("แก้ไขไม่สำเร็จ");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-4xl rounded-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-800">แก้ไขคำสั่ง</h2>

        {/* =================== MAIN FORM =================== */}
        <div className="space-y-4">
          {/* ชื่อคำสั่ง */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ชื่อคำสั่ง
            </label>
            <input
              className="border p-2 rounded w-full"
              value={form.command_title}
              onChange={(e) =>
                setForm({ ...form, command_title: e.target.value })
              }
            />
          </div>

          {/* ประเภทคำสั่ง */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ประเภทคำสั่ง
            </label>
            <input
              className="border p-2 rounded w-full"
              value={form.command_detail}
              onChange={(e) =>
                setForm({ ...form, command_detail: e.target.value })
              }
            />
          </div>

          {/* วันที่คำสั่ง */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              วันที่คำสั่ง
            </label>
            <input
              type="date"
              className="border p-2 rounded w-full"
              value={form.date}
              onChange={(e) =>
                setForm({ ...form, date: e.target.value })
              }
            />
          </div>

          {/* หมายเหตุ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              หมายเหตุ
            </label>
            <textarea
              rows={3}
              className="border p-2 rounded w-full"
              value={form.note}
              onChange={(e) =>
                setForm({ ...form, note: e.target.value })
              }
            />
          </div>
        </div>

        {/* =================== EMPLOYEE SEARCH =================== */}
        <div className="border-t pt-4">
          <h3 className="font-semibold mb-2">
            เพิ่มบุคลากร ({employees.length} ท่าน)
          </h3>
          
          <div className="relative mb-4">
            <input
              placeholder="พิมพ์ชื่อ-นามสกุล เพื่อค้นหาและเพิ่มบุคลากร..."
              className="w-full border-2 border-blue-50 p-3 rounded-lg focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {searchResult.length > 0 && (
              <div className="absolute z-10 w-full bg-white border rounded-lg mt-2 shadow-xl max-h-56 overflow-y-auto">
                {searchResult.map((emp) => (
                  <div
                    key={emp.id}
                    className="p-3 hover:bg-blue-50 cursor-pointer flex justify-between items-center border-b last:border-0 transition-colors"
                    onClick={() => addEmployee(emp)}
                  >
                    <div className="text-sm">
                      <span className="font-bold">
                        {emp.prefix_th}{emp.first_name_th} {emp.last_name_th}
                      </span>
                      <p className="text-xs text-gray-500">
                        {emp.jobTitle?.name ?? "-"}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                      + เพิ่ม
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* =================== EMPLOYEE JOB =================== */}
        <div>
          <h3 className="font-semibold mb-2">
            หน้าที่ตามคำสั่งรายบุคคล
          </h3>

          <div className="space-y-2 max-h-64 overflow-y-auto border rounded p-3">
            {employees.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                ยังไม่มีบุคลากรในคำสั่งนี้
              </div>
            ) : (
              employees.map((e) => (
                <div
                  key={e.employee_id}
                  className="grid grid-cols-12 gap-2 items-center p-2 bg-gray-50 rounded"
                >
                  <div className="col-span-4 text-sm font-medium">
                    {e.employee?.prefix_th}
                    {e.employee?.first_name_th} {e.employee?.last_name_th}
                  </div>

                  <input
                    className="border p-2 rounded col-span-7"
                    placeholder="หน้าที่ตามคำสั่ง"
                    value={e.command_job || ""}
                    onChange={(ev) =>
                      setEmployees((prev) =>
                        prev.map((x) =>
                          x.employee_id === e.employee_id
                            ? { ...x, command_job: ev.target.value }
                            : x
                        )
                      )
                    }
                  />

                  <button
                    onClick={() => removeEmployee(e.employee_id)}
                    className="col-span-1 text-red-500 hover:text-red-700 font-bold text-lg"
                    title="ลบออก"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* =================== ACTION =================== */}
        <div className="flex justify-end gap-3 pt-4">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            ยกเลิก
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            บันทึก
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCommandModal;
