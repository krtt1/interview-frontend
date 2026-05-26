"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const MAX_ID_LENGTH = 13;
const MAX_FAIL = 5;
const LOCK_TIME_MS = 5 * 60 * 1000; // 5 นาที

const LoginForm: React.FC = () => {
  const router = useRouter();
  const { login } = useAuth();

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [failCount, setFailCount] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);

  const isLocked =
    lockedUntil !== null && Date.now() < lockedUntil;

  // --------------------------------------------------
  // validate (❌ ปิด checksum แล้ว)
  // --------------------------------------------------
  const validate = () => {
    if (!id) {
      setError("กรุณากรอกรหัสประชาชน / ID");
      return false;
    }

    if (!/^\d+$/.test(id)) {
      setError("รหัสประชาชน / ID ต้องเป็นตัวเลขเท่านั้น");
      return false;
    }

    // ✅ ปิด checksum ชั่วคราว
    // if (id.length === 13 && !isValidThaiId(id)) {
    //   setError("เลขบัตรประชาชนไม่ถูกต้อง");
    //   return false;
    // }

    if (!password) {
      setError("กรุณากรอกรหัสผ่าน");
      return false;
    }

    return true;
  };

  // --------------------------------------------------
  // submit
  // --------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || isLocked) return;

    setError(null);
    if (!validate()) return;

    try {
      setLoading(true);
      await login(id, password);

      // reset เมื่อ login สำเร็จ
      setFailCount(0);
      setLockedUntil(null);

      router.replace("/dashboard");
    } catch {
      const nextFail = failCount + 1;
      setFailCount(nextFail);

      if (nextFail >= MAX_FAIL) {
        setLockedUntil(Date.now() + LOCK_TIME_MS);
        setError("พยายามเข้าสู่ระบบหลายครั้งเกินไป กรุณารอ 5 นาที");
      } else {
        setError("รหัสประชาชน / รหัสผ่านไม่ถูกต้อง");
      }
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // sanitize ID input
  // --------------------------------------------------
  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "");
    setId(digits.slice(0, MAX_ID_LENGTH));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          รหัสประชาชน / ID
        </label>
        <input
          type="text"
          inputMode="numeric"
          maxLength={MAX_ID_LENGTH}
          value={id}
          onChange={handleIdChange}
          disabled={isLocked}
          className="w-full border rounded px-3 py-2"
          placeholder="กรอกตัวเลข (ไม่เกิน 13 หลัก)"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          รหัสผ่าน
        </label>
        <input
          type="password"
          value={password}
          disabled={isLocked}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border rounded px-3 py-2">
          {error}
        </div>
      )}

      {isLocked && (
        <div className="text-xs text-gray-600">
          ระบบปิดการเข้าสู่ระบบชั่วคราว กรุณารอประมาณ 5 นาที
        </div>
      )}

      <button
        type="submit"
        disabled={loading || isLocked}
        className="w-full py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
      </button>
    </form>
  );
};

export default LoginForm;
