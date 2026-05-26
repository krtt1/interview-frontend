"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";

// ใช้ axios แบบไม่มี auth
const publicAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3011",
  headers: {
    "Content-Type": "application/json",
  },
});

export function usePublicEmployees() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [jobTitles, setJobTitles] = useState<any[]>([]);
  const [positionLevels, setPositionLevels] = useState<any[]>([]);
  const [positionTypes, setPositionTypes] = useState<any[]>([]);
  const [jobGroups, setJobGroups] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ================= FETCH OPTIONS ================= */
  const fetchOptions = async () => {
    try {
      const [jt, pl, pt, jg] = await Promise.all([
        publicAPI.get("/job-title/public/getall"),
        publicAPI.get("/position-level/public/getall"),
        publicAPI.get("/position-type/public/getall"),
        publicAPI.get("/jobgroup/public/getall"),
      ]);
      
      setJobTitles(jt.data || []);
      setPositionLevels(pl.data || []);
      setPositionTypes(pt.data || []);
      setJobGroups(jg.data || []);
    } catch (error) {
      console.error("Error fetching public options:", error);
    }
  };

  /* ================= FETCH EMPLOYEES (PUBLIC) ================= */
  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // ใช้ endpoint เดียวกับ Admin แต่แสดงข้อมูลแบบ Public
      const res = await publicAPI.get("/employees/public/getall");
      setEmployees(res.data || []);
    } catch (err) {
      // ถ้า /employees/getall ไม่ได้ ลองใช้ /employees/public/getall
      try {
        const res = await publicAPI.get("/employees/public/getall");
        setEmployees(res.data || []);
      } catch (err2) {
        setEmployees([]);
        setError("ไม่สามารถดึงข้อมูลบุคลากรได้");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOptions();
    fetchEmployees();
  }, [fetchEmployees]);

  return {
    employees,
    jobTitles,
    positionLevels,
    positionTypes,
    jobGroups,
    loading,
    error,
    refresh: fetchEmployees,
  } as const;
}

export default usePublicEmployees;
