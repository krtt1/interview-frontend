import React from "react";
import Field from "./Field";
import { APIEmployee } from "@/hooks/useEmployees";

type Props = {
  meName: string;
  meGender?: string | null;
  meAge?: number | null;
  mePhone?: string;
  raw: APIEmployee;
};

export default function BasicInfo({ meName, meGender, meAge, mePhone, raw }: Props) {
  const birth = raw.birt_date ?? ""; // DB field name

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-sm font-semibold text-gray-800 mb-4">ข้อมูลพื้นฐาน</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <Field label="ชื่อ - นามสกุล" value={meName || "—"} />
        <Field label="เพศ" value={meGender || "ไม่ระบุ"} />

        <Field
          label="อายุ"
          value={meAge != null ? `${meAge} ปี` : "—"}
        />

        <Field label="เบอร์โทร" value={mePhone || "—"} />

        <Field label="อีเมล" value={raw.email || "—"} />

        <Field
          label="วันเกิด"
          value={
            birth
              ? new Date(birth).toLocaleDateString("th-TH")
              : "—"
          }
        />
      </div>
    </div>
  );
}
