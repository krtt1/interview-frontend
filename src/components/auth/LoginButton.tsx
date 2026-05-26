"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";

type Props = {
  size?: "sm" | "md";
};

export default function LoginButton({ size = "md" }: Props) {
  const { isLoggedIn, loading } = useAuth();

  if (loading) return null;

  const baseClass =
    size === "sm"
      ? "px-3 py-1.5 text-sm"
      : "px-4 py-2 text-base";

  // ✅ แค่แสดงปุ่ม ไม่ตัดสินใจ redirect
  return isLoggedIn ? (
    <Link
      href="/dashboard"
      className={`flex items-center gap-2 rounded-md bg-green-600 text-white
                  hover:bg-green-700 transition font-medium ${baseClass}`}
    >
      <Image src="/home.png" alt="" width={16} height={16} />
      ไปหน้า Dashboard
    </Link>
  ) : (
    <Link
      href="/login"
      className={`flex items-center gap-2 rounded-md bg-blue-600 text-white
                  hover:bg-blue-700 transition font-medium ${baseClass}`}
    >
      <Image src="/logout.png" alt="" width={16} height={16} />
      เข้าสู่ระบบ
    </Link>
  );
}
