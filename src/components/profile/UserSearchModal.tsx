"use client";

import React, { useState } from "react";
import API from "@/lib/api";

type SearchResult = {
  id: string;
  prefix_th?: string;
  first_name_th?: string;
  last_name_th?: string;
  job_title_name?: string;
  job_group_name?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function UserSearchModal({ open, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      setError("กรุณากรอกคำค้นหา");
      return;
    }

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const response = await API.get("/employees/search", {
        params: { q: query.trim() }
      });
      
      setResults(response.data || []);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "ค้นหาไม่สำเร็จ";
      setError(msg);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setQuery("");
    setResults([]);
    setError(null);
    setSearched(false);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />
      
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-800">ค้นหาบุคลากร</h2>
          <button onClick={handleClose} className="text-sm text-gray-500 hover:text-gray-700">
            ✕ ปิด
          </button>
        </div>

        <div className="p-6 space-y-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ค้นหาด้วยชื่อ, นามสกุล, หรือรหัสบัตรประชาชน..."
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium disabled:opacity-60"
            >
              {loading ? "กำลังค้นหา..." : "ค้นหา"}
            </button>
          </form>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
              {error}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {loading && (
            <div className="text-center py-8 text-gray-500">
              กำลังค้นหา...
            </div>
          )}

          {!loading && searched && results.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              ไม่พบผลลัพธ์
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="space-y-3">
              {results.map((user) => {
                const fullName = [
                  user.prefix_th,
                  user.first_name_th,
                  user.last_name_th
                ].filter(Boolean).join(" ");

                return (
                  <div
                    key={user.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {fullName || "ไม่ระบุชื่อ"}
                        </h3>
                        <div className="mt-1 space-y-1 text-sm text-gray-600">
                          <div>
                            <span className="text-gray-400">ตำแหน่ง:</span>{" "}
                            {user.job_title_name || "—"}
                          </div>
                          <div>
                            <span className="text-gray-400">กลุ่มงาน:</span>{" "}
                            {user.job_group_name || "—"}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">
                        รหัส: {user.id}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!loading && !searched && (
            <div className="text-center py-8 text-gray-400">
              กรอกคำค้นหาและกดปุ่มค้นหา
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
