"use client";

import Link from "next/link";

type Command = {
  command_id: number;
  command_title: string;
  command_detail: string;
  date: string;
};

type Props = {
  data: Command[];
  isAdmin: boolean;
  onEdit: (c: Command) => void;
  onDelete: (id: number) => void;
};

const CommandTable: React.FC<Props> = ({
  data,
  isAdmin,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-y-1">
        {/* ================= TABLE HEAD ================= */}
        <thead className="border-b">
          <tr className="text-base font-semibold text-gray-700">
            <th className="px-4 py-3 text-left">ชื่อคำสั่ง</th>
            <th className="px-4 py-3 text-left">ประเภท</th>
            <th className="px-4 py-3 text-left">วันที่</th>
            <th className="px-4 py-3 text-center">จัดการ</th>
          </tr>
        </thead>

        {/* ================= TABLE BODY ================= */}
        <tbody className="divide-y divide-gray-100">
          {data.map((c) => (
            <tr
              key={c.command_id}
              className="bg-white hover:bg-gray-50"
            >
              {/* ชื่อคำสั่ง */}
              <td className="px-4 py-3 text-sm">
                {c.command_title}
              </td>

              {/* ประเภท */}
              <td className="px-4 py-3 text-sm">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  {c.command_detail}
                </span>
              </td>

              {/* วันที่ */}
              <td className="px-4 py-3 text-sm">
                {c.date}
              </td>

              {/* จัดการ */}
              <td className="px-4 py-3">
                <div className="flex justify-center gap-2">
                  <Link
                    href={`/command/${c.command_id}`}
                    className="h-9 px-4 flex items-center justify-center
                               rounded-md bg-blue-600 text-white
                               text-sm hover:bg-blue-700"
                  >
                    ดูรายละเอียด
                  </Link>

                  {isAdmin && (
                    <>
                      <button
                        onClick={() => onEdit(c)}
                        className="h-9 px-4 rounded-md
                                   bg-yellow-500 text-white
                                   text-sm hover:bg-yellow-600"
                      >
                        แก้ไข
                      </button>

                      <button
                        onClick={() => onDelete(c.command_id)}
                        className="h-9 px-4 rounded-md
                                   bg-red-600 text-white
                                   text-sm hover:bg-red-700"
                      >
                        ลบ
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}

          {/* ================= EMPTY STATE ================= */}
          {data.length === 0 && (
            <tr>
              <td
                colSpan={4}
                className="text-center py-8 text-gray-500"
              >
                ไม่พบข้อมูลคำสั่ง
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CommandTable;
