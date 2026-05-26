"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import type { APIEmployee } from "@/hooks/useEmployees";
import Link from "next/link";

type UserState = {
  id?: string;
  role?: string;
  name?: string;
  profileImage?: string | null;
};

const Navbar = () => {
  const [user, setUser] = useState<UserState | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem("user");
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored) as { id?: string; role?: string };
      if (!parsed.id) {
        setUser({ 
          id: undefined, 
          role: parsed.role ?? "user", 
          name: "ผู้ใช้งาน",
          profileImage: null
        });
        return;
      }

      const baseUser: UserState = {
        id: parsed.id,
        role: parsed.role ?? "user",
      };

      // ดึงข้อมูลพนักงานจาก API
      API.get<APIEmployee>(`/employees/${parsed.id}`)
        .then((res) => {
          const emp = res.data;
          const fullName = `${emp.prefix_th ?? ""} ${emp.first_name_th ?? ""} ${
            emp.last_name_th ?? ""
          }`
            .replace(/\s+/g, " ")
            .trim();

          setUser({
            id: emp.id,
            role: emp.role ?? baseUser.role ?? "user",
            name: fullName || emp.id || "ผู้ใช้งาน",
            profileImage: emp.profile_image || null,
          });
        })
        .catch((err) => {
          console.error("Navbar: fetch employee error", err);
          // ถ้าดึงไม่ได้ ใช้ข้อมูลพื้นฐานจาก token แทน
          setUser({
            ...baseUser,
            name: baseUser.id ?? "ผู้ใช้งาน",
            profileImage: null,
          });
        });
    } catch (e) {
      console.error("Navbar: parse user error", e);
      setUser({ name: "ผู้ใช้งาน", role: "user", profileImage: null });
    }
  }, []);

  const displayName = user?.name || "ผู้ใช้งาน";
  const displayRole =
    user?.role === "superadmin"
      ? "ผู้ดูแลระบบ"
      : user?.role === "admin"
      ? "Admin"
      : "User";

  // สร้าง URL สำหรับรูป profile
  const getImageUrl = () => {
    if (!user?.profileImage) return "/avatar.png";
    
    // ถ้าเป็น full URL แล้ว
    if (user.profileImage.startsWith('http://') || user.profileImage.startsWith('https://')) {
      return user.profileImage;
    }
    
    // ใช้ API URL ตรงๆ (ไม่เอา /api ออก)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3011';
    
    // แปลง backslash เป็น forward slash
    const normalizedPath = user.profileImage.replace(/\\/g, '/');
    
    // ถ้า path เริ่มด้วย / แล้ว
    const fullPath = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
    
    return `${apiUrl}${fullPath}`;
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white shadow-sm">
      <div className="flex items-center gap-3 justify-end w-full">
        <Link href="/profile" className="flex items-center gap-3 cursor-pointer">
          <div className="flex flex-col text-right">
            <span className="text-xs leading-3 font-medium">{displayName}</span>
            <span className="text-[10px] text-gray-500">{displayRole}</span>
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getImageUrl()}
            alt="Avatar"
            className="w-9 h-9 rounded-full object-cover"
            onError={(e) => {
              // ถ้าโหลดรูปไม่ได้ ให้ใช้รูป default
              e.currentTarget.src = '/avatar.png';
            }}
          />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
