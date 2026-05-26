"use client";

import React, { useState, useEffect } from "react";
import { Metadata } from "next";
import InfoCard from "@/components/ui/InfoCard";
import SectionPanel from "@/components/ui/SectionPanel";
import dynamic from "next/dynamic";
import { useEmployeeSummary } from "@/hooks/useEmployeeSummary";

// 🔹 Org structure
import OrganizationStructure from "@/components/organization/OrganizationStructure";

// 🔹 Employee Search Widget
import EmployeeSearchWidget from "@/components/dashboard/EmployeeSearchWidget";

// 🔹 Location panel (Map + List)
import LocationInfoPanel from "@/components/map/LocationInfoPanel";

// ---------------- charts (client-only) ----------------
const PersonnelPieChart = dynamic(
  () => import("@/components/chart/PersonnelPieChart"),
  { ssr: false }
);

const GenBarChart = dynamic(
  () => import("@/components/chart/GenBarChart"),
  { ssr: false }
);

const ChiangMaiMap = dynamic(
  () => import("@/components/map/ChiangMaiMap"),
  { 
    ssr: false,
    loading: () => <div className="h-full w-full bg-gray-100 animate-pulse flex items-center justify-center">กำลังโหลดแผนที่...</div>
  }
);

// ✅ ใช้ RetirementTable สำหรับ Admin/SuperAdmin
const RetirementTable = dynamic(
  () => import("@/components/dashboard/RetirementTable"),
  { ssr: false }
);

// ✅ ใช้ PublicRetirementTable สำหรับ User ธรรมดา
const PublicRetirementTable = dynamic(
  () => import("@/components/dashboard/PublicRetirementTable"),
  { ssr: false }
);

// ---------------- Dashboard ----------------
const Dashboard: React.FC = () => {
  const { summary, loading } = useEmployeeSummary();
  const [userRole, setUserRole] = useState<string>("");

  // Check user role
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUserRole(String(parsed.role || "").toLowerCase());
      } catch {
        setUserRole("user");
      }
    }
  }, []);

  const isAdminOrSuperAdmin = userRole === "admin" || userRole === "superadmin";

  // ---------------- gender pie ----------------
  const genderChartData = React.useMemo(() => {
    if (!summary) return [];

    const male = summary.gender?.ชาย ?? 0;
    const female = summary.gender?.หญิง ?? 0;
    const total = summary.total ?? male + female;
    const other = Math.max(0, total - male - female);

    return [
      { name: "ชาย", label: "ชาย", value: male, color: "#2563eb", colorCode: "#2563eb" },
      { name: "หญิง", label: "หญิง", value: female, color: "#ec4899", colorCode: "#ec4899" },
      { name: "อื่น/ไม่ระบุ", label: "อื่น/ไม่ระบุ", value: other, color: "#f59e0b", colorCode: "#f59e0b" },
    ];
  }, [summary]);

  // ---------------- generation bar ----------------
  const generationData = React.useMemo(() => {
    if (!summary) return [];
    return [
      { label: "Gen Z (< 27)", value: summary.generation?.["Gen Z (< 27)"] ?? 0, color: "bg-yellow-400" },
      { label: "Gen Y (27-42)", value: summary.generation?.["Gen Y (27-42)"] ?? 0, color: "bg-blue-500" },
      { label: "Gen X (43-58)", value: summary.generation?.["Gen X (43-58)"] ?? 0, color: "bg-green-500" },
      { label: "Boomer (59+)", value: summary.generation?.["Boomer (59+)"] ?? 0, color: "bg-red-500" },
    ];
  }, [summary]);

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col lg:flex-row items-start justify-between gap-4 mb-6">
        <div className="w-full lg:w-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            <span className="text-blue-700">Dashboard</span>{" "}
            ระบบข้อมูลสารสนเทศบุคลากร สคร.1
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Human Resource Information System ODPC1
          </p>
        </div>
        
        {/* Search Widget */}
        <div className="w-full lg:w-80">
          <EmployeeSearchWidget />
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <InfoCard 
          title="บุคลากรทั้งหมด" 
          value={loading ? "..." : `${summary?.total ?? 0} คน`} 
          subText="ข้อมูลรวมทั้งองค์กร" 
          color="border-blue-500" 
        />
        <InfoCard 
          title="บุคลากรชาย" 
          value={loading ? "..." : `${summary?.gender?.ชาย ?? 0} คน`} 
          subText="จำแนกตามเพศ" 
          color="border-sky-500" 
        />
        <InfoCard 
          title="บุคลากรหญิง" 
          value={loading ? "..." : `${summary?.gender?.หญิง ?? 0} คน`} 
          subText="จำแนกตามเพศ" 
          color="border-pink-500" 
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8">
        <SectionPanel title="จำแนกประเภทบุคลากร (เพศ)">
          <PersonnelPieChart data={genderChartData} isLoading={loading} />
        </SectionPanel>
        <SectionPanel title="โครงสร้างกำลังคนตาม Generation">
          <GenBarChart data={generationData} />
        </SectionPanel>
      </div>

      {/* Org + Retirement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8">
        <SectionPanel title="โครงสร้างการบริหารงาน" heightClass="min-h-[420px]">
          <OrganizationStructure />
        </SectionPanel>
        <SectionPanel title="ตารางการสูญเสียบุคลากร 10 ปี (Succession Planning)" heightClass="min-h-[420px]">
          {isAdminOrSuperAdmin ? <RetirementTable /> : <PublicRetirementTable />}
        </SectionPanel>
      </div>

      {/* Map + Location Info */}
      <SectionPanel title="ข้อมูลที่ตั้งอาคารสำนักงานและพื้นที่ควบคุมโรค" heightClass="min-h-[520px]" paddingClass="p-0">
        {/* ส่ง ChiangMaiMap ที่เป็น dynamic component เข้าไป */}
        <LocationInfoPanel MapComponent={ChiangMaiMap as any} />
      </SectionPanel>
    </div>
  );
};

export default Dashboard;