"use client";
import React from "react";
import Image from "next/image";

type Executive = {
  name: string;
  title: string;
  duties: string[];
  image: string;
  isDirector?: boolean;
};

const executives: Executive[] = [
  {
    name: "พญ.เสาวนีย์ วิบุลสันติ",
    title: "ผู้อำนวยการ",
    image: "/avatar-placeholder.svg",
    isDirector: true,
    duties: ["กลุ่มบริหารทั่วไป", "งานกฎหมาย"],
  },
  {
    name: "นพ.สุรเชษฐ์ อรุโณทอง",
    title: "รองผู้อำนวยการ",
    image: "/avatar-placeholder.svg",
    duties: [
      "กลุ่มยุทธศาสตร์ แผนงาน และเครือข่าย",
      "กลุ่มโรคติดต่อเรื้อรัง",
      "ศูนย์บริการเวชศาสตร์ป้องกัน",
      "งานเภสัชกรรม",
    ],
  },
  {
    name: "นพ.นัฐพนธ์ เอกรักษ์รุ่งเรือง",
    title: "รองผู้อำนวยการ",
    image: "/avatar-placeholder.svg",
    duties: [
      "กลุ่มโรคติดต่อ",
      "กลุ่มโรคจากประกอบอาชีพและสิ่งแวดล้อม",
      "กลุ่มห้องปฏิบัติการทางการแพทย์ด้านควบคุมโรค",
      "กลุ่มระบาดวิทยาและตอบโต้ภาวะฉุกเฉินทางสาธารณสุข",
      "กลุ่มโรคติดต่อนำโดยแมลง",
      "ศูนย์ควบคุมโรคติดต่อนำโดยแมลงที่ 1.1-1.5",
      "ศูนย์ฝึกอบรมนักระบาดวิทยา",
    ],
  },
  {
    name: "นพ.วาที สิทธิ",
    title: "รองผู้อำนวยการ",
    image: "/avatar-placeholder.svg",
    duties: [
      "กลุ่มโรคไม่ติดต่อ",
      "กลุ่มสื่อสารความเสี่ยงโรคและภัยสุขภาพ",
      "กลุ่มด่านควบคุมโรคติดต่อระหว่างประเทศและชายแดน",
    ],
  },
];


const OrgStructureWidget: React.FC = () => {
  const director = executives.find((e) => e.isDirector);
  const deputies = executives.filter((e) => !e.isDirector);

  return (
    <div className="space-y-6">
      {/* Director */}
      {director && (
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-600 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-4">
            {/* รูปภาพ */}
            <div className="flex-shrink-0">
              <div className="relative w-20 h-20">
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
              <p className="font-bold text-gray-900 text-base">{director.name}</p>
              <p className="text-sm text-blue-700 font-semibold">{director.title}</p>
              <p className="mt-1 text-sm text-gray-600">
                กำกับดูแล {director.duties.length} หน่วยงานหลัก
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Deputies */}
      <div>
        <p className="font-semibold text-gray-700 mb-4 text-sm">
          รองผู้อำนวยการ
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {deputies.map((d, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-blue-300 transition-all duration-200">
              <div className="flex flex-col items-center text-center">
                {/* รูปภาพ */}
                <div className="mb-3">
                  <div className="relative w-16 h-16">
                    <Image
                      src={d.image}
                      alt={d.name}
                      fill
                      className="rounded-full object-cover border-2 border-gray-200 shadow-md"
                    />
                  </div>
                </div>

                {/* ข้อมูล */}
                <div>
                  <p className="font-semibold text-gray-900 text-sm mb-1">{d.name}</p>
                  <p className="text-xs text-gray-500 mb-2">{d.title}</p>
                  <p className="text-xs text-gray-600">
                    กำกับดูแล {d.duties.length} กลุ่มงาน
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Link */}
      <div className="text-center pt-3 border-t border-gray-200">
        <a
          href="/organization"
          className="text-sm text-blue-600 font-semibold hover:underline hover:text-blue-800 transition-colors"
        >
          [ ดูโครงสร้างองค์กรฉบับเต็ม ]
        </a>
        <p className="mt-1 text-xs text-gray-400">
          * แสดงเฉพาะภาพรวมสำหรับผู้บริหาร
        </p>
      </div>
    </div>
  );
};

export default OrgStructureWidget;
