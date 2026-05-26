"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Menu from "@/components/layout/Menu";
import Navbar from "@/components/layout/Navbar";
import Image from "next/image";
import Link from "next/link";

type Props = {
  children: React.ReactNode;
};

export default function AppShell({ children }: Props) {
  const pathname = usePathname();

  // หน้าที่ไม่อยากให้มี sidebar / navbar
  const AUTH_PATHS = ["/", "/login"];        // 👈 เพิ่ม "/" เข้ามาด้วย
  const isAuthPage = AUTH_PATHS.includes(pathname);

  if (isAuthPage) {
    // หน้า login style เต็มจอ ไม่มีเมนู
    return <main className="min-h-screen bg-[#F7F8FA]">{children}</main>;
  }

  return (
    <div className="h-screen flex bg-[#F7F8FA]">
      {/* LEFT MENU */}
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] bg-white p-4 shadow-sm">
        <Link
          href="/dashboard"
          className="flex items-center justify-center lg:justify-start gap-2 mb-6"
        >
          <Image src="/Logo.png" alt="logo" width={32} height={32} />
          <span className="hidden lg:block font-semibold text-sm">ระบบข้อมูลสารสนเทศบุคลากร สคร.1</span>
        </Link>
        <Menu />
      </div>

      {/* RIGHT CONTENT */}
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] overflow-y-auto">
        <Navbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
