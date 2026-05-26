"use client";

import API from "@/lib/api";
import { useEffect, useState } from "react";
import Link from "next/link";

type Meeting = {
  meeting_id: number;
  meeting_title: string;
  start_date: string;
  end_date: string;
  location?: string;
  meetingEmployees?: any[];
};

export default function MeetingTable() {
  const [data, setData] = useState<Meeting[]>([]);

  useEffect(() => {
    API.get("/meeting/getall").then(res => setData(res.data));
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b text-left">
            <th>ชื่อการอบรม</th>
            <th>วันที่เริ่ม</th>
            <th>วันที่สิ้นสุด</th>
            <th>สถานที่</th>
            <th>ผู้เข้าอบรม</th>
            <th>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.meeting_id} className="border-b">
              <td>{item.meeting_title}</td>
              <td>{item.start_date}</td>
              <td>{item.end_date}</td>
              <td>{item.location || "-"}</td>
              <td>{item.meetingEmployees?.length || 0}</td>
              <td>
                <Link
                  href={`/meeting/${item.meeting_id}`}
                  className="text-blue-600"
                >
                  ดูรายละเอียด
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}