"use client";

import { useState, useEffect, useCallback } from "react";
import API from "@/lib/api";

export type CapacityData = {
  capacity_id?: number;
  employee_id: string;
  
  // ข้อมูลพื้นฐาน
  prefix_name?: string;
  full_name?: string;
  department?: string;
  age?: number;
  education_level?: string;
  work_duration_years?: string;
  
  // ทักษะพื้นฐาน
  skill_official_writing?: string;
  skill_meeting_summary?: string;
  skill_computer_connection?: string;
  skill_communication?: string;
  skill_epidemiology_basic?: string;
  skill_excel?: string;
  skill_presentation?: string;
  skill_ai_tools?: string;
  skill_english_speaking?: string;
  skill_english_writing?: string;
  
  // คะแนนภาษาอังกฤษ
  english_test_score?: string;
  
  // First Aid & CPR
  has_first_aid_course?: string;
  skill_first_aid?: string;
  
  // ทักษะ/ประสบการณ์พิเศษ
  special_skills_experience?: string;
  
  // ประสบการณ์ Liaison
  liaison_experience?: string;
  
  // Competency
  competency_analytical_thinking?: string;
  competency_information_seeking?: string;
  competency_strategic_orientation?: string;
  
  // ทักษะระบาดวิทยา
  epi_surveillance?: string;
  epi_situation_report?: string;
  epi_data_analysis?: string;
  epi_investigation_control?: string;
  epi_tool_design?: string;
  epi_descriptive_analysis?: string;
  epi_analytical_statistics?: string;
  epi_advanced_software?: string;
  epi_explain_descriptive?: string;
  epi_explain_analytical?: string;
  epi_report_writing?: string;
  
  // ทักษะการเก็บตัวอย่าง
  sample_nasopharyngeal?: string;
  sample_throat?: string;
  sample_rectal?: string;
  sample_wound?: string;
  sample_hand?: string;
  sample_object?: string;
  sample_vomit?: string;
  sample_water?: string;
  sample_ice?: string;
  sample_food?: string;
  sample_blood_finger?: string;
  sample_blood_vein?: string;
  sample_transport?: string;
  
  // ทักษะ PPE และความปลอดภัย
  ppe_standard?: string;
  ppe_full?: string;
  waste_management?: string;
  zone_identification?: string;
  shelter_area_allocation?: string;
  shelter_organization?: string;
  shelter_sanitation?: string;
  
  // วิชาชีพแพทย์/พยาบาล
  has_medical_license?: string;
  is_practicing_medical?: string;
  screening_expertise?: string;
  
  // งานวัคซีน
  vaccine_work_analysis?: string;
  vaccine_aefi_surveillance?: string;
  vaccine_investigation?: string;
  
  // งานโรคติดต่อนำโดยแมลง
  vector_diagnosis_experience?: string;
  vector_field_diagnosis?: string;
  vector_investigation?: string;
  vector_control?: string;
  
  // งานด่าน
  port_sanitation?: string;
  port_patient_transfer?: string;
  port_law?: string;
  
  // งาน EnvOcc
  envocc_surveillance?: string;
  envocc_tools?: string;
  
  // Risk Communication
  risk_comm_crisis?: string;
  risk_comm_simplify?: string;
  risk_comm_digital?: string;
  
  // เทคนิคการแพทย์
  has_med_tech_license?: string;
  lab_experience?: string;
  lab_specific_tasks?: string;
  has_lab_safety_course?: string;
  
  // การแต่งตั้ง
  is_appointed_disease_control?: string;
  is_appointed_envocc?: string;
  is_appointed_tobacco_alcohol?: string;
  
  // ทักษะกฎหมาย
  law_enforcement?: string;
  law_regulation_drafting?: string;
  
  // โลจิสติกส์
  logistics_experience?: string;
  
  // สมรรถนะทางกาย
  physical_fitness?: string;
  
  // การบริหารจัดการ
  management_hr?: string;
  management_hr_development?: string;
  
  // การจัดซื้อจัดจ้าง
  procurement_emergency?: string;
  
  // IT & Facility
  it_computer_repair?: string;
  it_equipment_management?: string;
  facility_vehicle_management?: string;
  facility_backup_site?: string;
  
  // หลักสูตรและประสบการณ์
  trainingCourses?: Array<{ course_name: string }>;
  vectorCourses?: Array<{ course_name: string }>;
  envoccCourses?: Array<{ course_name: string }>;
  lawCourses?: Array<{ course_name: string }>;
  otherExperiences?: Array<{ experience_name: string }>;
};

export function useCapacity(employeeId: string | undefined) {
  const [capacity, setCapacity] = useState<CapacityData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCapacity = useCallback(async () => {
    if (!employeeId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await API.get(`/capacity/${employeeId}`);
      setCapacity(response.data.data || null);
    } catch (err: any) {
      if (err?.response?.status === 404) {
        setCapacity(null);
      } else {
        setError(err?.response?.data?.message || "ไม่สามารถดึงข้อมูลได้");
      }
    } finally {
      setLoading(false);
    }
  }, [employeeId]);

  const saveCapacity = async (capacityData: Partial<CapacityData>, targetEmployeeId?: string) => {
    const finalEmployeeId = targetEmployeeId || employeeId;
    if (!finalEmployeeId) return { success: false, error: "ไม่พบรหัสบัตรประชาชน" };

    setLoading(true);
    try {
      const response = await API.post(`/capacity/${finalEmployeeId}`, capacityData);
      setCapacity(response.data.data);
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err?.response?.data?.message || "ไม่สามารถบันทึกข้อมูลได้",
      };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCapacity();
  }, [fetchCapacity]);

  return {
    capacity,
    loading,
    error,
    saveCapacity,
    refetch: fetchCapacity,
  };
}

// Hook สำหรับลบข้อมูล
export function useCapacityDelete() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteCapacity = async (employeeId: string) => {
    setLoading(true);
    setError(null);

    try {
      await API.delete(`/capacity/${employeeId}`);
      return { success: true };
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "ไม่สามารถลบข้อมูลได้";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { deleteCapacity, loading, error };
}

// Hook สำหรับดึงรายการทั้งหมด
export function useCapacityList() {
  const [capacities, setCapacities] = useState<CapacityData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchCapacities = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await API.get('/capacity');
      setCapacities(response.data.data || []);
      setTotal(response.data.total || 0);
    } catch (err: any) {
      setError(err?.response?.data?.message || "ไม่สามารถดึงข้อมูลได้");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCapacities();
  }, [fetchCapacities]);

  return { capacities, loading, error, total, refetch: fetchCapacities };
}

// Hook สำหรับ Export Excel
export function useCapacityExport() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportToExcel = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await API.get('/capacity/export', {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `capacity_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return { success: true };
    } catch (err: any) {
      const errorMessage = "ไม่สามารถ Export ข้อมูลได้";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { exportToExcel, loading, error };
}

// Hook สำหรับ Import Excel
export function useCapacityImport() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const importFromExcel = async (file: File) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await API.post('/capacity/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return { 
        success: true, 
        imported: response.data.imported || 0,
        failed: response.data.failed || 0,
        errors: response.data.errors || []
      };
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "ไม่สามารถ Import ข้อมูลได้";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { importFromExcel, loading, error };
}
