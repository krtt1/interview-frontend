"use client";
import React from "react";

interface InfoCardProps {
  title: string;
  value?: string | number;
  subText?: string;
  color?: string;
  loading?: boolean;
  unit?: string;
  onClick?: () => void;
}

const InfoCard: React.FC<InfoCardProps> = ({
  title,
  value,
  subText,
  color = "border-blue-500",
  loading = false,
  unit,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      className={`
        p-5 bg-white rounded-xl shadow-lg border-l-4 ${color}
        ${onClick ? "cursor-pointer hover:bg-gray-50 hover:scale-[1.02]" : ""}
        transition
      `}
    >
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
        {title}
      </h3>

      <p className="mt-2 text-2xl font-bold text-gray-800">
        {loading
          ? "กำลังโหลด..."
          : `${value ?? "—"}${unit ? ` ${unit}` : ""}`}
      </p>

      {subText && (
        <p className="mt-1 text-sm text-yellow-600 font-medium">
          {subText}
        </p>
      )}
    </div>
  );
};

export default InfoCard;
