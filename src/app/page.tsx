"use client";

import Image from "next/image";
import DashboardContent from "@/components/dashboard/DashboardContent";
import LoginButton from "@/components/auth/LoginButton";

export default function PublicHomePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* ================= Header (Public) ================= */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-3 bg-white shadow">
        {/* Logo + Title */}
        <div className="flex items-center gap-3">
          <Image
            src="/Logo.png"
            alt="Logo"
            width={40}
            height={40}
            priority
          />
          <div className="flex flex-col">
            <span className="font-bold text-lg text-gray-800 leading-tight">
              ระบบข้อมูลสารสนเทศบุคลากร สคร.1
            </span>
            <span className="text-xs text-gray-500">
              Human Resource Information System ODPC1
            </span>
          </div>
        </div>

        {/* Login / Dashboard Button */}
        <LoginButton />
      </header>

      {/* ================= Public Dashboard ================= */}
      <main className="max-w-[1440px] mx-auto">
        <DashboardContent />
      </main>
    </div>
  );
}
