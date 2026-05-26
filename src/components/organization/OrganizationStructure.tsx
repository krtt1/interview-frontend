"use client";

import Link from "next/link";
import Image from "next/image";

export default function OrganizationStructure() {
  // ข้อมูล Mock - ในอนาคตจะดึงจาก API
  const director = {
    id: "0000000001",
    name: "พญ.เสาวนีย์ วิบูลสันติ",
    position: "ผู้อำนวยการ",
    image: "/avatar-placeholder.svg",
    supervises: "กำกับดูแล 2 หน่วยงานหลัก",
  };

  const deputies = [
    {
      id: "0000000002",
      name: "นพ.สุรเชษฐ์ อรุโณทอง",
      position: "รองผู้อำนวยการ",
      image: "/avatar-placeholder.svg",
      supervises: "กำกับดูแล 4 กลุ่มงาน",
    },
    {
      id: "0000000003",
      name: "นพ.นัฐพนธ์ เอกรักษ์รุ่งเรือง",
      position: "รองผู้อำนวยการ",
      image: "/avatar-placeholder.svg",
      supervises: "กำกับดูแล 7 กลุ่มงาน",
    },
    {
      id: "0000000004",
      name: "นพ.วาที สิทธิ",
      position: "รองผู้อำนวยการ",
      image: "/avatar-placeholder.svg",
      supervises: "กำกับดูแล 3 กลุ่มงาน",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Sub Header */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-4">
          โครงสร้างการบริหารงาน สำนักงานป้องกันควบคุมโรคที่ 1 จังหวัดเชียงใหม่
        </h3>
      </div>

      {/* ผู้อำนวยการ */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-600 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-5">
          {/* รูปภาพ */}
          <div className="flex-shrink-0">
            <div className="relative w-24 h-24">
              <Image
                src={director.image}
                alt={director.name}
                fill
                className="rounded-full object-cover border-4 border-white shadow-lg"
              />
            </div>
          </div>

          {/* ข้อมูล */}
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {director.name}
            </h3>
            <p className="text-blue-700 font-semibold text-base mb-2">
              {director.position}
            </p>
            <p className="text-gray-600 text-sm">
              {director.supervises}
            </p>
          </div>
        </div>
      </div>

      {/* Sub Header รองผู้อำนวยการ */}
      <div className="pt-2">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          รองผู้อำนวยการ
        </h3>
      </div>

      {/* รองผู้อำนวยการ - Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {deputies.map((deputy) => (
          <div
            key={deputy.id}
            className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-blue-300 transition-all duration-200"
          >
            <div className="flex flex-col items-center text-center">
              {/* รูปภาพ */}
              <div className="mb-4">
                <div className="relative w-20 h-20">
                  <Image
                    src={deputy.image}
                    alt={deputy.name}
                    fill
                    className="rounded-full object-cover border-3 border-gray-200 shadow-md"
                  />
                </div>
              </div>

              {/* ข้อมูล */}
              <div>
                <h4 className="text-base font-bold text-gray-900 mb-1">
                  {deputy.name}
                </h4>
                <p className="text-gray-500 text-sm font-medium mb-2">
                  {deputy.position}
                </p>
                <p className="text-gray-600 text-sm">
                  {deputy.supervises}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ลิงก์ดูโครงสร้างเต็ม */}
      <div className="text-center pt-4 border-t border-gray-200">
        <Link
          href="/organization"
          className="inline-block text-blue-600 hover:text-blue-800 font-semibold text-sm hover:underline transition-colors"
        >
          [ ดูโครงสร้างองค์กรฉบับเต็ม ]
        </Link>
        <p className="text-xs text-gray-400 mt-1">
          * แสดงเฉพาะภาพรวมสำหรับผู้บริหาร
        </p>
      </div>
    </div>
  );
}
