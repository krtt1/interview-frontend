// src/hooks/usePublicEmployeeSummary.ts
"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export type EmployeeSummary = {
  total: number;
  gender: {
    ชาย: number;
    หญิง: number;
  };
  generation: Record<string, number>;
};

// ใช้ axios แบบไม่มี auth
const publicAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3011",
  headers: {
    "Content-Type": "application/json",
  },
});

export function usePublicEmployeeSummary() {
  const [summary, setSummary] = useState<EmployeeSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicAPI.get("/employees/public/summary")
      .then(res => setSummary(res.data))
      .catch(err => {
        console.error("Error fetching public summary:", err);
        setSummary(null);
      })
      .finally(() => setLoading(false));
  }, []);

  return { summary, loading };
}
