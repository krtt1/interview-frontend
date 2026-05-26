// src/hooks/useEmployeeSummary.ts
"use client";
import { useEffect, useState } from "react";
import API from "@/lib/api";

export type EmployeeSummary = {
  total: number;
  gender: {
    ชาย: number;
    หญิง: number;
  };
  generation: Record<string, number>;
};

export function useEmployeeSummary() {
  const [summary, setSummary] = useState<EmployeeSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/employees/summary")
      .then(res => setSummary(res.data))
      .finally(() => setLoading(false));
  }, []);

  return { summary, loading };
}