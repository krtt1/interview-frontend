"use client";
import React from "react";
import SectionPanel from "@/components/ui/SectionPanel";
import Image from "next/image";

const executives = [
  {
    name: "พญ.เสาวนีย์ วิบุลสันติ",
    title: "ผู้อำนวยการ",
    image: "/avatar-placeholder.svg",
    duties: ["กลุ่มบริหารทั่วไป", "งานกฎหมาย"],
    isDirector: true,
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

const OrganizationPage: React.FC = () => {
  const director = executives.find((e) => e.isDirector);
  const deputies = executives.filter((e) => !e.isDirector);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
        โครงสร้างผู้บริหารและผังองค์กร
      </h1>

      {/* ผู้อำนวยการ */}
      <SectionPanel title="โครงสร้างการบริหารงาน สำนักงานป้องกันควบคุมโรคที่ 1 จังหวัดเชียงใหม่">
        {director && (
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-600 rounded-xl p-4 sm:p-6 shadow-md mb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
              {/* รูปภาพ */}
              <div className="flex-shrink-0">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28">
                  <Image
                    src={director.image}
                    alt={director.name}
                    fill
                    className="rounded-full object-cover border-4 border-white shadow-lg"
                  />
                </div>
              </div>

              {/* ข้อมูล */}
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                  {director.name}
                </h2>
                <p className="text-blue-700 font-semibold text-base sm:text-lg mb-3">
                  {director.title}
                </p>
                <div className="text-xs sm:text-sm text-gray-700">
                  <p className="font-semibold mb-1">กำกับดูแล:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {director.duties.map((d, idx) => (
                      <li key={idx}>{d}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* รองผู้อำนวยการ */}
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-700">
            รองผู้อำนวยการ
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {deputies.map((e, i) => (
              <div
                key={i}
                className="bg-white border-2 border-gray-200 rounded-xl p-4 sm:p-5 hover:shadow-xl hover:border-blue-300 transition-all duration-200"
              >
                {/* รูปภาพ */}
                <div className="flex justify-center mb-4">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24">
                    <Image
                      src={e.image}
                      alt={e.name}
                      fill
                      className="rounded-full object-cover border-3 border-gray-200 shadow-md"
                    />
                  </div>
                </div>

                {/* ข้อมูล */}
                <div className="text-center mb-4">
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-1">
                    {e.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-blue-700 font-semibold">
                    {e.title}
                  </p>
                </div>

                {/* หน้าที่ */}
                <div className="text-left">
                  <p className="text-xs font-semibold text-gray-600 mb-2">
                    กำกับดูแล {e.duties.length} กลุ่มงาน:
                  </p>
                  <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
                    {e.duties.map((d, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionPanel>
    </div>
  );
};

export default OrganizationPage;
