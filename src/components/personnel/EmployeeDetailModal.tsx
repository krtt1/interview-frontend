"use client";

import React from "react";
import { UIEmployee, WorkStatus } from "@/hooks/useEmployees";

type Map = Record<string, string>;

type Props = {
  show: boolean;
  emp: UIEmployee | null;
  onClose: () => void;
  jobTitlesMap?: Map;
  positionLevelsMap?: Map;
  positionTypesMap?: Map;
  jobGroupsMap?: Map; // <-- added
};

// สีสำหรับแสดงสถานะ
const STATUS_STYLES: Record<WorkStatus, { bg: string; text: string }> = {
  'ปฏิบัติหน้าที่': { bg: 'bg-green-100', text: 'text-green-700' },
  'หมดสัญญา': { bg: 'bg-orange-100', text: 'text-orange-700' },
  'โอนย้าย': { bg: 'bg-blue-100', text: 'text-blue-700' },
  'ลาออก': { bg: 'bg-red-100', text: 'text-red-700' },
  'เสียชีวิต': { bg: 'bg-gray-200', text: 'text-gray-700' },
};

const labelMap: Record<string, string> = {
  id: "รหัสบัตรประชาชน",
  email: "อีเมล",
  prefix_th: "คำนำหน้า",
  first_name_th: "ชื่อ",
  last_name_th: "นามสกุล",
  name: "ชื่อเต็ม",
  gender: "เพศ",
  birt_date: "วันเกิด",
  age: "อายุ",
  phone: "เบอร์โทร",
  phone_number: "เบอร์โทร",
  job_title_name: "ตำแหน่งงาน",
  job_title: "ตำแหน่งงาน",
  job_title_id: "ตำแหน่งงาน",
  jobtitle: "ตำแหน่งงาน",
  job_group_name: "กลุ่มงาน",
  job_group: "กลุ่มงาน",
  job_group_id: "กลุ่มงาน",
  jobgroup: "กลุ่มงาน",
  position: "ตำแหน่ง",
  position_level_id: "ระดับตำแหน่ง",
  position_level: "ระดับตำแหน่ง",
  positionlevel: "ระดับตำแหน่ง",
  position_type_id: "ประเภทตำแหน่ง",
  position_type: "ประเภทตำแหน่ง",
  positiontype: "ประเภทตำแหน่ง",
  profile_image: "รูปโปรไฟล์",
  department: "แผนก",
  role: "สิทธิ์เข้าใช้งาน",
  institution_name: "สถาบัน",
  degree_name: "วุฒิการศึกษา",
  graduation_year: "ปีที่จบ",
  professional_license_degree: "ใบประกอบวิชาชีพ",
  work_status: "สถานะการทำงาน",
  createdat: "สร้างเมื่อ",
  created_at: "สร้างเมื่อ",
  updated_at: "แก้ไขล่าสุด",
  updatedat: "แก้ไขล่าสุด",
  education_level: "ระดับการศึกษา",
  degree_for_employment: "วุฒิที่ใช้บรรจุ",
  highest_degree: "วุฒิสูงสุด",
};

const HIDDEN_KEYS = [
  "password", 
  "raw_password", 
  "token", 
  "ssn", 
  "secret",
  "profile_image", // ซ่อนเพราะไม่จำเป็นแสดงเป็น path
  "birt_date", // ซ่อนเพราะมี age แล้ว
  "prefix_th", // ซ่อนเพราะมีใน name แล้ว
  "first_name_th", // ซ่อนเพราะมีใน name แล้ว
  "last_name_th", // ซ่อนเพราะมีใน name แล้ว
];

const prettyKey = (k: string) => {
  const s = k.replace(/_/g, " ").toLowerCase();
  return s
    .split(" ")
    .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : ""))
    .join(" ");
};

const tryFindInMerged = (merged: Record<string, any>, patterns: string[]) => {
  for (const pat of patterns) {
    for (const mk of Object.keys(merged)) {
      if (
        mk.toLowerCase() === pat.toLowerCase() &&
        merged[mk] != null &&
        merged[mk] !== ""
      ) {
        return String(merged[mk]);
      }
    }
  }
  return null;
};

const getMapValue = (map?: Map, val?: any) => {
  if (!map || val == null) return null;
  const s = String(val);
  if (map[s] !== undefined) return map[s];
  const n = Number(val);
  if (!Number.isNaN(n) && map[String(n)] !== undefined) return map[String(n)];
  if (map[s.trim()] !== undefined) return map[s.trim()];
  return null;
};

const formatValue = (
  key: string,
  value: any,
  merged: Record<string, any>,
  maps?: {
    jobTitlesMap?: Map;
    positionLevelsMap?: Map;
    positionTypesMap?: Map;
    jobGroupsMap?: Map;
  }
) => {
  // Handle [object Object] case
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    // Try to extract meaningful value from object
    if (value.name) return String(value.name);
    if (value.name_th) return String(value.name_th);
    if (value.job_group_name) return String(value.job_group_name);
    if (value.job_title_name) return String(value.job_title_name);
    if (value.position_level_name) return String(value.position_level_name);
    if (value.position_type_name) return String(value.position_type_name);
    // If still object, return "—"
    return "—";
  }

  // If value missing, try to find alternate name in merged fields (e.g., job_group_name)
  const lk0 = key.toLowerCase();
  if (value == null || value === "") {
    if (lk0.endsWith("_id")) {
      const base = lk0.replace(/_id$/, "");
      const tryKeys = [
        `${base}_name`,
        `${base}Name`,
        `${base}`,
        `${base}_title`,
        `${base}_title_name`,
        `${base}_nm`,
        `${base}name`,
      ];
      const found = tryFindInMerged(merged, tryKeys);
      if (found) return found;
    }
    return "—";
  }

  const lk = key.toLowerCase();

  // handle _id fields with maps
  if (lk.endsWith("_id")) {
    const base = lk.replace(/_id$/, "");

    // job_group special-case
    if (base === "job_group" || base.endsWith("job_group")) {
      const mapVal = getMapValue(maps?.jobGroupsMap as any, value);
      if (mapVal) return mapVal;
    }

    // job_title handling
    if (
      base.includes("job_title") ||
      base === "jobtitle" ||
      base === "job_title" ||
      base.includes("job") // fallback
    ) {
      const mapVal = getMapValue(maps?.jobTitlesMap as any, value);
      if (mapVal) return mapVal;
    }

    // position level/type
    if (base.includes("position") && base.includes("level")) {
      const mapVal = getMapValue(maps?.positionLevelsMap as any, value);
      if (mapVal) return mapVal;
    }
    if (base.includes("position") && base.includes("type")) {
      const mapVal = getMapValue(maps?.positionTypesMap as any, value);
      if (mapVal) return mapVal;
    }

    // fallback: try to find related *_name field in merged
    const tryKeys = [
      `${base}_name`,
      `${base}Name`,
      `${base}`,
      `${base}_title`,
      `${base}_title_name`,
      `${base}_nm`,
      `${base}name`,
      base.toUpperCase(),
    ];
    const found = tryFindInMerged(merged, tryKeys);
    if (found) return found;
    return String(value);
  }

  // also handle cases where key might be job_group or job_group_name directly
  if (lk === "job_group" || lk === "job_group_name" || lk === "job_groupname") {
    if (typeof value === "string" && value.trim() !== "") return value;
    const possibleId = merged["job_group_id"] ?? merged["jobGroupId"] ?? merged["job_group"];
    const mapVal = getMapValue(maps?.jobGroupsMap as any, possibleId ?? value);
    if (mapVal) return mapVal;
  }

  // dates
  if (
    lk === "createdat" ||
    lk.endsWith("_at") ||
    lk === "birt_date" ||
    lk === "created_at" ||
    lk === "graduation_year" ||
    lk === "updatedat"
  ) {
    const d = new Date(value);
    if (!isNaN(d.getTime())) {
      const showTime =
        lk.endsWith("_at") ||
        lk === "createdat" ||
        lk === "created_at" ||
        lk === "updatedat";
      if (lk === "graduation_year" && String(value).match(/^\d{4}$/)) {
        return String(value);
      }
      return d.toLocaleString("th-TH", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: showTime ? "2-digit" : undefined,
        minute: showTime ? "2-digit" : undefined,
      });
    }
  }

  if (lk === "age") return `${value} ปี`;

  return String(value);
};

const EmployeeDetailModal: React.FC<Props> = ({
  show,
  emp,
  onClose,
  jobTitlesMap,
  positionLevelsMap,
  positionTypesMap,
  jobGroupsMap, // <-- accept prop
}) => {
  if (!show || !emp) return null;

const normalized: Record<string, any> = {
    name: emp.name,
    id: emp.id,
    position: (emp as any).position || emp.role,
    job_title_id: emp.raw?.job_title_id,
    job_group_id: emp.raw?.job_group_id,
    position_level_id: emp.raw?.position_level_id,
    position_type_id: emp.raw?.position_type_id,
    department: (emp as any).department || emp.raw?.department,
    phone: emp.phone,
    age: emp.age,
    gender: emp.gender,
    role: emp.role,
    work_status: emp.workStatus || emp.raw?.work_status || 'ปฏิบัติหน้าที่',
    email: emp.raw?.email,
    institution_name: emp.raw?.institution_name,
    degree_name: emp.raw?.degree_name,
    graduation_year: emp.raw?.graduation_year,
    professional_license_degree: emp.raw?.professional_license_degree,
    education_level: emp.raw?.education_level,
    degree_for_employment: emp.raw?.degree_for_employment,
    highest_degree: emp.raw?.highest_degree,
    created_at: emp.createdAt || emp.raw?.created_at,
    updated_at: emp.raw?.updated_at,
  };
  const raw = emp.raw ?? {};
  const merged: Record<string, any> = { ...raw, ...normalized };

  // preferred keys - เรียงลำดับตามความสำคัญ
  const preferredKeys = [
    "name",
    "id",
    "position",
    "job_title_id",
    "job_group_id",
    "position_level_id",
    "position_type_id",
    "department",
    "work_status",
    "age",
    "gender",
    "phone",
    "email",
    "role",
    "education_level",
    "degree_for_employment",
    "highest_degree",
    "institution_name",
    "degree_name",
    "graduation_year",
    "professional_license_degree",
    "created_at",
    "updated_at",
  ];

  const entries: Array<[string, any]> = [];
  const used = new Set<string>();

  for (const pk of preferredKeys) {
    for (const mk of Object.keys(merged)) {
      if (used.has(mk)) continue;
      if (mk.toLowerCase() === pk.toLowerCase()) {
        entries.push([mk, merged[mk]]);
        used.add(mk);
      }
    }
  }

  for (const [k, v] of Object.entries(merged)) {
    if (used.has(k)) continue;
    if (HIDDEN_KEYS.includes(k.toLowerCase())) continue;
    entries.push([k, v]);
  }

  const maps = {
    jobTitlesMap: jobTitlesMap ?? {},
    positionLevelsMap: positionLevelsMap ?? {},
    positionTypesMap: positionTypesMap ?? {},
    jobGroupsMap: jobGroupsMap ?? {}, // <-- include jobGroupsMap
  };

  // Optional debug (uncomment if needed)
  // console.log("DETAIL_MODAL merged:", merged);
  // console.log("DETAIL_MODAL maps keys:", {
  //   jobGroups: Object.keys(maps.jobGroupsMap || {}),
  //   jobTitles: Object.keys(maps.jobTitlesMap || {}),
  // });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 md:p-8">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative bg-white rounded-2xl w-full max-w-5xl max-h-[92vh] shadow-2xl overflow-hidden">
        <div className="flex items-start justify-between px-6 py-4 border-b bg-gray-50">
          <div>
            <div className="text-sm text-gray-400">ข้อมูลบุคลากร</div>
            <h2 className="text-xl font-semibold text-gray-900">
              {emp.name ?? "ไม่ทราบชื่อ"}
            </h2>
            <div className="mt-1 text-sm text-gray-500">
              {(emp as any).position || emp.role || "—"}
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            ✕ ปิด
          </button>
        </div>

        <div className="px-6 py-4 overflow-y-auto max-h-[calc(92vh-4rem)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm pb-12">
            {entries.map(([key, value]) => {
              const keyLower = key.toLowerCase();
              const label = labelMap[keyLower] ?? prettyKey(keyLower);
              const displayValue = formatValue(key, value, merged, maps);

              // แสดง work_status เป็น badge สี
              if (keyLower === 'work_status') {
                const status = (value as WorkStatus) || 'ปฏิบัติหน้าที่';
                const style = STATUS_STYLES[status] || STATUS_STYLES['ปฏิบัติหน้าที่'];
                return (
                  <div
                    key={key}
                    className="flex flex-col rounded-lg border border-gray-100 bg-gray-50/60 px-3 py-2"
                  >
                    <span className="text-[11px] uppercase tracking-wide text-gray-400">
                      {label}
                    </span>
                    <span className={`mt-1 inline-flex w-fit px-2.5 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
                      {status}
                    </span>
                  </div>
                );
              }

              return (
                <div
                  key={key}
                  className="flex flex-col rounded-lg border border-gray-100 bg-gray-50/60 px-3 py-2"
                >
                  <span className="text-[11px] uppercase tracking-wide text-gray-400">
                    {label}
                  </span>
                  <span className="mt-0.5 font-medium text-gray-900 break-words">
                    {displayValue}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailModal;