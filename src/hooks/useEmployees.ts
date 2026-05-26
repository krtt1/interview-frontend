"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import API from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

/* ================= API MODEL ================= */
export type CurrentUser = { id: string; role: string; name: string };

export type WorkStatus = 'ปฏิบัติหน้าที่' | 'หมดสัญญา' | 'โอนย้าย' | 'ลาออก' | 'เสียชีวิต';

export const WORK_STATUS_OPTIONS: WorkStatus[] = [
  'ปฏิบัติหน้าที่',
  'หมดสัญญา',
  'โอนย้าย',
  'ลาออก',
  'เสียชีวิต',
];

export type APIEmployee = {
  id: string;
  prefix_th?: string | null;
  first_name_th?: string | null;
  last_name_th?: string | null;
  phone_number?: string | null;
  gender?: string | null;
  role?: string | null;
  created_at?: string | null;
  birth_date?: string | null;
  age?: number | null;

  job_title_id?: number | null;
  position_level_id?: number | null;
  position_type_id?: number | null;
  job_group_id?: number | null;

  [k: string]: any;
};

/* ================= UI MODEL ================= */
export type UIEmployee = {
  id: string;
  name: string;
  phone?: string;
  gender?: "ชาย" | "หญิง" | null;
  age?: number | null;
  role?: string | null;
  createdAt?: string | null;
  workStatus?: WorkStatus;
  raw?: APIEmployee;
};

/* ================= UTILS ================= */
const normalize = (v?: string | null) =>
  v ? String(v).replace(/\s+/g, " ").trim() : "";

const normalizeGender = (g?: string | null): "ชาย" | "หญิง" | null => {
  if (!g) return null;
  if (g === "male") return "ชาย";
  if (g === "female") return "หญิง";
  if (g === "ชาย" || g === "หญิง") return g;
  return null;
};

/* ================= MAP ================= */
const mapApiToUI = (a: APIEmployee): UIEmployee => ({
  id: a.id,
  name:
    `${normalize(a.prefix_th)} ${normalize(a.first_name_th)} ${normalize(a.last_name_th)}` ||
    a.id,
  phone: normalize(a.phone_number),
  gender: normalizeGender(a.gender),
  age: a.age ?? null,
  role: a.role ?? null,
  createdAt: a.created_at ?? null,
  workStatus: (a.work_status as WorkStatus) ?? 'ปฏิบัติหน้าที่',
  raw: a,
});

/* ================= HOOK ================= */
export function useEmployees() {
  const { user, loading: authLoading, isAdminLevel } = useAuth();

  const stored =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null;

  const currentUser = stored
    ? { id: stored.id, role: stored.role, name: stored.name }
    : null;

  const [employees, setEmployees] = useState<UIEmployee[]>([]);
  const [jobTitles, setJobTitles] = useState<any[]>([]);
  const [positionLevels, setPositionLevels] = useState<any[]>([]);
  const [positionTypes, setPositionTypes] = useState<any[]>([]);
  const [jobGroups, setJobGroups] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // ================= MODAL STATES =================
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<Partial<UIEmployee> | null>(null);
  const [editing, setEditing] = useState<UIEmployee | null>(null);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailEmp, setDetailEmp] = useState<UIEmployee | null>(null);

  /* ================= FETCH EMPLOYEES ================= */
  const fetchEmployees = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);
    try {
      if (isAdminLevel) {
        const res = await API.get("/employees/getall");
        setEmployees((res.data || []).map(mapApiToUI));
      } else {
        const res = await API.get(`/employees/${user.id}`);
        const emp = res.data ? mapApiToUI(res.data) : null;
        setEmployees(emp ? [emp] : []);
      }
    } catch {
      setEmployees([]);
      setError("ไม่สามารถดึงข้อมูลบุคลากรได้");
    } finally {
      setLoading(false);
    }
  }, [user, isAdminLevel]);

  /* ================= FETCH OPTIONS ================= */
  const fetchOptions = async () => {
    try {
      const [jt, pl, pt, jg] = await Promise.all([
        API.get("/job-title/getall"),
        API.get("/position-level/getall"),
        API.get("/position-type/getall"),
        API.get("/jobgroup/getall"),
      ]);
      
      setJobTitles(jt.data || []);
      setPositionLevels(pl.data || []);
      setPositionTypes(pt.data || []);
      setJobGroups(jg.data || []);
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    // โหลด options ก่อน แล้วค่อยโหลด employees
    fetchOptions().then(() => {
      fetchEmployees();
    });
  }, [authLoading, fetchEmployees]);

  /* ================= FILTER ================= */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return employees;
    
    return employees.filter((e) => {
      // ค้นหาจากชื่อ-นามสกุล
      if (e.name.toLowerCase().includes(q)) return true;
      
      // ค้นหาจากเบอร์โทร
      if ((e.phone ?? "").toLowerCase().includes(q)) return true;
      
      // ค้นหาจากกลุ่มงาน (job group)
      const jobGroupId = e.raw?.job_group_id;
      if (jobGroupId) {
        const jobGroup = jobGroups.find((jg) => jg.id === jobGroupId);
        const jobGroupName = jobGroup?.job_group_name || jobGroup?.name_th || jobGroup?.name || "";
        if (jobGroupName.toLowerCase().includes(q)) return true;
      }
      
      // ค้นหาจากตำแหน่ง (job title)
      const jobTitleId = e.raw?.job_title_id;
      if (jobTitleId) {
        const jobTitle = jobTitles.find((jt) => jt.id === jobTitleId);
        const jobTitleName = jobTitle?.job_title_name || jobTitle?.name_th || jobTitle?.name || "";
        if (jobTitleName.toLowerCase().includes(q)) return true;
      }
      
      return false;
    });
  }, [search, employees, jobGroups, jobTitles]);

  /* ================= STATS ================= */
  const totalCountAll = employees.length;
  const totalCountVisible = filtered.length;

  const genderCounts = useMemo(
    () =>
      filtered.reduce(
        (acc, emp) => {
          const g = emp.gender;
          if (g === "ชาย") acc["ชาย"]++;
          else if (g === "หญิง") acc["หญิง"]++;
          else acc["อื่นๆ/ไม่ระบุ"]++;
          return acc;
        },
        { ชาย: 0, หญิง: 0, "อื่นๆ/ไม่ระบุ": 0 }
      ),
    [filtered]
  );

  const genderChartData = useMemo(
    () => [
      { name: "ชาย", value: genderCounts["ชาย"], colorCode: "#2563eb" },
      { name: "หญิง", value: genderCounts["หญิง"], colorCode: "#ec4899" },
      {
        name: "อื่นๆ/ไม่ระบุ",
        value: genderCounts["อื่นๆ/ไม่ระบุ"],
        colorCode: "#f59e0b",
      },
    ],
    [genderCounts]
  );

  // ================= ACTIONS =================
  const openForm = (emp?: UIEmployee) => {
    if (emp) {
      setEditing(emp);
      setForm({ ...emp, raw: emp.raw });
    } else {
      setEditing(null);
      setForm({});
    }
    setIsModalOpen(true);
  };

  const closeForm = () => {
    setIsModalOpen(false);
    setForm(null);
    setEditing(null);
  };

  const openDetail = (emp: UIEmployee) => {
    setDetailEmp(emp);
    setDetailOpen(true);
  };

  const closeDetail = () => {
    setDetailEmp(null);
    setDetailOpen(false);
  };

  // 🔥 FIX HERE — ใช้ /employees/register
  const save = async (payload: any) => {
    if (editing) {
      const res = await API.put(`/employees/${editing.id}`, payload);
      await fetchEmployees();
      return res.data;
    } else {
      const res = await API.post(`/employees/register`, payload);
      await fetchEmployees();
      return res.data;
    }
  };

  const remove = async (id: string) => {
    if (!confirm("ต้องการลบบุคลากรคนนี้หรือไม่?")) return;
    await API.delete(`/employees/${id}`);
    await fetchEmployees();
  };

  /* ================= RETURN ================= */
  return {
    employees,
    filtered,

    search,
    setSearch,

    loading,
    error,
    refresh: fetchEmployees,

    // modal + actions
    isModalOpen,
    openForm,
    closeForm,
    form,
    setForm,
    editing,
    save,
    remove,

    detailOpen,
    detailEmp,
    openDetail,
    closeDetail,

    totalCountAll,
    totalCountVisible,
    genderCounts,
    genderChartData,

    isAdmin: isAdminLevel,
    currentUser,

    jobTitles,
    positionLevels,
    positionTypes,
    jobGroups,
  } as const;
}

export default useEmployees;