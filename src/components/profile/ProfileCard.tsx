"use client";

import Image from "next/image";
import React, { useState, useRef } from "react";
import { API_FILE } from "@/lib/api";

type Props = {
  name: string;
  id: string;
  gender?: string | null;
  age?: number | null;
  role?: string | null;
  profileImage?: string | null;
  onImageUpdated?: () => void;
};

export default function ProfileCard({ 
  name, 
  id, 
  gender, 
  age, 
  role,
  profileImage,
  onImageUpdated 
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // สร้าง URL สำหรับแสดงรูป
  const getImageUrl = () => {
    if (!profileImage) return "/avatar.png";
    
    // ถ้า profileImage เป็น full URL แล้ว
    if (profileImage.startsWith('http://') || profileImage.startsWith('https://')) {
      return `${profileImage}?t=${Date.now()}`;
    }
    
    // ใช้ API URL ตรงๆ (ไม่เอา /api ออก)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3011';
    
    // แปลง backslash เป็น forward slash
    const normalizedPath = profileImage.replace(/\\/g, '/');
    
    // ถ้า path เริ่มด้วย / แล้ว
    const fullPath = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
    
    // เพิ่ม timestamp เพื่อ bypass cache
    return `${apiUrl}${fullPath}?t=${Date.now()}`;
  };

  const imageUrl = getImageUrl();

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ตรวจสอบประเภทไฟล์
    if (!file.type.startsWith('image/')) {
      setError('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
      return;
    }

    // ตรวจสอบขนาดไฟล์ (ไม่เกิน 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('ขนาดไฟล์ต้องไม่เกิน 5MB');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append('profile_image', file);

      await API_FILE.put(`/employees/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // เรียก callback เพื่อ refresh ข้อมูล
      if (onImageUpdated) {
        await onImageUpdated();
      }
      
      // Force reload หน้าเพื่อให้รูปอัพเดท
      window.location.reload();
      
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'อัพโหลดรูปภาพไม่สำเร็จ';
      setError(msg);
    } finally {
      setUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center gap-4">
      {/* รูปโปรไฟล์ */}
      <div className="relative group">
        <div className="w-32 h-32 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center border-4 border-white shadow-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={imageUrl} 
            alt="avatar" 
            className="object-cover w-full h-full"
            onError={(e) => {
              // ถ้าโหลดรูปไม่ได้ ให้ใช้รูป default
              e.currentTarget.src = '/avatar.png';
            }}
          />
        </div>
        
        {/* ปุ่มอัพโหลด - แสดงตอน hover */}
        <button
          onClick={handleImageClick}
          disabled={uploading}
          className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:cursor-not-allowed"
        >
          <div className="text-white text-center">
            {uploading ? (
              <div className="text-xs">กำลังอัพโหลด...</div>
            ) : (
              <>
                <div className="text-2xl mb-1">📷</div>
                <div className="text-xs">เปลี่ยนรูป</div>
              </>
            )}
          </div>
        </button>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* แสดง error */}
      {error && (
        <div className="text-xs text-red-600 bg-red-50 px-3 py-1 rounded">
          {error}
        </div>
      )}

      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-900">{name || "ไม่ทราบชื่อ"}</h2>
        <div className="mt-1 flex items-center justify-center gap-2 text-sm text-gray-500">
          <span>{gender || "ไม่ระบุเพศ"}</span>
          {age != null && (
            <>
              <span className="text-gray-300">•</span>
              <span>{age} ปี</span>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center gap-1 text-sm">
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs uppercase tracking-wide">
          {role === "superadmin" ? "SuperAdmin" : role === "admin" ? "Admin" : "User"}
        </span>
        <span className="text-xs text-gray-400">รหัสบัตรประชาชน: {id}</span>
      </div>
    </div>
  );
}
