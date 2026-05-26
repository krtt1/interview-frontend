// src/app/login/page.tsx
"use client";

import React from "react";
import LoginForm from "@/components/LoginForm";

export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold mb-1">เข้าสู่ระบบ</h1>
          <p className="text-sm font-medium text-gray-700">
            ระบบข้อมูลสารสนเทศบุคลากร สคร.1
          </p>
          <p className="text-xs text-gray-500">
            Human Resource Information System ODPC1
          </p>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          กรุณาใส่รหัสประชาชน / ID และรหัสผ่าน
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
