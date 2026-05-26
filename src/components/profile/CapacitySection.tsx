"use client";

import { useCapacity } from "@/hooks/useCapacity";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface CapacitySectionProps {
  employeeId: string;
  employeeName: string;
  isAdmin: boolean;
}

export default function CapacitySection({ employeeId, employeeName, isAdmin }: CapacitySectionProps) {
  const { capacity, loading, error } = useCapacity(employeeId);
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">📊 ข้อมูลสมรรถนะ</h2>
        <p className="text-sm text-gray-500">กำลังโหลด...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">📊 ข้อมูลสมรรถนะ</h2>
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (!capacity) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">📊 ข้อมูลสมรรถนะ</h2>
          {isAdmin && (
            <button
              onClick={() => router.push(`/capacity/${employeeId}`)}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
            >
              เพิ่มข้อมูล
            </button>
          )}
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600">ยังไม่มีข้อมูลสมรรถนะ</p>
          {!isAdmin && (
            <p className="text-xs text-gray-500 mt-2">
              กรุณาติดต่อ HR เพื่อเพิ่มข้อมูลสมรรถนะของคุณ
            </p>
          )}
        </div>
      </div>
    );
  }

  const InfoRow = ({ label, value }: { label: string; value: any }) => {
    if (!value || value === "-") return null;
    return (
      <div className="flex py-2 border-b border-gray-100 last:border-0">
        <span className="text-sm text-gray-600 w-1/3">{label}</span>
        <span className="text-sm text-gray-900 w-2/3 font-medium">{value}</span>
      </div>
    );
  };

  const SkillLevel = ({ level }: { level: string }) => {
    const colors: Record<string, string> = {
      "ดีมาก": "bg-green-100 text-green-800",
      "ดี": "bg-blue-100 text-blue-800",
      "ปานกลาง": "bg-yellow-100 text-yellow-800",
      "พอใช้": "bg-orange-100 text-orange-800",
      "ไม่มี": "bg-gray-100 text-gray-600",
    };
    return (
      <span className={`px-2 py-1 rounded text-xs ${colors[level] || "bg-gray-100 text-gray-600"}`}>
        {level}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">📊 ข้อมูลสมรรถนะ</h2>
          <div className="flex gap-2">
            {isAdmin && (
              <button
                onClick={() => router.push(`/capacity/${employeeId}`)}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
              >
                แก้ไข
              </button>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200"
            >
              {isExpanded ? "ซ่อน" : "แสดงทั้งหมด"}
            </button>
          </div>
        </div>
        {!isAdmin && (
          <p className="text-xs text-gray-500 mt-2">
            💡 หากพบข้อมูลไม่ถูกต้อง กรุณาติดต่อ HR
          </p>
        )}
      </div>

      <div className="p-6 space-y-6">
        {/* ข้อมูลพื้นฐาน */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">ข้อมูลพื้นฐาน</h3>
          <div className="bg-gray-50 rounded-lg p-4 space-y-1">
            <InfoRow label="หน่วยงาน" value={capacity.department} />
            <InfoRow label="ระดับการศึกษา" value={capacity.education_level} />
            <InfoRow label="อายุงาน" value={capacity.work_duration_years} />
          </div>
        </div>

        {/* ทักษะพื้นฐาน */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">ทักษะพื้นฐาน</h3>
          <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            {capacity.skill_official_writing && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">การเขียนหนังสือราชการ</span>
                <SkillLevel level={capacity.skill_official_writing} />
              </div>
            )}
            {capacity.skill_meeting_summary && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">การสรุปการประชุม</span>
                <SkillLevel level={capacity.skill_meeting_summary} />
              </div>
            )}
            {capacity.skill_computer_connection && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">การเชื่อมต่อคอมพิวเตอร์</span>
                <SkillLevel level={capacity.skill_computer_connection} />
              </div>
            )}
            {capacity.skill_excel && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Excel</span>
                <SkillLevel level={capacity.skill_excel} />
              </div>
            )}
            {capacity.skill_communication && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">การสื่อสาร</span>
                <SkillLevel level={capacity.skill_communication} />
              </div>
            )}
            {capacity.skill_presentation && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">การนำเสนอ</span>
                <SkillLevel level={capacity.skill_presentation} />
              </div>
            )}
            {capacity.skill_epidemiology_basic && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">ระบาดวิทยาพื้นฐาน</span>
                <SkillLevel level={capacity.skill_epidemiology_basic} />
              </div>
            )}
            {capacity.skill_ai_tools && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">เครื่องมือ AI</span>
                <SkillLevel level={capacity.skill_ai_tools} />
              </div>
            )}
            {capacity.skill_english_speaking && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">ภาษาอังกฤษ (พูด)</span>
                <SkillLevel level={capacity.skill_english_speaking} />
              </div>
            )}
            {capacity.skill_english_writing && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">ภาษาอังกฤษ (เขียน)</span>
                <SkillLevel level={capacity.skill_english_writing} />
              </div>
            )}
            {capacity.english_test_score && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">คะแนนภาษาอังกฤษ</span>
                <span className="text-sm font-medium text-gray-900">{capacity.english_test_score}</span>
              </div>
            )}
            {capacity.skill_first_aid && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">ปฐมพยาบาล</span>
                <SkillLevel level={capacity.skill_first_aid} />
              </div>
            )}
          </div>
        </div>

        {/* หลักสูตรที่ผ่าน */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">หลักสูตรที่ผ่านการอบรม</h3>
          {capacity.trainingCourses && capacity.trainingCourses.length > 0 ? (
            <div className="bg-blue-50 rounded-lg p-4">
              <ul className="space-y-2">
                {capacity.trainingCourses.map((course, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span>{course.course_name}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500">ยังไม่มีข้อมูลหลักสูตร</p>
            </div>
          )}
        </div>

        {/* แสดงข้อมูลเพิ่มเติมเมื่อกด "แสดงทั้งหมด" */}
        {isExpanded && (
          <>
            {/* Competency */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Competency</h3>
              {(capacity.competency_analytical_thinking || capacity.competency_information_seeking || capacity.competency_strategic_orientation) ? (
                <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {capacity.competency_analytical_thinking && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">การคิดวิเคราะห์</span>
                      <SkillLevel level={capacity.competency_analytical_thinking} />
                    </div>
                  )}
                  {capacity.competency_information_seeking && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">การแสวงหาข้อมูล</span>
                      <SkillLevel level={capacity.competency_information_seeking} />
                    </div>
                  )}
                  {capacity.competency_strategic_orientation && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">การมุ่งเน้นเชิงกลยุทธ์</span>
                      <SkillLevel level={capacity.competency_strategic_orientation} />
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500">ยังไม่มีข้อมูล Competency</p>
                </div>
              )}
            </div>

            {/* ทักษะระบาดวิทยา */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">ทักษะระบาดวิทยา</h3>
              {(capacity.epi_surveillance || capacity.epi_investigation_control || capacity.epi_data_analysis || 
                capacity.epi_situation_report || capacity.epi_tool_design || capacity.epi_report_writing ||
                capacity.epi_descriptive_analysis || capacity.epi_analytical_statistics || capacity.epi_advanced_software ||
                capacity.epi_explain_descriptive || capacity.epi_explain_analytical) ? (
                <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {capacity.epi_surveillance && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">การเฝ้าระวัง</span>
                      <SkillLevel level={capacity.epi_surveillance} />
                    </div>
                  )}
                  {capacity.epi_situation_report && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">รายงานสถานการณ์</span>
                      <SkillLevel level={capacity.epi_situation_report} />
                    </div>
                  )}
                  {capacity.epi_investigation_control && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">การสอบสวนควบคุมโรค</span>
                      <SkillLevel level={capacity.epi_investigation_control} />
                    </div>
                  )}
                  {capacity.epi_data_analysis && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">การวิเคราะห์ข้อมูล</span>
                      <SkillLevel level={capacity.epi_data_analysis} />
                    </div>
                  )}
                  {capacity.epi_tool_design && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">การออกแบบเครื่องมือ</span>
                      <SkillLevel level={capacity.epi_tool_design} />
                    </div>
                  )}
                  {capacity.epi_descriptive_analysis && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">การวิเคราะห์เชิงพรรณนา</span>
                      <SkillLevel level={capacity.epi_descriptive_analysis} />
                    </div>
                  )}
                  {capacity.epi_analytical_statistics && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">สถิติเชิงวิเคราะห์</span>
                      <SkillLevel level={capacity.epi_analytical_statistics} />
                    </div>
                  )}
                  {capacity.epi_advanced_software && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">โปรแกรมขั้นสูง</span>
                      <SkillLevel level={capacity.epi_advanced_software} />
                    </div>
                  )}
                  {capacity.epi_explain_descriptive && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">อธิบายเชิงพรรณนา</span>
                      <SkillLevel level={capacity.epi_explain_descriptive} />
                    </div>
                  )}
                  {capacity.epi_explain_analytical && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">อธิบายเชิงวิเคราะห์</span>
                      <SkillLevel level={capacity.epi_explain_analytical} />
                    </div>
                  )}
                  {capacity.epi_report_writing && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">การเขียนรายงาน</span>
                      <SkillLevel level={capacity.epi_report_writing} />
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500">ยังไม่มีข้อมูลทักษะระบาดวิทยา</p>
                </div>
              )}
            </div>

            {/* ทักษะการเก็บตัวอย่าง */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">ทักษะการเก็บตัวอย่าง</h3>
              {(capacity.sample_nasopharyngeal || capacity.sample_throat || capacity.sample_blood_vein || 
                capacity.sample_blood_finger || capacity.sample_water || capacity.sample_food ||
                capacity.sample_rectal || capacity.sample_wound || capacity.sample_hand ||
                capacity.sample_object || capacity.sample_vomit || capacity.sample_ice || capacity.sample_transport) ? (
                <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {capacity.sample_nasopharyngeal && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Nasopharyngeal</span>
                      <SkillLevel level={capacity.sample_nasopharyngeal} />
                    </div>
                  )}
                  {capacity.sample_throat && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Throat Swab</span>
                      <SkillLevel level={capacity.sample_throat} />
                    </div>
                  )}
                  {capacity.sample_rectal && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Rectal Swab</span>
                      <SkillLevel level={capacity.sample_rectal} />
                    </div>
                  )}
                  {capacity.sample_wound && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">แผล</span>
                      <SkillLevel level={capacity.sample_wound} />
                    </div>
                  )}
                  {capacity.sample_hand && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">มือ</span>
                      <SkillLevel level={capacity.sample_hand} />
                    </div>
                  )}
                  {capacity.sample_object && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">วัตถุ/สิ่งของ</span>
                      <SkillLevel level={capacity.sample_object} />
                    </div>
                  )}
                  {capacity.sample_vomit && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">อาเจียน</span>
                      <SkillLevel level={capacity.sample_vomit} />
                    </div>
                  )}
                  {capacity.sample_blood_vein && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">เจาะเลือดจากเส้น</span>
                      <SkillLevel level={capacity.sample_blood_vein} />
                    </div>
                  )}
                  {capacity.sample_blood_finger && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">เจาะเลือดปลายนิ้ว</span>
                      <SkillLevel level={capacity.sample_blood_finger} />
                    </div>
                  )}
                  {capacity.sample_water && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">ตัวอย่างน้ำ</span>
                      <SkillLevel level={capacity.sample_water} />
                    </div>
                  )}
                  {capacity.sample_ice && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">ตัวอย่างน้ำแข็ง</span>
                      <SkillLevel level={capacity.sample_ice} />
                    </div>
                  )}
                  {capacity.sample_food && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">ตัวอย่างอาหาร</span>
                      <SkillLevel level={capacity.sample_food} />
                    </div>
                  )}
                  {capacity.sample_transport && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">การขนส่งตัวอย่าง</span>
                      <SkillLevel level={capacity.sample_transport} />
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500">ยังไม่มีข้อมูลทักษะการเก็บตัวอย่าง</p>
                </div>
              )}
            </div>

            {/* ทักษะ PPE และความปลอดภัย */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">ทักษะ PPE และความปลอดภัย</h3>
              {(capacity.ppe_standard || capacity.ppe_full || capacity.waste_management ||
                capacity.zone_identification || capacity.shelter_area_allocation || 
                capacity.shelter_organization || capacity.shelter_sanitation) ? (
                <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {capacity.ppe_standard && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">PPE มาตรฐาน</span>
                      <SkillLevel level={capacity.ppe_standard} />
                    </div>
                  )}
                  {capacity.ppe_full && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">PPE เต็มชุด</span>
                      <SkillLevel level={capacity.ppe_full} />
                    </div>
                  )}
                  {capacity.waste_management && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">การจัดการขยะติดเชื้อ</span>
                      <SkillLevel level={capacity.waste_management} />
                    </div>
                  )}
                  {capacity.zone_identification && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">การแบ่งโซน</span>
                      <SkillLevel level={capacity.zone_identification} />
                    </div>
                  )}
                  {capacity.shelter_area_allocation && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">การจัดพื้นที่พักพิง</span>
                      <SkillLevel level={capacity.shelter_area_allocation} />
                    </div>
                  )}
                  {capacity.shelter_organization && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">การจัดระเบียบพักพิง</span>
                      <SkillLevel level={capacity.shelter_organization} />
                    </div>
                  )}
                  {capacity.shelter_sanitation && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">สุขาภิบาลพักพิง</span>
                      <SkillLevel level={capacity.shelter_sanitation} />
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500">ยังไม่มีข้อมูลทักษะ PPE</p>
                </div>
              )}
            </div>

            {/* งานวัคซีน */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">งานวัคซีน</h3>
              {(capacity.vaccine_work_analysis || capacity.vaccine_aefi_surveillance || capacity.vaccine_investigation) ? (
                <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {capacity.vaccine_work_analysis && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">การวิเคราะห์งานวัคซีน</span>
                      <SkillLevel level={capacity.vaccine_work_analysis} />
                    </div>
                  )}
                  {capacity.vaccine_aefi_surveillance && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">การเฝ้าระวัง AEFI</span>
                      <SkillLevel level={capacity.vaccine_aefi_surveillance} />
                    </div>
                  )}
                  {capacity.vaccine_investigation && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">การสอบสวนวัคซีน</span>
                      <SkillLevel level={capacity.vaccine_investigation} />
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500">ยังไม่มีข้อมูลงานวัคซีน</p>
                </div>
              )}
            </div>

            {/* งานโรคติดต่อนำโดยแมลง */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">งานโรคติดต่อนำโดยแมลง</h3>
              {(capacity.vector_diagnosis_experience || capacity.vector_field_diagnosis || 
                capacity.vector_investigation || capacity.vector_control) ? (
                <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {capacity.vector_diagnosis_experience && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">ประสบการณ์การวินิจฉัย</span>
                      <SkillLevel level={capacity.vector_diagnosis_experience} />
                    </div>
                  )}
                  {capacity.vector_field_diagnosis && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">การวินิจฉัยภาคสนาม</span>
                      <SkillLevel level={capacity.vector_field_diagnosis} />
                    </div>
                  )}
                  {capacity.vector_investigation && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">การสอบสวน</span>
                      <SkillLevel level={capacity.vector_investigation} />
                    </div>
                  )}
                  {capacity.vector_control && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">การควบคุม</span>
                      <SkillLevel level={capacity.vector_control} />
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500">ยังไม่มีข้อมูลงานโรคติดต่อนำโดยแมลง</p>
                </div>
              )}
            </div>

            {/* งานด่าน */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">งานด่าน</h3>
              {(capacity.port_sanitation || capacity.port_patient_transfer || capacity.port_law) ? (
                <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {capacity.port_sanitation && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">สุขาภิบาลด่าน</span>
                      <SkillLevel level={capacity.port_sanitation} />
                    </div>
                  )}
                  {capacity.port_patient_transfer && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">การส่งต่อผู้ป่วย</span>
                      <SkillLevel level={capacity.port_patient_transfer} />
                    </div>
                  )}
                  {capacity.port_law && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">กฎหมายด่าน</span>
                      <SkillLevel level={capacity.port_law} />
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500">ยังไม่มีข้อมูลงานด่าน</p>
                </div>
              )}
            </div>

            {/* งาน EnvOcc */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">งาน EnvOcc</h3>
              {(capacity.envocc_surveillance || capacity.envocc_tools) ? (
                <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {capacity.envocc_surveillance && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">การเฝ้าระวัง EnvOcc</span>
                      <SkillLevel level={capacity.envocc_surveillance} />
                    </div>
                  )}
                  {capacity.envocc_tools && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">เครื่องมือ EnvOcc</span>
                      <SkillLevel level={capacity.envocc_tools} />
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500">ยังไม่มีข้อมูลงาน EnvOcc</p>
                </div>
              )}
            </div>

            {/* Risk Communication */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Risk Communication</h3>
              {(capacity.risk_comm_crisis || capacity.risk_comm_simplify || capacity.risk_comm_digital) ? (
                <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {capacity.risk_comm_crisis && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">การสื่อสารในภาวะวิกฤต</span>
                      <SkillLevel level={capacity.risk_comm_crisis} />
                    </div>
                  )}
                  {capacity.risk_comm_simplify && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">การทำให้เข้าใจง่าย</span>
                      <SkillLevel level={capacity.risk_comm_simplify} />
                    </div>
                  )}
                  {capacity.risk_comm_digital && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">สื่อดิจิทัล</span>
                      <SkillLevel level={capacity.risk_comm_digital} />
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500">ยังไม่มีข้อมูล Risk Communication</p>
                </div>
              )}
            </div>

            {/* หลักสูตรโรคติดต่อนำโดยแมลง */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">หลักสูตรโรคติดต่อนำโดยแมลง</h3>
              {capacity.vectorCourses && capacity.vectorCourses.length > 0 ? (
                <div className="bg-green-50 rounded-lg p-4">
                  <ul className="space-y-2">
                    {capacity.vectorCourses.map((course, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-green-600 mt-1">✓</span>
                        <span>{course.course_name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500">ยังไม่มีข้อมูลหลักสูตรโรคติดต่อนำโดยแมลง</p>
                </div>
              )}
            </div>

            {/* หลักสูตร EnvOcc */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">หลักสูตร EnvOcc</h3>
              {capacity.envoccCourses && capacity.envoccCourses.length > 0 ? (
                <div className="bg-purple-50 rounded-lg p-4">
                  <ul className="space-y-2">
                    {capacity.envoccCourses.map((course, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-purple-600 mt-1">✓</span>
                        <span>{course.course_name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500">ยังไม่มีข้อมูลหลักสูตร EnvOcc</p>
                </div>
              )}
            </div>

            {/* หลักสูตรกฎหมาย */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">หลักสูตรกฎหมาย</h3>
              {capacity.lawCourses && capacity.lawCourses.length > 0 ? (
                <div className="bg-orange-50 rounded-lg p-4">
                  <ul className="space-y-2">
                    {capacity.lawCourses.map((course, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-orange-600 mt-1">✓</span>
                        <span>{course.course_name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500">ยังไม่มีข้อมูลหลักสูตรกฎหมาย</p>
                </div>
              )}
            </div>

            {/* ประสบการณ์อื่นๆ */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">ประสบการณ์อื่นๆ</h3>
              {capacity.otherExperiences && capacity.otherExperiences.length > 0 ? (
                <div className="bg-indigo-50 rounded-lg p-4">
                  <ul className="space-y-2">
                    {capacity.otherExperiences.map((exp, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-indigo-600 mt-1">✓</span>
                        <span>{exp.experience_name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500">ยังไม่มีข้อมูลประสบการณ์อื่นๆ</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* ข้อมูลพิเศษ */}
        {capacity.special_skills_experience && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">ทักษะ/ประสบการณ์พิเศษ</h3>
            <div className="bg-yellow-50 rounded-lg p-4">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{capacity.special_skills_experience}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
