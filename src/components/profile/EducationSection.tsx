import React from "react";
import Field from "./Field";
import { APIEmployee } from "@/hooks/useEmployees";

type Props = { raw: APIEmployee };

export default function EducationSection({ raw }: Props) {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-sm font-semibold text-gray-800 mb-4">ข้อมูลการศึกษา</h3>

      <div className="grid grid-cols-1 gap-4 text-sm">
        <Field label="ระดับการศึกษา" value={raw.education_level || "—"} />
        <Field label="วุฒิการศึกษา" value={raw.degree_name || "—"} />
        <Field label="สถาบันการศึกษา" value={raw.institution_name || "—"} />
        <Field
          label="ปีที่จบ"
          value={raw.graduation_year ? String(raw.graduation_year) : "—"}
        />
        <Field label="วุฒิที่ใช้บรรจุ" value={raw.degree_for_employment || "—"} />
        <Field label="วุฒิสูงสุด" value={raw.highest_degree || "—"} />
        <Field label="ใบประกอบวิชาชีพ" value={raw.professional_license_degree || "—"} />
      </div>
    </section>
  );
}
