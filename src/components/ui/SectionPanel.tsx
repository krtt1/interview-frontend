// components/ui/SectionPanel.tsx
"use client";

import React, { ReactNode } from "react";

interface SectionPanelProps {
  title?: ReactNode;
  content?: ReactNode;
  children?: ReactNode;
  heightClass?: string;     
  paddingClass?: string;    
  hint?: ReactNode | null;  
  showHint?: boolean;       
  className?: string;
}

const SectionPanel: React.FC<SectionPanelProps> = ({
  title,
  content,
  children,
  heightClass = "min-h-[350px]",
  paddingClass = "p-6",
  hint = null,
  showHint = false,
  className = "",
}) => {
  return (
    <div className={`bg-white ${paddingClass} rounded-xl shadow-lg h-full ${heightClass} ${className}`}>
      {title && (
        <h2 className="text-xl font-semibold text-blue-800 mb-4 border-b pb-2">
          {title}
        </h2>
      )}

      <div className="text-gray-600">
        {content ?? children}
      </div>

      {showHint && hint ? (
        <p className="mt-4 text-sm text-gray-400 italic">
          {hint}
        </p>
      ) : null}
    </div>
  );
};

export default SectionPanel;
