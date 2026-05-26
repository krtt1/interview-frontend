import React from "react";

type Props = {
  label: string;
  value: React.ReactNode;
};

export default function Field({ label, value }: Props) {
  return (
    <div className="flex flex-col rounded-lg bg-gray-50 px-3 py-2">
      <span className="text-[11px] uppercase tracking-wide text-gray-400">
        {label}
      </span>
      <span className="mt-0.5 text-sm font-medium text-gray-900 break-words">
        {value === null || value === undefined || value === "" ? "—" : value}
      </span>
    </div>
  );
}
