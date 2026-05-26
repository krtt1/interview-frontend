"use client";

import React, { useState } from "react";

interface OrgNode {
  title: string;
  children?: OrgNode[];
}

// mock data — รอ backend จริงค่อย map เข้าแทน
const organizationData: OrgNode = {
  title: "สำนักงานป้องกันควบคุมโรคที่ 1 (สคร.1)",
  children: [
    {
      title: "กลุ่มอำนวยการ",
      children: [
        { title: "งานบริหารทั่วไป" },
        { title: "งานยุทธศาสตร์และแผนงาน" },
      ],
    },
    {
      title: "กลุ่มควบคุมโรค",
      children: [
        { title: "งานวิชาการควบคุมโรค" },
        { title: "งานเฝ้าระวังโรค" },
      ],
    },
    {
      title: "กลุ่มพัฒนาบุคลากร",
      children: [
        { title: "งานพัฒนาศักยภาพบุคลากร" },
      ],
    },
  ],
};

const TreeNode = ({ node }: { node: OrgNode }) => {
  const [open, setOpen] = useState(true);

  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="ml-4">
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => hasChildren && setOpen(!open)}
      >
        {hasChildren && (
          <span className="text-gray-500 text-sm">
            {open ? "▼" : "►"}
          </span>
        )}

        <div className="inline-block bg-white border border-gray-300 shadow-sm px-3 py-2 rounded-md">
          <span className="font-medium text-gray-800">{node.title}</span>
        </div>
      </div>

      {hasChildren && open && (
        <div className="ml-6 mt-2 border-l border-gray-300 pl-4">
          {node.children!.map((child, idx) => (
            <TreeNode key={idx} node={child} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function OrganizationTree() {
  return (
    <div className="bg-white shadow-md rounded-xl p-6">
      <TreeNode node={organizationData} />
    </div>
  );
}
