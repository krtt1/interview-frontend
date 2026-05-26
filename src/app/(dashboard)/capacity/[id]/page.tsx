"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useCapacity, useCapacityDelete } from "@/hooks/useCapacity";
import EmployeeSearchAutocomplete from "@/components/capacity/EmployeeSearchAutocomplete";

const skillLevels = ["", "พื้นฐาน", "ปานกลาง", "ดี", "ดีมาก", "เชี่ยวชาญ"];
const yesNoOptions = ["", "ใช่", "ไม่ใช่"];

const trainingCourseOptions = [
  "หลักสูตรระบาดวิทยาก่อนปฏิบัติการ",
  "หลักสูตร FETP",
  "หลักสูตร CDCU ระบาดวิทยา",
  "หลักสูตรการสอบสวนโรค",
];

const vectorCourseOptions = [
  "ด้านกีฏวิทยา",
  "การควบคุมพาหะนำโรค",
  "โรคไข้เลือดออก",
];

const envoccCourseOptions = [
  "หลักสูตรอาชีวอนามัย",
  "หลักสูตรสุขาภิบาลสิ่งแวดล้อม",
  "หลักสูตรความปลอดภัย",
];

const lawCourseOptions = [
  "หลักสูตรกฎหมายสาธารณสุข",
  "หลักสูตรการบังคับใช้กฎหมาย",
];

type FormDataType = {
  [key: string]: string;
};

export default function CapacityDetailPage() {
  const router = useRouter();
  const params = useParams();
  const employeeId = params.id as string;
  const isNewMode = employeeId === 'new';
  
  const { capacity, loading, error, saveCapacity } = useCapacity(isNewMode ? undefined : employeeId);
  const { deleteCapacity, loading: deleteLoading } = useCapacityDelete();
  
  const [activeTab, setActiveTab] = useState(0);

  const [formData, setFormData] = useState<FormDataType>({
    prefix_name: "", full_name: "", department: "", age: "",
    education_level: "", work_duration_years: "",
    skill_official_writing: "", skill_meeting_summary: "",
    skill_computer_connection: "", skill_communication: "",
    skill_epidemiology_basic: "", skill_excel: "",
    skill_presentation: "", skill_ai_tools: "",
    skill_english_speaking: "", skill_english_writing: "",
    english_test_score: "", has_first_aid_course: "",
    skill_first_aid: "", special_skills_experience: "",
    liaison_experience: "", competency_analytical_thinking: "",
    competency_information_seeking: "", competency_strategic_orientation: "",
    epi_surveillance: "", epi_situation_report: "",
    epi_data_analysis: "", epi_investigation_control: "",
    epi_tool_design: "", epi_descriptive_analysis: "",
    epi_analytical_statistics: "", epi_advanced_software: "",
    epi_explain_descriptive: "", epi_explain_analytical: "",
    epi_report_writing: "", sample_nasopharyngeal: "",
    sample_throat: "", sample_rectal: "", sample_wound: "",
    sample_hand: "", sample_object: "", sample_vomit: "",
    sample_water: "", sample_ice: "", sample_food: "",
    sample_blood_finger: "", sample_blood_vein: "",
    sample_transport: "", ppe_standard: "", ppe_full: "",
    waste_management: "", zone_identification: "",
    shelter_area_allocation: "", shelter_organization: "",
    shelter_sanitation: "", has_medical_license: "",
    is_practicing_medical: "", screening_expertise: "",
    vaccine_work_analysis: "", vaccine_aefi_surveillance: "",
    vaccine_investigation: "", vector_diagnosis_experience: "",
    vector_field_diagnosis: "", vector_investigation: "",
    vector_control: "", port_sanitation: "",
    port_patient_transfer: "", port_law: "",
    envocc_surveillance: "", envocc_tools: "",
    risk_comm_crisis: "", risk_comm_simplify: "",
    risk_comm_digital: "", has_med_tech_license: "",
    lab_experience: "", lab_specific_tasks: "",
    has_lab_safety_course: "", is_appointed_disease_control: "",
    is_appointed_envocc: "", is_appointed_tobacco_alcohol: "",
    law_enforcement: "", law_regulation_drafting: "",
    logistics_experience: "", physical_fitness: "",
    management_hr: "", management_hr_development: "",
    procurement_emergency: "", it_computer_repair: "",
    it_equipment_management: "", facility_vehicle_management: "",
    facility_backup_site: "",
  });

  const [trainingCourses, setTrainingCourses] = useState<string[]>([]);
  const [vectorCourses, setVectorCourses] = useState<string[]>([]);
  const [envoccCourses, setEnvoccCourses] = useState<string[]>([]);
  const [lawCourses, setLawCourses] = useState<string[]>([]);
  const [otherExperiences, setOtherExperiences] = useState<string[]>([]);
  
  const [selectedTraining, setSelectedTraining] = useState("");
  const [selectedVector, setSelectedVector] = useState("");
  const [selectedEnvocc, setSelectedEnvocc] = useState("");
  const [selectedLaw, setSelectedLaw] = useState("");
  const [newExperience, setNewExperience] = useState("");
  const [newEmployeeId, setNewEmployeeId] = useState("");

  useEffect(() => {
    if (capacity) {
      const newFormData: FormDataType = {};
      const initialKeys = Object.keys(formData);
      initialKeys.forEach(key => {
        newFormData[key] = (capacity as any)[key]?.toString() || "";
      });
      setFormData(newFormData);
      setTrainingCourses(capacity.trainingCourses?.map(c => c.course_name) || []);
      setVectorCourses(capacity.vectorCourses?.map(c => c.course_name) || []);
      setEnvoccCourses(capacity.envoccCourses?.map(c => c.course_name) || []);
      setLawCourses(capacity.lawCourses?.map(c => c.course_name) || []);
      setOtherExperiences(capacity.otherExperiences?.map(e => e.experience_name) || []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [capacity]);

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleAddTraining = () => {
    if (selectedTraining && !trainingCourses.includes(selectedTraining)) {
      setTrainingCourses([...trainingCourses, selectedTraining]);
      setSelectedTraining("");
    }
  };

  const handleRemoveTraining = (course: string) => {
    setTrainingCourses(trainingCourses.filter((c) => c !== course));
  };

  const handleAddVector = () => {
    if (selectedVector && !vectorCourses.includes(selectedVector)) {
      setVectorCourses([...vectorCourses, selectedVector]);
      setSelectedVector("");
    }
  };

  const handleRemoveVector = (course: string) => {
    setVectorCourses(vectorCourses.filter((c) => c !== course));
  };

  const handleAddEnvocc = () => {
    if (selectedEnvocc && !envoccCourses.includes(selectedEnvocc)) {
      setEnvoccCourses([...envoccCourses, selectedEnvocc]);
      setSelectedEnvocc("");
    }
  };

  const handleRemoveEnvocc = (course: string) => {
    setEnvoccCourses(envoccCourses.filter((c) => c !== course));
  };

  const handleAddLaw = () => {
    if (selectedLaw && !lawCourses.includes(selectedLaw)) {
      setLawCourses([...lawCourses, selectedLaw]);
      setSelectedLaw("");
    }
  };

  const handleRemoveLaw = (course: string) => {
    setLawCourses(lawCourses.filter((c) => c !== course));
  };

  const handleAddExperience = () => {
    if (newExperience.trim() && !otherExperiences.includes(newExperience.trim())) {
      setOtherExperiences([...otherExperiences, newExperience.trim()]);
      setNewExperience("");
    }
  };

  const handleRemoveExperience = (exp: string) => {
    setOtherExperiences(otherExperiences.filter((e) => e !== exp));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const targetId = isNewMode ? newEmployeeId : employeeId;
    if (!targetId) {
      alert("กรุณาระบุรหัสบัตรประชาชน");
      return;
    }

    const payload: any = {
      ...formData,
      age: formData.age ? parseInt(formData.age) : undefined,
      trainingCourses,
      vectorCourses,
      envoccCourses,
      lawCourses,
      otherExperiences,
    };

    const result = await saveCapacity(payload, targetId);

    if (result.success) {
      alert("บันทึกข้อมูลสำเร็จ");
      router.push('/capacity');
    } else {
      alert(`เกิดข้อผิดพลาด: ${result.error}`);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`ต้องการลบข้อมูลของ ${formData.full_name || employeeId} ใช่หรือไม่?`)) {
      return;
    }

    const result = await deleteCapacity(employeeId);
    if (result.success) {
      alert("ลบข้อมูลสำเร็จ");
      router.push('/capacity');
    } else {
      alert(`เกิดข้อผิดพลาด: ${result.error}`);
    }
  };

  const tabs = [
    { id: 0, label: "ข้อมูลพื้นฐาน" },
    { id: 1, label: "ทักษะพื้นฐาน" },
    { id: 2, label: "Competency" },
    { id: 3, label: "ทักษะระบาดวิทยา" },
    { id: 4, label: "การเก็บตัวอย่าง" },
    { id: 5, label: "PPE & ความปลอดภัย" },
    { id: 6, label: "วิชาชีพแพทย์/พยาบาล" },
    { id: 7, label: "งานวัคซีน" },
    { id: 8, label: "โรคติดต่อนำโดยแมลง" },
    { id: 9, label: "งานด่าน" },
    { id: 10, label: "EnvOcc" },
    { id: 11, label: "Risk Communication" },
    { id: 12, label: "เทคนิคการแพทย์" },
    { id: 13, label: "การแต่งตั้ง" },
    { id: 14, label: "กฎหมาย & โลจิสติกส์" },
    { id: 15, label: "การบริหารจัดการ" },
    { id: 16, label: "IT & Facility" },
    { id: 17, label: "หลักสูตรและประสบการณ์" },
  ];

  const SkillSelect = useCallback(({ label, value, field, options = skillLevels }: { label: string; value: string; field: string; options?: string[] }) => (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => handleInputChange(field, e.target.value)}
        className="w-full px-3 py-2 border rounded-lg"
      >
        {options.map((level) => (
          <option key={level} value={level}>
            {level || "เลือก"}
          </option>
        ))}
      </select>
    </div>
  ), [handleInputChange]);

  const TextInput = useCallback(({ label, value, field, type = "text" }: { label: string; value: string; field: string; type?: string }) => (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => handleInputChange(field, e.target.value)}
        className="w-full px-3 py-2 border rounded-lg"
      />
    </div>
  ), [handleInputChange]);

  const TextArea = useCallback(({ label, value, field }: { label: string; value: string; field: string }) => (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <textarea
        value={value}
        onChange={(e) => handleInputChange(field, e.target.value)}
        className="w-full px-3 py-2 border rounded-lg"
        rows={3}
      />
    </div>
  ), [handleInputChange]);


  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/capacity')}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            กลับ
          </button>
          <h1 className="text-2xl font-bold">
            {isNewMode ? 'เพิ่มข้อมูลสมรรถนะ' : 'แก้ไขข้อมูลสมรรถนะ'}
          </h1>
        </div>
        {!isNewMode && (
          <button
            onClick={handleDelete}
            disabled={deleteLoading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400"
          >
            {deleteLoading ? "กำลังลบ..." : "ลบข้อมูล"}
          </button>
        )}
      </div>

      {loading && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p>กำลังโหลด...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Form */}
      {(!loading || isNewMode) && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow">
          {/* Employee ID Input (New Mode Only) */}
          {isNewMode && (
            <div className="p-6 border-b">
              <label className="block text-sm font-medium mb-2">ค้นหาพนักงาน *</label>
              <EmployeeSearchAutocomplete 
                onSelect={(id) => setNewEmployeeId(id)}
                redirectOnSelect={false}
              />
              {newEmployeeId && (
                <p className="text-sm text-green-600 mt-2">
                  ✓ เลือกพนักงานรหัส: {newEmployeeId}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                พิมพ์ชื่อหรือเลขบัตรประชาชนเพื่อค้นหา แล้วกดเลือกพนักงาน
              </p>
            </div>
          )}

          {/* Tabs */}
          <div className="border-b overflow-x-auto">
            <div className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 font-medium whitespace-nowrap text-sm ${
                    activeTab === tab.id
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Tab 0: ข้อมูลพื้นฐาน */}
            {activeTab === 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">ข้อมูลทั่วไป</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextInput label="คำนำหน้า" value={formData.prefix_name} field="prefix_name" />
                  <TextInput label="ชื่อ - สกุล" value={formData.full_name} field="full_name" />
                  <TextInput label="ศูนย์/กลุ่ม/งาน" value={formData.department} field="department" />
                  <TextInput label="อายุ (ปี)" value={formData.age} field="age" type="number" />
                  <TextInput label="ระดับการศึกษา" value={formData.education_level} field="education_level" />
                  <TextInput label="ระยะเวลาในการปฏิบัติงานที่ สคร.1" value={formData.work_duration_years} field="work_duration_years" />
                </div>
              </div>
            )}

            {/* Tab 1: ทักษะพื้นฐาน */}
            {activeTab === 1 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">สมรรถนะกลาง</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <SkillSelect label="การเขียนหนังสือราชการ" value={formData.skill_official_writing} field="skill_official_writing" />
                  <SkillSelect label="การสรุปการประชุม" value={formData.skill_meeting_summary} field="skill_meeting_summary" />
                  <SkillSelect label="การใช้คอมพิวเตอร์และการเชื่อมต่ออุปกรณ์" value={formData.skill_computer_connection} field="skill_computer_connection" />
                  <SkillSelect label="การสื่อสารและประสานงาน" value={formData.skill_communication} field="skill_communication" />
                  <SkillSelect label="หลักระบาดวิทยา และสถิติเบื้องต้น (ระบาดวิทยาพื้นฐาน / ปฏิบัติการ / CDCU)" value={formData.skill_epidemiology_basic} field="skill_epidemiology_basic" />
                  <SkillSelect label="ทักษะการใช้โปรแกรม Excel" value={formData.skill_excel} field="skill_excel" />
                  <SkillSelect label="ทักษะการใช้โปรแกรมนำเสนอ Powerpoint หรือ Canva" value={formData.skill_presentation} field="skill_presentation" />
                  <SkillSelect label="ทักษะการใช้โปรแกรม AI (Chat GPT, Gemini, Deepseek)" value={formData.skill_ai_tools} field="skill_ai_tools" />
                  <SkillSelect label="ภาษาอังกฤษ พูด ฟัง" value={formData.skill_english_speaking} field="skill_english_speaking" />
                  <SkillSelect label="ภาษาอังกฤษ อ่าน เขียน" value={formData.skill_english_writing} field="skill_english_writing" />
                </div>
                <div className="mt-4">
                  <TextInput label="หากมีคะแนนสอบภาษาอังกฤษ ภายในระยะเวลา 2 ปี (โปรดระบุสถาบัน และ คะแนน)" value={formData.english_test_score} field="english_test_score" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <SkillSelect label="เคยผ่านหลักสูตรการปฐมพยาบาลเบื้องต้นและการช่วยฟื้นคืนชีพ (First Aid & CPR)" value={formData.has_first_aid_course} field="has_first_aid_course" options={yesNoOptions} />
                  <SkillSelect label="ทักษะการปฐมพยาบาลและการช่วยชีวิตเบื้องต้น" value={formData.skill_first_aid} field="skill_first_aid" />
                </div>
                <div className="mt-4">
                  <TextArea label="ท่านมีทักษะ/ประสบการณ์ดังต่อไปนี้" value={formData.special_skills_experience} field="special_skills_experience" />
                  <div className="mt-4">
                    <TextInput label="Liaison - ประสบการณ์การเป็นผู้ประสานงาน / เคยปฏิบัติหน้าที่ Liaison (ระบุจำนวนปี)" value={formData.liaison_experience} field="liaison_experience" />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Competency */}
            {activeTab === 2 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">SSR - Competency</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <SkillSelect label="1. การคิดวิเคราะห์ (Analytical Thinking)" value={formData.competency_analytical_thinking} field="competency_analytical_thinking" />
                  <SkillSelect label="2. การสืบเสาะหาข้อมูล (Information Seeking)" value={formData.competency_information_seeking} field="competency_information_seeking" />
                  <SkillSelect label="3. การวางกลยุทธ์ (Strategic Orientation)" value={formData.competency_strategic_orientation} field="competency_strategic_orientation" />
                </div>
              </div>
            )}

            {/* Tab 3: ทักษะระบาดวิทยา */}
            {activeTab === 3 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">SAT + JIT - ทักษะระบาดวิทยา</h2>
                <h3 className="text-md font-medium mb-3 text-blue-600">SAT</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <SkillSelect label="1. เฝ้าระวัง ตรวจจับ ตรวจสอบ และประเมินความเสี่ยงเหตุการณ์ผิดปกติ" value={formData.epi_surveillance} field="epi_surveillance" />
                  <SkillSelect label="2. การเขียนรายงานสถานการณ์" value={formData.epi_situation_report} field="epi_situation_report" />
                  <SkillSelect label="3. วิเคราะห์ข้อมูล/พยากรณ์โรค" value={formData.epi_data_analysis} field="epi_data_analysis" />
                </div>
                <h3 className="text-md font-medium mb-3 text-blue-600">JIT</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SkillSelect label="1.1 ดำเนินการสอบสวน และควบคุมป้องกันโรค ตามขั้นตอน/กระบวนการ" value={formData.epi_investigation_control} field="epi_investigation_control" />
                  <SkillSelect label="1.2 สามารถออกแบบเครื่องมือเก็บข้อมูลทางระบาดวิทยา Line List Data ด้วยโปรแกรมพื้นฐาน" value={formData.epi_tool_design} field="epi_tool_design" />
                  <SkillSelect label="1.3 วิเคราะห์ข้อมูลเชิงพรรณนา (จำนวน, ร้อยละ, อัตรา, ค่าเฉลี่ย, มัธยฐาน, ส่วนเบี่ยงเบนมาตรฐาน, เปอร์เซนไทล์)" value={formData.epi_descriptive_analysis} field="epi_descriptive_analysis" />
                  <SkillSelect label="1.4 มีทักษะวิเคราะห์ข้อมูลเชิงวิเคราะห์ (case control, cohort study) การใช้สถิติหาค่า RR/OR และ Confident interval P-value" value={formData.epi_analytical_statistics} field="epi_analytical_statistics" />
                  <SkillSelect label="1.5 ทักษะการใช้โปรแกรมวิเคราะห์ข้อมูลขั้นสูง (เช่น R, STATA, SPSS, Epi-info, Python)" value={formData.epi_advanced_software} field="epi_advanced_software" />
                  <SkillSelect label="1.6 สามารถอธิบายระบาดวิทยาเชิงพรรณนา สาเหตุปัจจัยเสี่ยง และแนวทางการป้องกันควบคุมโรค จากผลการวิเคราะห์ข้อมูลได้" value={formData.epi_explain_descriptive} field="epi_explain_descriptive" />
                  <SkillSelect label="1.7 สามารถอธิบายระบาดวิทยาเชิงวิเคราะห์ สาเหตุปัจจัยเสี่ยง และแนวทางการป้องกันควบคุมโรค จากผลการวิเคราะห์ข้อมูลได้" value={formData.epi_explain_analytical} field="epi_explain_analytical" />
                  <SkillSelect label="1.8 ทักษะการเขียนรายงานสอบสวนโรค (รายงานการสอบสวนเฉพาะราย รายงานการสอบสวนโรคเบื้องต้น รายงานสอบสวนโรคเสนอผู้บริหาร รายงานสอบสวนโรคฉบับสมบูรณ์)" value={formData.epi_report_writing} field="epi_report_writing" />
                </div>
              </div>
            )}

            {/* Tab 4: การเก็บตัวอย่าง */}
            {activeTab === 4 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">JIT 2.1-2.12 - การเก็บตัวอย่าง</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SkillSelect label="2.1 การเก็บตัวอย่าง Nasopharyngeal swab (การเก็บตัวอย่างสารคัดหลั่งบริเวณจมูก)" value={formData.sample_nasopharyngeal} field="sample_nasopharyngeal" />
                  <SkillSelect label="2.2 การเก็บตัวอย่าง Throat swab (การเก็บตัวอย่างสารคัดหลั่งบริเวณลำคอ)" value={formData.sample_throat} field="sample_throat" />
                  <SkillSelect label="2.3 การเก็บตัวอย่าง Rectal swab (การเก็บตัวอย่างสารคัดหลั่งบริเวณทวารหนัก)" value={formData.sample_rectal} field="sample_rectal" />
                  <SkillSelect label="2.4 การเก็บตัวอย่าง Swab แผล เช่น ตุ่ม ผื่น สะเก็ดแผล เป็นต้น" value={formData.sample_wound} field="sample_wound" />
                  <SkillSelect label="2.5 การเก็บตัวอย่าง Swab มือ" value={formData.sample_hand} field="sample_hand" />
                  <SkillSelect label="2.6 การเก็บตัวอย่าง Swab ภาชนะ สิ่งของที่เสี่ยงต่อการติดเชื้อ" value={formData.sample_object} field="sample_object" />
                  <SkillSelect label="2.7 การเก็บตัวอย่าง อาเจียน" value={formData.sample_vomit} field="sample_vomit" />
                  <SkillSelect label="2.8 การเก็บตัวอย่าง จากก๊อก, บ่อ, แหล่งน้ำ" value={formData.sample_water} field="sample_water" />
                  <SkillSelect label="2.9 การเก็บตัวอย่าง น้ำแข็ง" value={formData.sample_ice} field="sample_ice" />
                  <SkillSelect label="2.10 การเก็บตัวอย่าง อาหาร" value={formData.sample_food} field="sample_food" />
                  <SkillSelect label="2.11 การเก็บตัวอย่าง เลือด (ปลายนิ้ว)" value={formData.sample_blood_finger} field="sample_blood_finger" />
                  <SkillSelect label="2.12 การเก็บตัวอย่าง เลือด (หลอดเลือดดำ)" value={formData.sample_blood_vein} field="sample_blood_vein" />
                  <SkillSelect label="การบรรจุและขนส่งตัวอย่าง" value={formData.sample_transport} field="sample_transport" />
                </div>
              </div>
            )}

            {/* Tab 5: PPE & ความปลอดภัย */}
            {activeTab === 5 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">JIT 3.1-3.4 + Active Surveillance - PPE & ความปลอดภัย</h2>
                <h3 className="text-md font-medium mb-3 text-blue-600">JIT 3.1-3.4</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <SkillSelect label="3.1 ความสามารถในการใส่-ถอด ชุดป้องกัน Standard PPE (กาวน์กันน้ำ Surgical mask หมวกคลุมผม Face shield ถุงมือ)" value={formData.ppe_standard} field="ppe_standard" />
                  <SkillSelect label="3.2 ความสามารถในการใส่-ถอด ชุดป้องกัน Full PPE (Cover all Leg cover รองเท้าบูท N95 mask แว่นตา หมวกคลุมผม Face shield ถุงมือ)" value={formData.ppe_full} field="ppe_full" />
                  <SkillSelect label="3.3 การจัดการขยะติดเชื้อ (การบรรจุและขนส่งขยะติดเชื้อที่เกิดจากการสอบสวนโรคในชุมชน)" value={formData.waste_management} field="waste_management" />
                  <SkillSelect label="3.4 การระบุพื้นที่ปราศจากเชื้อ พื้นที่ปลอดภัยในการปฏิบัติการสอบสวนโรค" value={formData.zone_identification} field="zone_identification" />
                </div>
                <h3 className="text-md font-medium mb-3 text-blue-600">Active Surveillance - การบริหารจัดการพื้นที่และการป้องกันควบคุมโรคในสถานที่พักพิงชั่วคราว</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SkillSelect label="1. การจัดสรรพื้นที่ในศูนย์พักพิงชั่วคราว (พท.พักอาศัย/พท.ส่วนกลาง/พท.เก็บเสบียงและอาหาร/พท.บริการอาหารและเครื่องดื่ม/พท.ให้บริการด้านสุขภาพ)" value={formData.shelter_area_allocation} field="shelter_area_allocation" />
                  <SkillSelect label="2. การจัดระเบียบพื้นที่ (การจัดทำทะเบียนคนเข้า-ออกจากที่พัก/การตรวจสอบสิ่งของที่รับบริจาค)" value={formData.shelter_organization} field="shelter_organization" />
                  <SkillSelect label="3. การจัดระบบสุขาภิบาลสิ่งแวดล้อมในที่พักชั่วคราว (สุขาภิบาลน้ำ/อาหาร/การจัดการขยะและสิ่งปฏิกูล/การจัดการขยะติดเชื้อ)" value={formData.shelter_sanitation} field="shelter_sanitation" />
                </div>
              </div>
            )}

            {/* Tab 6: วิชาชีพแพทย์/พยาบาล */}
            {activeTab === 6 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Medical Support - วิชาชีพแพทย์/พยาบาล</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <SkillSelect label="1. มีใบประกอบวิชาชีพแพทย์ศาสตร์บัณฑิตหรือพยาบาลศาสตร์บัณฑิต" value={formData.has_medical_license} field="has_medical_license" options={yesNoOptions} />
                  <SkillSelect label="2. ปัจจุบันยังปฏิบัติงานตามวิชาชีพอยู่ เช่น ตรวจวินิจฉัยรักษาผู้ป่วย ให้การพยาบาลผู้ป่วย" value={formData.is_practicing_medical} field="is_practicing_medical" options={yesNoOptions} />
                  <SkillSelect label="3. ความเชี่ยวชาญและประสบการณ์ด้านการคัดกรองโรค" value={formData.screening_expertise} field="screening_expertise" />
                </div>
              </div>
            )}

            {/* Tab 7: งานวัคซีน */}
            {activeTab === 7 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Vaccine Support Team - งานวัคซีน</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SkillSelect label="1. งานสร้างเสริมภูมิคุ้มกันโรค - วิเคราะห์ข้อมูล ประเมินความเสี่ยง และจัดทำรายงานสถานการณ์โรคที่ป้องกันด้วยวัคซีน" value={formData.vaccine_work_analysis} field="vaccine_work_analysis" />
                  <SkillSelect label="2. การเฝ้าระวังเหตุการณ์อาการไม่พึงประสงค์หลังจากได้รับวัคซีน (AEFI) ติดตามสถานการณ์ รวบรวม วิเคราะห์ข้อมูล" value={formData.vaccine_aefi_surveillance} field="vaccine_aefi_surveillance" />
                  <SkillSelect label="3. การสอบสวนโรค - สอบสวนเหตุการณ์ไม่พึงประสงค์ภายหลังได้รับการสร้างเสริมภูมิคุ้มกันโรค และสอบสวนการระบาดโรคที่ป้องกันด้วยวัคซีน" value={formData.vaccine_investigation} field="vaccine_investigation" />
                </div>
              </div>
            )}

            {/* Tab 8: โรคติดต่อนำโดยแมลง */}
            {activeTab === 8 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">ทีมปฏิบัติการสอบสวนควบคุมโรคนำโดยแมลง</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextInput label="1. มีประสบการณ์ด้านการตรวจวินิจฉัยโรคติดต่อนำโดยแมลง ภาคสนามอย่างน้อย 1 ปี" value={formData.vector_diagnosis_experience} field="vector_diagnosis_experience" />
                  <SkillSelect label="2. ทักษะการตรวจโรคติดต่อนำโดยแมลงภาคสนาม" value={formData.vector_field_diagnosis} field="vector_field_diagnosis" />
                  <SkillSelect label="3. การสอบสวนโรคติดต่อนำโดยแมลง" value={formData.vector_investigation} field="vector_investigation" />
                  <SkillSelect label="4. การควบคุมโรคติดต่อนำโดยแมลง" value={formData.vector_control} field="vector_control" />
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">5. ท่านเคยผ่านหลักสูตรดังต่อไปนี้ (เลือกได้มากกว่า 1 ข้อ) - ดูใน Tab &quot;หลักสูตรและประสบการณ์&quot;</p>
                </div>
              </div>
            )}

            {/* Tab 9: งานด่าน */}
            {activeTab === 9 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Point of Entry - งานด่าน</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <SkillSelect label="1. การสุขาภิบาลสิ่งแวดล้อมในช่องทาง" value={formData.port_sanitation} field="port_sanitation" />
                  <SkillSelect label="2. การส่งต่อผู้ป่วยระหว่างประเทศ" value={formData.port_patient_transfer} field="port_patient_transfer" />
                  <SkillSelect label="3. กฎหมายที่เกี่ยวข้องกับด่าน" value={formData.port_law} field="port_law" />
                </div>
              </div>
            )}

            {/* Tab 10: EnvOcc */}
            {activeTab === 10 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Environmental and Occupational Disease Control - EnvOcc</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SkillSelect label="1. การเฝ้าระวัง ป้องกัน ควบคุมโรคจากการประกอบอาชีพและพระราชบัญญัติควบคุมโรคจากการประกอบอาชีพและโรคจากสิ่งแวดล้อม พ.ศ.2562" value={formData.envocc_surveillance} field="envocc_surveillance" />
                  <SkillSelect label="2. การใช้เครื่องมือสุขศาสตร์อุตสาหกรรม และเครื่องมือตรวจวัดสิ่งแวดล้อม" value={formData.envocc_tools} field="envocc_tools" />
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">3. เคยผ่าน หลักสูตร/ประสบการณ์ ต่อไปนี้ (ตอบได้มากกว่า 1 ข้อ) - ดูใน Tab &quot;หลักสูตรและประสบการณ์&quot;</p>
                </div>
              </div>
            )}

            {/* Tab 11: Risk Communication */}
            {activeTab === 11 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Risk Communication - การสื่อสารความเสี่ยง</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <SkillSelect label="1. การจัดการประเด็นข่าวเกี่ยวกับโรคหรือภัยสุขภาพและภาวะวิกฤต (Issue & Crisis Management)" value={formData.risk_comm_crisis} field="risk_comm_crisis" />
                  <SkillSelect label="2. การสกัดประเด็นหลักและสื่อสารให้เข้าใจง่าย (Simplifying Complex Information)" value={formData.risk_comm_simplify} field="risk_comm_simplify" />
                  <SkillSelect label="3. การใช้เทคโนโลยีดิจิทัล (Digital Technology Literacy) เพื่อการสื่อสารความเสี่ยง" value={formData.risk_comm_digital} field="risk_comm_digital" />
                </div>
              </div>
            )}

            {/* Tab 12: เทคนิคการแพทย์ */}
            {activeTab === 12 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Laboratory - เทคนิคการแพทย์</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SkillSelect label="1. มีใบประกอบวิชาชีพเทคนิคการแพทย์ ที่ไม่หมดอายุ" value={formData.has_med_tech_license} field="has_med_tech_license" options={yesNoOptions} />
                  <TextInput label="2. มีประสบการณ์การทำงานในห้องปฏิบัติการอย่างน้อย 1 ปี" value={formData.lab_experience} field="lab_experience" />
                  <TextArea label="3. ภาระกิจเฉพาะวิชาชีพ" value={formData.lab_specific_tasks} field="lab_specific_tasks" />
                  <SkillSelect label="4. ท่านเคยผ่านการอบรมหลักสูตรความปลอดภัยในห้องปฏิบัติการหรือไม่" value={formData.has_lab_safety_course} field="has_lab_safety_course" options={yesNoOptions} />
                </div>
              </div>
            )}

            {/* Tab 13: การแต่งตั้ง */}
            {activeTab === 13 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">กฎหมาย - การแต่งตั้ง</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SkillSelect label="ได้รับแต่งตั้งเป็นเจ้าพนักงานควบคุมโรคติดต่อตาม พรบ.โรคติดต่อ 2558 โดยประกาศกระทรวงสาธารณสุข" value={formData.is_appointed_disease_control} field="is_appointed_disease_control" options={yesNoOptions} />
                  <SkillSelect label="ได้รับแต่งตั้งเป็นพนักงานเจ้าหน้าที่ ตาม พรบ.โรคจากการประกอบอาชีพและโรคจากสิ่งแวดล้อม 2562 โดยประกาศกระทรวงสาธารณสุข" value={formData.is_appointed_envocc} field="is_appointed_envocc" options={yesNoOptions} />
                  <SkillSelect label="ได้รับแต่งตั้งเป็นพนักงานเจ้าหน้าที่ ตาม พรบ. ควบคุมผลิตภัณฑ์ยาสูบ พ.ศ. 2560 และ พรบ. ควบคุมเครื่องดื่มแอลกอฮอล์ (ฉบับที่ 2) พ.ศ. 2568 โดยประกาศกระทรวงสาธารณสุข" value={formData.is_appointed_tobacco_alcohol} field="is_appointed_tobacco_alcohol" options={yesNoOptions} />
                </div>
              </div>
            )}

            {/* Tab 14: กฎหมาย & โลจิสติกส์ */}
            {activeTab === 14 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">กฎหมาย & Logistics Support</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SkillSelect label="การบังคับใช้กฎหมายด้านการป้องกันควบคุมโรคและภัยสุขภาพ" value={formData.law_enforcement} field="law_enforcement" />
                  <SkillSelect label="การจัดทำคำสั่งหรือแนวทาง ระเบียบปฏิบัติเพื่อเป็นไปตามกฎหมายที่เกี่ยวข้อง" value={formData.law_regulation_drafting} field="law_regulation_drafting" />
                  <TextInput label="1. การบริหารจัดการคลังเวชภัณฑ์และโลจิสติกส์ (เคยมีประสบการณ์ด้านการบริหารจัดการคลัง)" value={formData.logistics_experience} field="logistics_experience" />
                  <SkillSelect label="2. สมรรถนะทางกาย (ใช้ทักษะกลาง)" value={formData.physical_fitness} field="physical_fitness" />
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">เคยผ่าน หลักสูตร/ประสบการณ์ ต่อไปนี้ (ตอบได้มากกว่า ข้อ) - ดูใน Tab &quot;หลักสูตรและประสบการณ์&quot;</p>
                </div>
              </div>
            )}

            {/* Tab 15: การบริหารจัดการ */}
            {activeTab === 15 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">HR - การบริหารจัดการ</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <SkillSelect label="1. การบริหารจัดการบุคลากร - ทักษะการบริหารจัดการบุคลากร" value={formData.management_hr} field="management_hr" />
                  <SkillSelect label="การพัฒนาบุคลากรเพื่อตอบโต้ภาวะฉุกฉิน" value={formData.management_hr_development} field="management_hr_development" />
                </div>
              </div>
            )}

            {/* Tab 16: IT & Facility */}
            {activeTab === 16 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Administration - IT & Facility</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextInput label="1. การจัดซื้อจัดจ้าง ในภาวะฉุกเฉิน - 1.1 การจัดซื้อจัดจ้าง โดยวิธีเฉพาะเจาะจง (ท่านได้รับการแต่งตั้งให้เป็นเจ้าหน้าที่พัสดุของหน่วยงาน ใช่/ไม่ใช่)" value={formData.procurement_emergency} field="procurement_emergency" />
                  <SkillSelect label="2. การซ่อมบำรุงคอมพิวเตอร์" value={formData.it_computer_repair} field="it_computer_repair" />
                  <SkillSelect label="3. การบริหารจัดการครุภัณฑ์คอมพิวเตอร์" value={formData.it_equipment_management} field="it_equipment_management" />
                  <SkillSelect label="4. การบริหารจัดการยานพาหนะ" value={formData.facility_vehicle_management} field="facility_vehicle_management" />
                  <SkillSelect label="5. การบริหารจัดการสถานที่ปฏิบัติงานสำรอง (กรณีสถานที่ปฏิบัติงานหลักได้รับความเสียหาย ไม่สามารถปฏิบัติงานได้)" value={formData.facility_backup_site} field="facility_backup_site" />
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">เคยผ่าน หลักสูตร/ประสบการณ์ ต่อไปนี้ (ตอบได้มากกว่า ข้อ) - ดูใน Tab &quot;หลักสูตรและประสบการณ์&quot;</p>
                </div>
              </div>
            )}

            {/* Tab 17: หลักสูตรและประสบการณ์ */}
            {activeTab === 17 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">หลักสูตรและประสบการณ์</h2>
                
                {/* หลักสูตรระบาดวิทยา */}
                <h3 className="text-lg font-medium mb-3 mt-6">หลักสูตรระบาดวิทยา</h3>
                <div className="mb-6">
                  <div className="flex gap-3 mb-3">
                    <select
                      value={selectedTraining}
                      onChange={(e) => setSelectedTraining(e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-lg"
                    >
                      <option value="">เลือกหลักสูตร</option>
                      {trainingCourseOptions.map((course) => (
                        <option key={course} value={course}>{course}</option>
                      ))}
                    </select>
                    <button type="button" onClick={handleAddTraining} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                      เพิ่ม
                    </button>
                  </div>
                  {trainingCourses.length > 0 && (
                    <ul className="space-y-2">
                      {trainingCourses.map((course, index) => (
                        <li key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                          <span>{course}</span>
                          <button type="button" onClick={() => handleRemoveTraining(course)} className="text-red-600 hover:text-red-800">ลบ</button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* หลักสูตรโรคติดต่อนำโดยแมลง */}
                <h3 className="text-lg font-medium mb-3 mt-6">หลักสูตรโรคติดต่อนำโดยแมลง</h3>
                <div className="mb-6">
                  <div className="flex gap-3 mb-3">
                    <select
                      value={selectedVector}
                      onChange={(e) => setSelectedVector(e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-lg"
                    >
                      <option value="">เลือกหลักสูตร</option>
                      {vectorCourseOptions.map((course) => (
                        <option key={course} value={course}>{course}</option>
                      ))}
                    </select>
                    <button type="button" onClick={handleAddVector} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                      เพิ่ม
                    </button>
                  </div>
                  {vectorCourses.length > 0 && (
                    <ul className="space-y-2">
                      {vectorCourses.map((course, index) => (
                        <li key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                          <span>{course}</span>
                          <button type="button" onClick={() => handleRemoveVector(course)} className="text-red-600 hover:text-red-800">ลบ</button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* หลักสูตร EnvOcc */}
                <h3 className="text-lg font-medium mb-3 mt-6">หลักสูตร EnvOcc</h3>
                <div className="mb-6">
                  <div className="flex gap-3 mb-3">
                    <select
                      value={selectedEnvocc}
                      onChange={(e) => setSelectedEnvocc(e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-lg"
                    >
                      <option value="">เลือกหลักสูตร</option>
                      {envoccCourseOptions.map((course) => (
                        <option key={course} value={course}>{course}</option>
                      ))}
                    </select>
                    <button type="button" onClick={handleAddEnvocc} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                      เพิ่ม
                    </button>
                  </div>
                  {envoccCourses.length > 0 && (
                    <ul className="space-y-2">
                      {envoccCourses.map((course, index) => (
                        <li key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                          <span>{course}</span>
                          <button type="button" onClick={() => handleRemoveEnvocc(course)} className="text-red-600 hover:text-red-800">ลบ</button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* หลักสูตรกฎหมาย */}
                <h3 className="text-lg font-medium mb-3 mt-6">หลักสูตรกฎหมาย</h3>
                <div className="mb-6">
                  <div className="flex gap-3 mb-3">
                    <select
                      value={selectedLaw}
                      onChange={(e) => setSelectedLaw(e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-lg"
                    >
                      <option value="">เลือกหลักสูตร</option>
                      {lawCourseOptions.map((course) => (
                        <option key={course} value={course}>{course}</option>
                      ))}
                    </select>
                    <button type="button" onClick={handleAddLaw} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                      เพิ่ม
                    </button>
                  </div>
                  {lawCourses.length > 0 && (
                    <ul className="space-y-2">
                      {lawCourses.map((course, index) => (
                        <li key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                          <span>{course}</span>
                          <button type="button" onClick={() => handleRemoveLaw(course)} className="text-red-600 hover:text-red-800">ลบ</button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* ประสบการณ์อื่นๆ */}
                <h3 className="text-lg font-medium mb-3 mt-6">ประสบการณ์อื่นๆ</h3>
                <div className="mb-6">
                  <div className="flex gap-3 mb-3">
                    <input
                      type="text"
                      value={newExperience}
                      onChange={(e) => setNewExperience(e.target.value)}
                      placeholder="ระบุประสบการณ์"
                      className="flex-1 px-3 py-2 border rounded-lg"
                    />
                    <button type="button" onClick={handleAddExperience} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                      เพิ่ม
                    </button>
                  </div>
                  {otherExperiences.length > 0 && (
                    <ul className="space-y-2">
                      {otherExperiences.map((exp, index) => (
                        <li key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                          <span>{exp}</span>
                          <button type="button" onClick={() => handleRemoveExperience(exp)} className="text-red-600 hover:text-red-800">ลบ</button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
              <button
                type="button"
                onClick={() => router.push('/capacity')}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                บันทึก
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
