"use client";

import React, { useEffect, useState } from "react";
import {
  useEmployees,
  UIEmployee,
  APIEmployee,
} from "@/hooks/useEmployees";

import ProfileCard from "@/components/profile/ProfileCard";
import BasicInfo from "@/components/profile/BasicInfo";
import EducationSection from "@/components/profile/EducationSection";
import WorkInfo from "@/components/profile/WorkInfo";
import EditProfileModal from "@/components/profile/EditProfileModal";
import ChangePasswordModal from "@/components/profile/ChangePasswordModal";
import JobHistorySection from "@/components/profile/JobHistorySection";
import CapacitySection from "@/components/profile/CapacitySection";

export default function MePage() {
  const {
    filtered,
    refresh,
    currentUser,
    jobTitles,
    positionLevels,
    positionTypes,
    jobGroups,
  } = useEmployees() as any;

  const [me, setMe] = useState<(UIEmployee & { raw: APIEmployee }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);

  /* ================= FIND CURRENT USER ================= */
  useEffect(() => {
    setLoading(true);
    setError(null);

    if (!currentUser) {
      setError("ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่");
      setLoading(false);
      return;
    }

    const found = (filtered ?? []).find(
      (e: UIEmployee) => String(e.id) === String(currentUser.id)
    );

    if (!found) {
      setError("ไม่พบข้อมูลผู้ใช้ในระบบ");
      setMe(null);
    } else {
      setMe(found as UIEmployee & { raw: APIEmployee });
    }
    setLoading(false);
  }, [filtered, currentUser]);

  if (loading)
    return <div className="p-6 text-sm text-gray-500">กำลังโหลดข้อมูล...</div>;
  if (error)
    return <div className="p-6 text-red-600 text-sm">{error}</div>;
  if (!me)
    return (
      <div className="p-6 text-red-600 text-sm">
        ไม่พบข้อมูลผู้ใช้ กรุณาลองใหม่อีกครั้ง
      </div>
    );

  const raw = me.raw;

  /* ================= OPTION MAP ================= */
  const mapOpt = (arr: any[], idKey: string, nameKey: string) =>
    Object.fromEntries(arr.map((x) => [String(x[idKey] ?? x.id), x[nameKey] ?? x.name]));

  const jobTitleOptions = mapOpt(jobTitles ?? [], "job_title_id", "job_title_name");
  const positionLevelOptions = mapOpt(positionLevels ?? [], "position_level_id", "position_level_name");
  const positionTypeOptions = mapOpt(positionTypes ?? [], "position_type_id", "position_type_name");
  const jobGroupOptions = mapOpt(jobGroups ?? [], "job_group_id", "job_group_name");

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">ข้อมูลของฉัน</h1>
          <p className="text-sm text-gray-500 mt-1">
            โปรไฟล์บุคลากรของคุณ สามารถใช้ตรวจสอบความถูกต้องของข้อมูลส่วนตัว
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setPasswordOpen(true)}
            className="px-4 py-2 rounded-lg bg-orange-600 text-white text-sm hover:bg-orange-700"
          >
            🔒 เปลี่ยนรหัสผ่าน
          </button>
          <button
            onClick={() => setEditOpen(true)}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700"
          >
            แก้ไขข้อมูล
          </button>
        </div>
      </div>

      {/* PROFILE + BASIC */}
      <div className="flex flex-col lg:flex-row gap-6">
        <section className="lg:w-1/3">
          <ProfileCard
            name={me.name}
            id={me.id}
            gender={me.gender}
            age={me.age}
            role={me.role}
            profileImage={raw.profile_image}
            onImageUpdated={async () => {
              await refresh?.();
              const found = (filtered ?? []).find(
                (e: UIEmployee) => String(e.id) === String(currentUser?.id)
              );
              if (found) setMe(found as UIEmployee & { raw: APIEmployee });
            }}
          />
        </section>

        <section className="flex-1">
          <BasicInfo
  meName={me.name}
  meGender={me.gender}
  meAge={me.age}
  mePhone={me.phone ?? undefined}
  raw={raw}
/>

        </section>
      </div>

      {/* EDUCATION + WORK */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EducationSection raw={raw} />
        <WorkInfo
          raw={raw}
          jobTitles={jobTitleOptions}
          positionLevels={positionLevelOptions}
          positionTypes={positionTypeOptions}
          jobGroups={jobGroupOptions}
        />
      </div>

      {/* JOB HISTORY */}
      <JobHistorySection
        employeeId={me.id}
        employeeName={me.name}
        isAdmin={me.role === "admin" || me.role === "superadmin"}
        jobGroups={Object.entries(jobGroupOptions).map(([id, name]) => ({ id, name }))}
        positionTypes={Object.entries(positionTypeOptions).map(([id, name]) => ({ id, name }))}
        positionLevels={Object.entries(positionLevelOptions).map(([id, name]) => ({ id, name }))}
      />

      {/* CAPACITY SECTION */}
      <CapacitySection
        employeeId={me.id}
        employeeName={me.name}
        isAdmin={me.role === "admin" || me.role === "superadmin"}
      />

      {/* EDIT MODAL */}
      <EditProfileModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        me={me}
        currentUser={currentUser}
        jobTitles={Object.entries(jobTitleOptions).map(([id, name]) => ({ id, name }))}
        positionLevels={Object.entries(positionLevelOptions).map(([id, name]) => ({ id, name }))}
        positionTypes={Object.entries(positionTypeOptions).map(([id, name]) => ({ id, name }))}
        jobGroups={Object.entries(jobGroupOptions).map(([id, name]) => ({ id, name }))}
        educationLevelOptions={[
          "ประถมศึกษา",
          "ม.3",
          "ปวช",
          "ปวส",
          "ปริญญาตรี",
          "ปริญญาโท",
          "ปริญญาเอก",
        ]}
        onSaved={async () => {
  await refresh?.();
  const found = (filtered ?? []).find(
    (e: UIEmployee) => String(e.id) === String(currentUser?.id)
  );
  if (found) setMe(found as UIEmployee & { raw: APIEmployee });
}}

      />

      {/* CHANGE PASSWORD MODAL */}
      <ChangePasswordModal
        open={passwordOpen}
        onClose={() => setPasswordOpen(false)}
        userId={me.id}
      />
    </div>
  );
}
