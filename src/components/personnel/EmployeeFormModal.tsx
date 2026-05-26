"use client";

import React, { useEffect, useState } from "react";
import { UIEmployee, WORK_STATUS_OPTIONS, WorkStatus } from "@/hooks/useEmployees";

type Props = {
  show: boolean;
  form: Partial<UIEmployee> | null;
  setForm: React.Dispatch<React.SetStateAction<Partial<UIEmployee> | null>>;
  onClose: () => void;
  // onSave accepts prepared payload and MAY return saved employee (object) for optimistic merge
  onSave: (payload?: Partial<UIEmployee & Record<string, any>>) => Promise<any> | void;
  editing: UIEmployee | null;
};

const ssnRegex = /^\d{13}$/;

const EmployeeFormModal: React.FC<Props> = ({
  show,
  form,
  setForm,
  onClose,
  onSave,
  editing,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const f = form as any;

  useEffect(() => {
    setErrors({});
  }, [editing]);

  const val = (k: any) => {
    const v = k ?? "";
    if (String(v).trim() === "—") return "";
    return v;
  };

  // compute age from birth date (YYYY-MM-DD)
  const computeAgeFromBirthDate = (bd: string | undefined | null) => {
    if (!bd) return undefined;
    const d = new Date(bd);
    if (isNaN(d.getTime())) return undefined;
    const today = new Date();
    let age = today.getFullYear() - d.getFullYear();
    const m = today.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
    return age;
  };

  const validate = () => {
    if (!form) return false;

    const e: Record<string, string> = {};

    // ใช้ (form as any) เพื่อข้ามการเช็ก Type ของฟิลด์ชื่อและนามสกุลชั่วคราว
    if (!val((form as any).first_name_th) && !val(form.raw?.first_name_th))
      e.first_name_th = "กรุณากรอกชื่อ";

    if (!val((form as any).last_name_th) && !val(form.raw?.last_name_th))
      e.last_name_th = "กรุณากรอกนามสกุล";

    // Validate national ID only when creating
    if (!editing) {
      const nid = String(val((form as any)?.national_id ?? (form as any)?.username ?? "")).trim();
      if (!nid)
        e.national_id = "กรุณากรอกเลขบัตรประชาชน (ใช้เป็น username)";
      else if (!ssnRegex.test(nid))
        e.national_id = "เลขบัตรประชาชนต้องมี 13 หลัก";
    }

    // Password validation
    if (!editing) {
      const pw = val((form as any).password ?? "");
      if (pw && pw.length < 4)
        e.password = "รหัสต้องมีอย่างน้อย 4 ตัวอักษร";
    } else {
      const pw = val((form as any).password ?? "");
      if (pw && pw.length > 0 && pw.length < 4)
        e.password = "รหัสต้องมีอย่างน้อย 4 ตัวอักษร";
    }

    // require birth_date / validate age
    const birthDateVal = String(
      val((form as any).birth_date ?? form.raw?.birth_date ?? "")
    ).trim();
    const ageComputed = computeAgeFromBirthDate(
      birthDateVal || undefined
    );

    if (!editing) {
      if (!birthDateVal) {
        e.birth_date = "กรุณาเลือกวันเกิด";
      } else if (ageComputed === undefined) {
        e.birth_date = "รูปแบบวันเกิดไม่ถูกต้อง";
      } else if (
        !Number.isInteger(ageComputed) ||
        (ageComputed as number) < 15 ||
        (ageComputed as number) > 120
      ) {
        e.birth_date =
          "อายุควรเป็นระหว่าง 15-120 ปี (จากวันเกิดที่เลือก)";
      }
    } else {
      if (birthDateVal) {
        if (ageComputed === undefined) {
          e.birth_date = "รูปแบบวันเกิดไม่ถูกต้อง";
        } else if (
          !Number.isInteger(ageComputed) ||
          (ageComputed as number) < 15 ||
          (ageComputed as number) > 120
        ) {
          e.birth_date =
            "อายุควรเป็นระหว่าง 15-120 ปี (จากวันเกิดที่เลือก)";
        }
      } else if (form.age !== undefined && form.age !== null) {
        const n = Number(form.age);
        if (!Number.isInteger(n) || n < 15 || n > 120) {
          e.age = "อายุควรเป็นจำนวนเต็มระหว่าง 15-120";
        }
      }
    }

    if (
      val(form.phone) &&
      !/^[0-9+\s-]{6,20}$/.test(String(form.phone))
    )
      e.phone = "รูปแบบเบอร์โทรไม่ถูกต้อง";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const computeDefaultAge = () => {
    if (!form) return undefined;
    const bd = (form as any).birth_date ?? form.raw?.birth_date;
    const ageNum = bd
      ? computeAgeFromBirthDate(String(bd))
      : form.age ?? form.raw?.age;
    return ageNum;
  };

  const buildPayload = (): Partial<UIEmployee & Record<string, any>> | null => {
    if (!form) return null;

    const nidRaw = String(
      val((form as any).national_id ?? (form as any).username ?? form.id ?? "")
    ).replace(/\D/g, "");
    const nid = nidRaw;
    const username = nid;
    const id = nid;

    const pwFromForm = String(val((form as any).password ?? ""));
    let passwordToSend: string | undefined;
    if (!editing) {
      passwordToSend = pwFromForm || (nid.length >= 4 ? nid.slice(-4) : "");
    } else {
      passwordToSend = pwFromForm || undefined;
    }

    const ageNum = computeDefaultAge();

    let rawBirthDate = (form as any).birth_date ?? form.raw?.birth_date;
    if (typeof rawBirthDate === "string" && rawBirthDate.trim() === "") {
      rawBirthDate = null;
    }

    // FIX: แก้ไขจุดที่ทำให้ Build Failed โดยการใช้ (form as any) 
    // เพื่อดึงค่า phone_number ที่ TypeScript มองไม่เห็นใน Interface
    const phoneVal = form.phone ?? (form as any).phone_number ?? form.raw?.phone_number ?? null;

    const payload: Partial<UIEmployee & Record<string, any>> = {
      ...form,
      national_id: nid,
      username,
      id,

      phone_number: phoneVal,
      phone: phoneVal,

      birt_date: rawBirthDate || null,

      age: ageNum ?? form.age ?? form.raw?.age ?? null,
      gender: (form.gender ?? form.raw?.gender ?? null) as "ชาย" | "หญิง" | null,
      work_status: (form as any).work_status ?? form.workStatus ?? form.raw?.work_status ?? "ปฏิบัติหน้าที่",
    };

    if ("birth_date" in payload) {
      // @ts-ignore
      delete payload.birth_date;
    }

    if (typeof passwordToSend === "string" && passwordToSend !== "") {
      payload.password = passwordToSend;
    } else {
      if ("password" in payload) {
        try {
          // @ts-ignore
          delete payload.password;
        } catch {}
      }
    }

    if ("raw" in payload) {
      try {
        // @ts-ignore
        delete payload.raw;
      } catch {}
    }

    return payload;
  };

  const handleSave = async () => {
    if (!validate()) return;
    const payload = buildPayload();
    if (!payload) return;

    try {
      setLoading(true);
      const result = await onSave(payload);
      const f = form as any;
      
      if (result && typeof result === "object") {
         setForm(prev => ({ ...prev, ...result }));
      }

      onClose(); 
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "กรุณาตรวจสอบข้อมูล";
      alert("บันทึกไม่สำเร็จ: " + errorMsg);
    } finally {
      setLoading(false);
      const f = form as any;
    }
  };

  const onBirthDateChange = (v: string) => {
    if (!form) return;
    const age = computeAgeFromBirthDate(v);
    setForm({
      ...form,
      birth_date: v === "" ? undefined : v,
      age: age,
    } as any);
  };

  if (!show || !form) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-lg w-full max-w-2xl shadow-lg overflow-auto">
        <div className="p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {editing ? "แก้ไขบุคลากร" : "เพิ่มบุคลากร"}
            </h3>
            <button onClick={onClose} className="text-gray-500">
              ปิด
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* National ID */}
            <div>
              <label className="text-sm">เลขบัตรประชาชน (ใช้เป็น username)</label>
              <input
                className={`w-full p-2 border rounded mt-1 ${
                  errors.national_id ? "border-red-400" : ""
                }`}
                value={val(
                  (form as any).national_id ??
                    (form as any).username ??
                    form.id ??
                    ""
                )}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "").slice(0, 13); // จำกัดแค่ 13 หลัก
                  setForm({
                    ...form,
                    national_id: v,
                    username: v,
                    id: v,
                  } as any);
                }}
                placeholder="13 หลัก"
                maxLength={13}
              />
              {errors.national_id && (
                <div className="text-xs text-red-600 mt-1">
                  {errors.national_id}
                </div>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="text-sm">
                รหัสผ่านชั่วคราว {editing ? "(เว้นว่างเพื่อไม่เปลี่ยน)" : ""}
              </label>
              <input
                type="password"
                className={`w-full p-2 border rounded mt-1 ${
                  errors.password ? "border-red-400" : ""
                }`}
                value={val((form as any).password ?? "")}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value } as any)
                }
                placeholder={
                  editing
                    ? "เว้นว่างหากไม่ต้องการเปลี่ยนรหัส"
                    : "ถ้าว่าง ระบบจะตั้งเป็น 4 ตัวท้ายของเลขบัตร"
                }
              />
              {errors.password && (
                <div className="text-xs text-red-600 mt-1">
                  {errors.password}
                </div>
              )}
            </div>

            {/* Prefix */}
            <div>
              <label className="text-sm">คำนำหน้า</label>
              <select
   
    value={val((form as any).prefix_th ?? form.raw?.prefix_th ?? "")}
    onChange={(e) =>
      
      setForm({ ...form, prefix_th: e.target.value } as any)
    }
    className="w-full p-2 border rounded mt-1"
  >
                <option value="">- เลือก -</option>
                <option value="นาย">นาย</option>
                <option value="นาง">นาง</option>
                <option value="นางสาว">นางสาว</option>
              </select>
            </div>

            {/* Role */}
            <div>
              <label className="text-sm">บทบาท (role)</label>
              <select
                value={val((form as any).role ?? form.raw?.role ?? "user")}
                onChange={(e) =>
                  setForm({ ...form, role: e.target.value } as any)
                }
                className="w-full p-2 border rounded mt-1"
              >
                <option value="user">พนักงาน</option>
                <option value="admin">ผู้ดูแลระบบ</option>
              </select>
            </div>

            {/* First Name */}
            <div>
              <label className="text-sm">ชื่อ</label>
              <input
                className={`w-full p-2 border rounded mt-1 ${
                  errors.first_name_th ? "border-red-400" : ""
                }`}
                value={val(
                  (form as any).first_name_th ?? form.raw?.first_name_th ?? ""
                )}
                onChange={(e) =>
                  setForm({
                    ...form,
                    first_name_th: e.target.value,
                  } as any)
                }
              />
              {errors.first_name_th && (
                <div className="text-xs text-red-600 mt-1">
                  {errors.first_name_th}
                </div>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="text-sm">นามสกุล</label>
              <input
                className={`w-full p-2 border rounded mt-1 ${
                  errors.last_name_th ? "border-red-400" : ""
                }`}
                value={val(
                  (form as any).last_name_th ?? form.raw?.last_name_th ?? ""
                )}
                onChange={(e) =>
                  setForm({
                    ...form,
                    last_name_th: e.target.value,
                  } as any)
                }
              />
              {errors.last_name_th && (
                <div className="text-xs text-red-600 mt-1">
                  {errors.last_name_th}
                </div>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="text-sm">เพศ</label>
              <select
                value={val(form.gender ?? form.raw?.gender ?? "")}
                onChange={(e) =>
                  setForm({
                    ...form,
                    gender:
                      e.target.value === ""
                        ? null
                        : (e.target.value as "ชาย" | "หญิง"),
                  })
                }
                className={`w-full p-2 border rounded mt-1 ${
                  errors.gender ? "border-red-400" : ""
                }`}
              >
                <option value="">- ไม่ระบุ -</option>
                <option value="ชาย">ชาย</option>
                <option value="หญิง">หญิง</option>
              </select>
              {errors.gender && (
                <div className="text-xs text-red-600 mt-1">
                  {errors.gender}
                </div>
              )}
            </div>

            {/* Birth Date */}
            <div>
              <label className="text-sm">วันเกิด</label>
              <input
                type="date"
                className={`w-full p-2 border rounded mt-1 ${
                  errors.birth_date ? "border-red-400" : ""
                }`}
                value={val(
                  (form as any).birth_date ?? form.raw?.birth_date ?? ""
                )}
                onChange={(e) => onBirthDateChange(e.target.value)}
              />
              {errors.birth_date && (
                <div className="text-xs text-red-600 mt-1">
                  {errors.birth_date}
                </div>
              )}
            </div>

            {/* Age */}
            <div>
              <label className="text-sm">อายุ (คำนวณอัตโนมัติ)</label>
              <input
                type="number"
                className={`w-full p-2 border rounded mt-1 ${
                  errors.age ? "border-red-400" : ""
                }`}
                value={val(form.age ?? form.raw?.age ?? "")}
                readOnly
                placeholder="เลือกวันเกิดเพื่อคำนวณอายุ"
              />
              {errors.age && (
                <div className="text-xs text-red-600 mt-1">
                  {errors.age}
                </div>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm">โทร</label>
              <input
                className={`w-full p-2 border rounded mt-1 ${
                  errors.phone ? "border-red-400" : ""
                }`}
                value={val(form.phone ?? (form as any).phone_number ?? form.raw?.phone_number ?? "")}
                onChange={(e) => {
                  const v = e.target.value;
                  setForm((prev) => {
                    if (!prev) return prev;
                    return {
                      ...prev,
                      phone: v,
                      phone_number: v,
                      raw: {
                        ...(prev.raw ?? {}),
                        phone_number: v,
                      },
                    } as any;
                  });
                }}
                placeholder="081-xxx-xxxx"
              />
              {errors.phone && (
                <div className="text-xs text-red-600 mt-1">
                  {errors.phone}
                </div>
              )}
            </div>

            {/* Work Status */}
            <div>
              <label className="text-sm">สถานะการทำงาน</label>
              <select
                value={val((form as any).work_status ?? form.workStatus ?? form.raw?.work_status ?? "ปฏิบัติหน้าที่")}
                onChange={(e) =>
                  setForm({
                    ...form,
                    work_status: e.target.value as WorkStatus,
                    workStatus: e.target.value as WorkStatus,
                  } as any)
                }
                className="w-full p-2 border rounded mt-1"
              >
                {WORK_STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              ยกเลิก
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
            >
              {loading
                ? "กำลังบันทึก..."
                : editing
                ? "บันทึกการแก้ไข"
                : "สร้างบุคลากร"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeFormModal;