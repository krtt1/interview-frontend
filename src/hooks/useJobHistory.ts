"use client";

import { useEffect, useState, useCallback } from "react";
import API from "@/lib/api";

export type JobHistoryRecord = {
  history_id: number;
  employee_id: string;
  job_group_id: number;
  job_group: {
    job_group_id: number;
    job_group_name: string;
  };
  position_type?: {
    position_type_id: number;
    position_type_name: string;
  };
  position_level?: {
    position_level_id: number;
    position_level_name: string;
  };
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  duration: {
    years: number;
    months: number;
    days: number;
  } | null;
  created_at: string;
  updated_at: string;
};

export type CurrentJob = {
  employee_id: string;
  current_job: {
    job_group_id: number;
    job_group_name: string;
  };
  position_type?: {
    position_type_id: number;
    position_type_name: string;
  };
  position_level?: {
    position_level_id: number;
    position_level_name: string;
  };
  start_date: string;
  duration: {
    years: number;
    months: number;
    days: number;
    display: string;
  };
};

export function useJobHistory(employeeId: string | undefined) {
  const [history, setHistory] = useState<JobHistoryRecord[]>([]);
  const [currentJob, setCurrentJob] = useState<CurrentJob | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJobHistory = useCallback(async () => {
    if (!employeeId) return;

    setLoading(true);
    setError(null);

    try {
      const [historyRes, currentRes] = await Promise.all([
        API.get(`/employees/${employeeId}/job-history`),
        API.get(`/employees/${employeeId}/current-job`),
      ]);

      setHistory(historyRes.data.data || []);
      setCurrentJob(currentRes.data.current_job ? currentRes.data : null);
    } catch (err: any) {
      console.error("Error fetching job history:", err);
      setError(err?.response?.data?.message || "ไม่สามารถดึงข้อมูลประวัติการทำงานได้");
    } finally {
      setLoading(false);
    }
  }, [employeeId]);

  useEffect(() => {
    fetchJobHistory();
  }, [fetchJobHistory]);

  const changeJobGroup = async (newJobGroupId: number, startDate: string, positionTypeId: number | null = null, positionLevelId: number | null = null) => {
    if (!employeeId) return;

    const payload: any = {
      new_job_group_id: newJobGroupId,
      start_date: startDate,
    };

    // ส่ง position_type_id และ position_level_id เฉพาะเมื่อมีค่า
    if (positionTypeId !== null && positionTypeId !== undefined) {
      payload.position_type_id = positionTypeId;
    }
    if (positionLevelId !== null && positionLevelId !== undefined) {
      payload.position_level_id = positionLevelId;
    }

    try {
      await API.post(`/employees/${employeeId}/job-history/change`, payload);
      await fetchJobHistory();
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err?.response?.data?.message || "ไม่สามารถเปลี่ยนตำแหน่งได้",
      };
    }
  };

  const updateStartDate = async (historyId: number, startDate: string) => {
    try {
      await API.patch(`/job-history/${historyId}/start-date`, {
        start_date: startDate,
      });

      await fetchJobHistory();
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err?.response?.data?.message || "ไม่สามารถแก้ไขวันที่ได้",
      };
    }
  };

  const initializeJobHistory = async (jobGroupId: number, startDate: string | null, positionTypeId: number | null = null, positionLevelId: number | null = null) => {
    if (!employeeId) return { success: false, error: "ไม่พบรหัสบัตรประชาชน" };

    const payload: any = {
      job_group_id: jobGroupId,
      start_date: startDate,
    };

    // ส่ง position_type_id และ position_level_id เฉพาะเมื่อมีค่า
    if (positionTypeId !== null && positionTypeId !== undefined) {
      payload.position_type_id = positionTypeId;
    }
    if (positionLevelId !== null && positionLevelId !== undefined) {
      payload.position_level_id = positionLevelId;
    }

    try {
      await API.post(`/employees/${employeeId}/job-history/initialize`, payload);
      await fetchJobHistory();
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err?.response?.data?.message || "ไม่สามารถสร้างประวัติการทำงานได้",
      };
    }
  };

  return {
    history,
    currentJob,
    loading,
    error,
    refresh: fetchJobHistory,
    changeJobGroup,
    updateStartDate,
    initializeJobHistory,
  };
}
