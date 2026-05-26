"use client";
import { useEffect, useState, useCallback } from "react";
import API from "@/lib/api";

/**
 * Expected backend endpoints (adjust if backend path ต่างไป):
 * GET  /dashboard/kpis                     -> { totalPersonnel, pendingLeaves, retiringThisYear, retiringHighlights }
 * GET  /personnel/type-distribution        -> [{ label, value (number) OR percent (string like "46%"), colorCode }]
 * GET  /personnel/generation               -> [{ label, value }]
 * GET  /personnel/retirement?years=10      -> [{ year, total, keyPositions }]
 * GET  /locations/chiangmai                -> [{ name, lat, lng, type }]
 */

export type Kpis = {
  totalPersonnel?: number;
  pendingLeaves?: number;
  retiringThisYear?: number;
  retiringHighlights?: string;
};

export type ChartDatum = { label: string; value: number; colorCode?: string; [k: string]: any };

export const useDashboard = () => {
  const [kpis, setKpis] = useState<Kpis | null>(null);
  const [typeDistribution, setTypeDistribution] = useState<ChartDatum[]>([]);
  const [generationData, setGenerationData] = useState<ChartDatum[]>([]);
  const [retirementTable, setRetirementTable] = useState<any[]>([]);
  const [mapMarkers, setMapMarkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const normalizePercentOrNumber = (v: any): number => {
    if (typeof v === "number") return v;
    if (typeof v === "string") {
      const n = parseFloat(v.replace("%", "").trim());
      return Number.isFinite(n) ? n : 0;
    }
    return 0;
  };

  const fetchKpis = useCallback(async () => {
    try {
      const res = await API.get("/dashboard/kpis");
      setKpis(res.data ?? null);
    } catch (e: any) {
      console.error("fetchKpis error", e);
      setError("fetchKpis error");
    }
  }, []);

  const fetchTypeDistribution = useCallback(async () => {
    try {
      const res = await API.get("/personnel/type-distribution");
      const arr = Array.isArray(res.data) ? res.data : [];
      const normalized: ChartDatum[] = arr.map((d: any) => ({
        label: d.label ?? d.name ?? "ไม่ระบุ",
        value: normalizePercentOrNumber(d.value ?? d.percent),
        colorCode: d.colorCode ?? d.color ?? undefined,
        ...d,
      }));
      setTypeDistribution(normalized);
    } catch (e: any) {
      console.error("fetchTypeDistribution error", e);
      setError("fetchTypeDistribution error");
    }
  }, []);

  const fetchGeneration = useCallback(async () => {
    try {
      const res = await API.get("/personnel/generation");
      const arr = Array.isArray(res.data) ? res.data : [];
      const normalized: ChartDatum[] = arr.map((d: any) => ({
        label: d.label ?? d.name ?? "ไม่ระบุ",
        value: typeof d.value === "number" ? d.value : parseInt(d.value, 10) || 0,
        colorCode: d.colorCode ?? undefined,
        ...d,
      }));
      setGenerationData(normalized);
    } catch (e: any) {
      console.error("fetchGeneration error", e);
      setError("fetchGeneration error");
    }
  }, []);

  const fetchRetirement = useCallback(async (years = 10) => {
    try {
      const res = await API.get(`/personnel/retirement?years=${years}`);
      setRetirementTable(Array.isArray(res.data) ? res.data : []);
    } catch (e: any) {
      console.error("fetchRetirement error", e);
      setError("fetchRetirement error");
    }
  }, []);

  const fetchMapMarkers = useCallback(async () => {
    try {
      const res = await API.get("/locations/chiangmai");
      setMapMarkers(Array.isArray(res.data) ? res.data : []);
    } catch (e: any) {
      console.error("fetchMapMarkers error", e);
      setError("fetchMapMarkers error");
    }
  }, []);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // run in parallel
      await Promise.all([
        fetchKpis(),
        fetchTypeDistribution(),
        fetchGeneration(),
        fetchRetirement(),
        fetchMapMarkers(),
      ]);
    } catch (e) {
      console.error("fetchAll error", e);
    } finally {
      setLoading(false);
    }
  }, [fetchKpis, fetchTypeDistribution, fetchGeneration, fetchRetirement, fetchMapMarkers]);

  useEffect(() => {
    // fetch on mount
    fetchAll();
  }, [fetchAll]);

  return {
    kpis,
    typeDistribution,
    generationData,
    retirementTable,
    mapMarkers,
    loading,
    error,
    refresh: fetchAll,
    fetchKpis,
    fetchTypeDistribution,
    fetchGeneration,
    fetchRetirement,
    fetchMapMarkers,
  } as const;
};

export default useDashboard;