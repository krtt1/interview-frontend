// src/components/profile/WorkInfo.tsx
import React from "react";
import Field from "./Field";
import { APIEmployee } from "@/hooks/useEmployees";

type Map = Record<string, string>;

type Props = {
  raw: APIEmployee;
  jobTitles?: Map;
  positionLevels?: Map;
  positionTypes?: Map;
  jobGroups?: Map; // <-- added
};

export default function WorkInfo({ raw, jobTitles = {}, positionLevels = {}, positionTypes = {}, jobGroups = {} }: Props) {
  const mapOrId = (map: Map, id?: string | number | null) => {
    if (id === null || id === undefined || id === "") return "—";
    const sid = String(id);
    return map[sid] ? map[sid] : "—";
  };

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-sm font-semibold text-gray-800 mb-4">ข้อมูลงาน / ตำแหน่ง</h3>

      <div className="grid grid-cols-1 gap-4 text-sm">
        <Field label="ประเภทบุคลากร" value={mapOrId(jobTitles, raw.job_title_id)} />
        <Field label="ระดับตำแหน่ง" value={mapOrId(positionLevels, raw.position_level_id)} />
        <Field label="ตำแหน่งสายงาน" value={mapOrId(positionTypes, raw.position_type_id)} />
        <Field label="กลุ่มงาน" value={mapOrId(jobGroups, raw.job_group_id)} /> {/* <-- added */}
        <Field label="สิทธิ์เข้าใช้งานระบบ" value={raw.role ?? "user"} />
        <Field label="สร้างเมื่อ" value={raw.created_at ? new Date(raw.created_at).toLocaleString("th-TH") : "—"} />
        <Field label="แก้ไขล่าสุด" value={raw.updated_at ? new Date(raw.updated_at).toLocaleString("th-TH") : "—"} />
      </div>
    </section>
  );
}