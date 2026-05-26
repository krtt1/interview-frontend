// src/components/profile/EditProfileModal.tsx
"use client";

import React, { useEffect, useState } from "react";
import API from "@/lib/api";
import { APIEmployee, CurrentUser } from "@/hooks/useEmployees";

type Option = { id: number | string; name: string };

type FormState = {
  phone_number: string;
  email: string;
  gender: "" | "ชาย" | "หญิง" | null;
  birt_date: string;
  age: number | null;
  job_title_id: number | string | "";
  position_level_id: number | string | "";
  position_type_id: number | string | "";
  job_group_id: number | string | ""; 
  education_level: string;
  degree_name: string;
  institution_name: string;
  graduation_year: string;
  degree_for_employment: string;
  highest_degree: string;
  professional_license_degree: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  me: { id: string; raw: APIEmployee };
  onSaved: (updated: APIEmployee) => void;
  jobTitles?: Option[];
  positionLevels?: Option[];
  positionTypes?: Option[];
  jobGroups?: Option[]; 
  educationLevelOptions?: string[];
  currentUser?: CurrentUser | null;
};

export default function EditProfileModal({
  open,
  onClose,
  me,
  onSaved,
  jobTitles = [],
  positionLevels = [],
  positionTypes = [],
  jobGroups = [], 
  educationLevelOptions = [],
  currentUser = null,
}: Props) {
  const raw = me.raw;

  const [form, setForm] = useState<FormState>({
    phone_number: raw.phone_number ?? "",
    email: raw.email ?? "",
    gender: (raw.gender as "ชาย" | "หญิง" | null | undefined) ?? "",
    birt_date: raw.birt_date ?? "",
    age: raw.age ?? null,
    job_title_id: raw.job_title_id ? String(raw.job_title_id) : "",
    position_level_id: raw.position_level_id ? String(raw.position_level_id) : "",
    position_type_id: raw.position_type_id ? String(raw.position_type_id) : "",
    job_group_id: raw.job_group_id ? String(raw.job_group_id) : "", 
    education_level: raw.education_level ?? "",
    degree_name: raw.degree_name ?? "",
    institution_name: raw.institution_name ?? "",
    graduation_year: raw.graduation_year ?? "",
    degree_for_employment: raw.degree_for_employment ?? "",
    highest_degree: raw.highest_degree ?? "",
    professional_license_degree: raw.professional_license_degree ?? "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [serverNotice, setServerNotice] = useState<{
    title: string;
    detail: string;
    payload?: Partial<APIEmployee>;
  } | null>(null);

  useEffect(() => {
    if (!open) return;
    setForm({
      phone_number: raw.phone_number ?? "",
      email: raw.email ?? "",
      gender: (raw.gender as "ชาย" | "หญิง" | null | undefined) ?? "",
      birt_date: raw.birt_date ?? "",
      age: raw.age ?? null,
      job_title_id: raw.job_title_id ? String(raw.job_title_id) : "",
      position_level_id: raw.position_level_id ? String(raw.position_level_id) : "",
      position_type_id: raw.position_type_id ? String(raw.position_type_id) : "",
      job_group_id: raw.job_group_id ? String(raw.job_group_id) : "", 
      education_level: raw.education_level ?? "",
      degree_name: raw.degree_name ?? "",
      institution_name: raw.institution_name ?? "",
      graduation_year: raw.graduation_year ?? "",
      degree_for_employment: raw.degree_for_employment ?? "",
      highest_degree: raw.highest_degree ?? "",
      professional_license_degree: raw.professional_license_degree ?? "",
    });
    setError(null);
    setServerNotice(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, raw]);

  const handleChange =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = e.target.value;
      console.debug("[EditProfileModal] handleChange:", key, value);
      setForm((f) => ({ ...f, [key]: value } as FormState));
    };

  const handleNumberChange =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      console.debug("[EditProfileModal] handleNumberChange:", key, val);
      setForm((f) => ({
        ...f,
        [key]: val === "" ? null : Number(val),
      } as FormState));
    };

  const calcAgeFromDate = (dateStr?: string | null) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    const now = new Date();
    let age = now.getFullYear() - d.getFullYear();
    const m = now.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
    return age;
  };

  const fkEqual = (a: any, b: any) => {
    const ka = a?.job_title_id ?? null;
    const kb = b?.job_title_id ?? null;
    const pa = a?.position_level_id ?? null;
    const pb = b?.position_level_id ?? null;
    const ta = a?.position_type_id ?? null;
    const tb = b?.position_type_id ?? null;
    const ga = a?.job_group_id ?? null;
    const gb = b?.job_group_id ?? null;
    return String(ka) === String(kb) && String(pa) === String(pb) && String(ta) === String(tb) && String(ga) === String(gb);
  };

  const lookupName = (list: Option[] | undefined, id: any) => {
    if (!list || id === undefined || id === null || id === "") return undefined;
    const found = list.find((x) => String(x.id) === String(id));
    return found ? found.name : undefined;
  };

  const handleSave = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e && typeof (e as any).preventDefault === "function") (e as any).preventDefault();

    console.debug("[EditProfileModal] handleSave START, form =", form);
    setError(null);
    setServerNotice(null);

    let finalAge = typeof form.age === "number" ? form.age : null;
    if ((finalAge === null || finalAge === undefined) && form.birt_date) {
      finalAge = calcAgeFromDate(form.birt_date);
    }
    if (finalAge === null || finalAge === undefined) {
      setError("กรุณาระบุอายุหรือวันเกิด (ระบบต้องการ age)");
      console.debug("[EditProfileModal] handleSave ABORT missing age");
      return;
    }

    try {
      setSaving(true);

      const genderNarrowed: "ชาย" | "หญิง" | null | undefined =
        form.gender === "ชาย" || form.gender === "หญิง"
          ? form.gender
          : form.gender === null
          ? null
          : undefined;

      const payload: Partial<APIEmployee> = {
        phone_number: form.phone_number || undefined,
        email: form.email || undefined,
        gender: genderNarrowed,
        birt_date: form.birt_date || undefined,
        age: Number(finalAge),
        job_title_id:
          form.job_title_id === "" || form.job_title_id === undefined
            ? undefined
            : Number(form.job_title_id),
        position_level_id:
          form.position_level_id === "" || form.position_level_id === undefined
            ? undefined
            : Number(form.position_level_id),
        position_type_id:
          form.position_type_id === "" || form.position_type_id === undefined
            ? undefined
            : Number(form.position_type_id),
        job_group_id:
          form.job_group_id === "" || form.job_group_id === undefined
            ? undefined
            : Number(form.job_group_id), 
        education_level: form.education_level || undefined,
        degree_name: form.degree_name || undefined,
        institution_name: form.institution_name || undefined,
        graduation_year: form.graduation_year || undefined,
        degree_for_employment: form.degree_for_employment || undefined,
        highest_degree: form.highest_degree || undefined,
        professional_license_degree:
          form.professional_license_degree || undefined,
      };

      console.debug("[EditProfileModal] payload before PUT ->", payload);

      const url = `/employees/${me.id}`;
      const putRes = await API.put(url, payload);
      console.debug("[EditProfileModal] PUT response ->", putRes);

      let updated: any = putRes?.data ?? undefined;
      if (!updated) {
        try {
          const getRes = await API.get(`/employees/${me.id}`);
          updated = getRes?.data ?? undefined;
          console.debug("[EditProfileModal] GET after PUT ->", getRes);
        } catch (gerr) {
          console.warn("[EditProfileModal] GET after PUT failed:", gerr);
        }
      }

      if (updated) {
        const serverObj: APIEmployee = updated?.data ?? updated;

        const enriched = {
          ...serverObj,
          job_title_name: serverObj.job_title_name ?? lookupName(jobTitles, serverObj.job_title_id),
          position_level_name:
            serverObj.position_level_name ?? lookupName(positionLevels, serverObj.position_level_id),
          position_type_name:
            serverObj.position_type_name ?? lookupName(positionTypes, serverObj.position_type_id),
          job_group_name:
            serverObj.job_group_name ?? lookupName(jobGroups, serverObj.job_group_id), 
        };

        const payloadAsObj = { ...(me.raw || {}), ...payload, id: me.id };
        if (!fkEqual(enriched, payloadAsObj)) {
          setServerNotice({
            title: "การเปลี่ยนตำแหน่งยังไม่ถูกบันทึกถาวร",
            detail:
              "ระบบไม่สามารถบันทึกการเปลี่ยนตำแหน่ง/ระดับ ได้อัตโนมัติ หากต้องการให้เปลี่ยนถาวร กรุณาส่งคำขอให้ผู้ดูแลระบบดำเนินการ",
            payload,
          });
        }

        onSaved(enriched);
      } else {
        console.warn(
          "[EditProfileModal] Server did not return updated object — performing optimistic update (frontend only). If backend strips fields, changes won't persist on refresh."
        );
        const optimistic = {
          ...(me.raw || {}),
          ...payload,
          id: me.id,
          job_title_name: lookupName(jobTitles, payload.job_title_id),
          position_level_name: lookupName(positionLevels, payload.position_level_id),
          position_type_name: lookupName(positionTypes, payload.position_type_id),
          job_group_name: lookupName(jobGroups, payload.job_group_id), 
        } as APIEmployee;

        if (!fkEqual(optimistic, me.raw)) {
          setServerNotice({
            title: "การเปลี่ยนแปลงถูกบันทึกในหน้าจอเท่านั้น",
            detail:
              "การเปลี่ยนแปลงตำแหน่ง/ระดับถูกแสดงผลในแอป แต่ระบบเซิร์ฟเวอร์อาจยังไม่รับการเปลี่ยนแปลงจริง หากต้องการให้ถาวร กรุณาส่งคำขอให้ผู้ดูแลระบบดำเนินการ",
            payload,
          });
        }

        onSaved(optimistic);
      }

      onClose();
    } catch (err: any) {
      console.error("[EditProfileModal] save profile error:", err);
      const serverMsg = err?.response?.data?.message || err?.response?.data || err?.message;
      if (err?.response?.status === 403) {
        setError("ไม่มีสิทธิ์แก้ไขข้อมูล โปรดติดต่อผู้ดูแลระบบ");
      } else if (err?.response?.status === 404) {
        setError("ไม่พบ endpoint สำหรับอัพเดต (404) — ตรวจสอบ backend");
      } else {
        setError(String(serverMsg ?? "บันทึกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง"));
      }
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  const makeAdminRequestText = (payload?: Partial<APIEmployee>) => {
    const lines = [
      `Request: Update employee ${me.id}`,
      `Requested by user: ${(currentUser as any)?.id ?? "unknown"} (${(currentUser as any)?.role ?? "no-role"})`,
      "",
      "Requested changes:",
    ];
    if (!payload) {
      lines.push(" - (no payload)");
    } else {
      Object.entries(payload).forEach(([k, v]) => {
        lines.push(` - ${k}: ${String(v)}`);
      });
    }
    lines.push("", "Reason:", "กรุณาระบุเหตุผล/คำอธิบายเพิ่มเติมที่นี่");
    return lines.join("\n");
  };

  const handleCopyRequest = async () => {
    if (!serverNotice?.payload) return;
    const txt = makeAdminRequestText(serverNotice.payload);
    try {
      await navigator.clipboard.writeText(txt);
      alert("ข้อความคำขอถูกคัดลอกแล้ว — วางแล้วส่งหา admin ได้เลย");
    } catch (e) {
      window.prompt("คัดลอกข้อความด้านล่างเพื่อส่งให้ admin:", txt);
    }
  };

  const handleMailToAdmin = () => {
    if (!serverNotice?.payload) return;
    const subject = encodeURIComponent(`ขอเปลี่ยนข้อมูลพนักงาน ${me.id}`);
    const body = encodeURIComponent(makeAdminRequestText(serverNotice.payload));
    window.location.href = `mailto:admin@example.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 z-[9990]"
        onClick={onClose}
        aria-hidden
      />

      <div
        role="dialog"
        aria-modal="true"
        className="relative z-[9999] bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-scroll p-6 space-y-4 pointer-events-auto"
      >
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-800">แก้ไขข้อมูลของฉัน</h2>
          <button onClick={onClose} className="text-sm text-gray-500 hover:text-gray-700">✕ ปิด</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block text-xs text-gray-500 mb-1">เบอร์โทร</label>
            <input
              className="w-full border rounded-lg px-3 py-2 text-sm"
              value={form.phone_number}
              onChange={handleChange("phone_number")}
              placeholder="081-xxx-xxxx"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">อีเมล</label>
            <input
              className="w-full border rounded-lg px-3 py-2 text-sm"
              value={form.email}
              onChange={handleChange("email")}
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">เพศ</label>
            <select
              className="w-full border rounded-lg px-3 py-2 text-sm"
              value={form.gender ?? ""}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  gender:
                    e.target.value === ""
                      ? ""
                      : (e.target.value as "ชาย" | "หญิง"),
                }))
              }
            >
              <option value="">- ไม่ระบุ -</option>
              <option value="ชาย">ชาย</option>
              <option value="หญิง">หญิง</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">วันเกิด</label>
            <input
              type="date"
              className="w-full border rounded-lg px-3 py-2 text-sm"
              value={form.birt_date ?? ""}
              onChange={handleChange("birt_date")}
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">อายุ</label>
            <input
              type="number"
              min={0}
              max={120}
              className="w-full border rounded-lg px-3 py-2 text-sm"
              value={form.age ?? ""}
              onChange={handleNumberChange("age")}
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">ประเภทบุคลากร</label>
            <select
              className="w-full border rounded-lg px-3 py-2 text-sm"
              value={form.job_title_id ?? ""}
              onChange={handleChange("job_title_id")}
            >
              <option value="">- ไม่ระบุ -</option>
              {jobTitles.map((t) => (
                <option key={String(t.id)} value={String(t.id)}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">ระดับตำแหน่ง</label>
            <select
              className="w-full border rounded-lg px-3 py-2 text-sm"
              value={form.position_level_id ?? ""}
              onChange={handleChange("position_level_id")}
            >
              <option value="">- ไม่ระบุ -</option>
              {positionLevels.map((l) => (
                <option key={String(l.id)} value={String(l.id)}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">ตำแหน่งสายงาน</label>
            <select
              className="w-full border rounded-lg px-3 py-2 text-sm"
              value={form.position_type_id ?? ""}
              onChange={handleChange("position_type_id")}
            >
              <option value="">- ไม่ระบุ -</option>
              {positionTypes.map((p) => (
                <option key={String(p.id)} value={String(p.id)}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* NEW: job group select */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">กลุ่มงาน</label>
            <select
              className="w-full border rounded-lg px-3 py-2 text-sm"
              value={form.job_group_id ?? ""}
              onChange={handleChange("job_group_id")}
            >
              <option value="">- ไม่ระบุ -</option>
              {jobGroups.map((g) => (
                <option key={String(g.id)} value={String(g.id)}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">ระดับการศึกษา</label>
            {educationLevelOptions.length > 0 ? (
              <select
                className="w-full border rounded-lg px-3 py-2 text-sm"
                value={form.education_level ?? ""}
                onChange={handleChange("education_level")}
              >
                <option value="">- ไม่ระบุ -</option>
                {educationLevelOptions.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
            ) : (
              <input
                className="w-full border rounded-lg px-3 py-2 text-sm"
                value={form.education_level}
                onChange={handleChange("education_level")}
              />
            )}
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">วุฒิการศึกษา</label>
            <input
              className="w-full border rounded-lg px-3 py-2 text-sm"
              value={form.degree_name}
              onChange={handleChange("degree_name")}
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">สถาบันการศึกษา</label>
            <input
              className="w-full border rounded-lg px-3 py-2 text-sm"
              value={form.institution_name}
              onChange={handleChange("institution_name")}
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">ปีที่จบการศึกษา</label>
            <input
              type="date"
              className="w-full border rounded-lg px-3 py-2 text-sm"
              value={form.graduation_year ?? ""}
              onChange={handleChange("graduation_year")}
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">วุฒิที่ใช้บรรจุ</label>
            <input
              className="w-full border rounded-lg px-3 py-2 text-sm"
              value={form.degree_for_employment}
              onChange={handleChange("degree_for_employment")}
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">วุฒิสูงสุด</label>
            <input
              className="w-full border rounded-lg px-3 py-2 text-sm"
              value={form.highest_degree}
              onChange={handleChange("highest_degree")}
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">ใบประกอบวิชาชีพ</label>
            <input
              className="w-full border rounded-lg px-3 py-2 text-sm"
              value={form.professional_license_degree}
              onChange={handleChange("professional_license_degree")}
            />
          </div>
        </div>

        {error && (
          <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
            {error}
          </div>
        )}

        {serverNotice && (
          <div className="text-sm bg-yellow-50 border border-yellow-200 rounded p-3">
            <div className="font-semibold text-yellow-800">
              {serverNotice.title}
            </div>
            <div className="text-yellow-700 mt-1">
              {serverNotice.detail}
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={handleCopyRequest}
                className="px-3 py-1 rounded bg-yellow-700 text-white text-sm"
              >
                คัดลอกคำขอให้ผู้ดูแล
              </button>
              <button
                onClick={handleMailToAdmin}
                className="px-3 py-1 rounded border text-sm"
              >
                ส่งเมลหาแอดมิน
              </button>
              <button
                onClick={() => {
                  setServerNotice(null);
                }}
                className="px-3 py-1 rounded border text-sm"
              >
                ปิด
              </button>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              (หมายเหตุ: อีเมลจะถูกเปิดด้วย mailto: และต้องตั้ง
              admin@example.com ให้เป็นอีเมลจริง)
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border text-sm"
            disabled={saving}
          >
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={(e) => handleSave(e)}
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium disabled:opacity-60 relative z-[10000]"
          >
            {saving ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
          </button>
        </div>
      </div>
    </div>
  );
}