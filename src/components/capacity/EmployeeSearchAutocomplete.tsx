"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useEmployees } from "@/hooks/useEmployees";

type Props = {
  onSelect?: (employeeId: string) => void; // Optional callback for parent component
  redirectOnSelect?: boolean; // Control whether to redirect or just callback
};

export default function EmployeeSearchAutocomplete({ onSelect, redirectOnSelect = true }: Props) {
  const router = useRouter();
  const { employees, loading } = useEmployees();
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredEmployees, setFilteredEmployees] = useState<any[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter employees based on search term
  useEffect(() => {
    if (searchTerm.trim().length >= 2) {
      const filtered = employees.filter((emp) => {
        const raw = emp.raw;
        if (!raw) return false;
        
        const fullName = `${raw.prefix_th || ''}${raw.first_name_th || ''} ${raw.last_name_th || ''}`.toLowerCase();
        const searchLower = searchTerm.toLowerCase();
        return (
          emp.id?.includes(searchTerm) ||
          fullName.includes(searchLower) ||
          raw.first_name_th?.toLowerCase().includes(searchLower) ||
          raw.last_name_th?.toLowerCase().includes(searchLower)
        );
      });
      setFilteredEmployees(filtered.slice(0, 10));
      setShowDropdown(true);
    } else {
      setFilteredEmployees([]);
      setShowDropdown(false);
    }
  }, [searchTerm, employees]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectEmployee = (employeeId: string) => {
    setSearchTerm("");
    setShowDropdown(false);
    
    if (onSelect) {
      onSelect(employeeId);
    }
    
    if (redirectOnSelect) {
      router.push(`/capacity/${employeeId}`);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          placeholder="ค้นหาพนักงาน (ชื่อ หรือ เลขบัตรประชาชน)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => {
            if (filteredEmployees.length > 0) {
              setShowDropdown(true);
            }
          }}
          className="w-full px-4 py-2 border rounded-lg pr-10"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && filteredEmployees.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {filteredEmployees.map((employee) => {
            const raw = employee.raw;
            return (
              <button
                key={employee.id}
                type="button"
                onClick={() => handleSelectEmployee(employee.id)}
                className="w-full px-4 py-3 text-left hover:bg-gray-100 border-b last:border-b-0 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {employee.name}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      รหัส: {employee.id}
                    </div>
                    {raw?.job_group_id && (
                      <div className="text-xs text-gray-400 mt-1">
                        กลุ่มงาน ID: {raw.job_group_id}
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* No Results */}
      {showDropdown && searchTerm.length >= 2 && filteredEmployees.length === 0 && !loading && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg p-4 text-center text-gray-500">
          ไม่พบพนักงานที่ค้นหา
        </div>
      )}
    </div>
  );
}
