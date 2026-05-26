"use client";

import React, { useState, useEffect, useCallback } from "react";
import API from "@/lib/api";

type SearchResult = {
  id: string;
  prefix_th?: string;
  first_name_th?: string;
  last_name_th?: string;
  job_title_name?: string;
  job_group_name?: string;
  jobTitle?: { job_title_name?: string; name?: string };
  jobGroup?: { job_group_name?: string; name?: string };
  positionLevel?: { position_level_name?: string; name?: string };
  positionType?: { position_type_name?: string; name?: string };
};

type JobGroup = {
  job_group_id: number;
  job_group_name: string;
};

type JobTitle = {
  job_title_id: number;
  job_title_name: string;
};

export default function EmployeeSearchWidget() {
  const [query, setQuery] = useState("");
  const [selectedJobGroupId, setSelectedJobGroupId] = useState<number | null>(null);
  const [jobGroups, setJobGroups] = useState<JobGroup[]>([]);
  const [jobTitles, setJobTitles] = useState<JobTitle[]>([]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showJobGroupMenu, setShowJobGroupMenu] = useState(false);

  // Load job groups and job titles on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobGroupsRes, jobTitlesRes] = await Promise.all([
          API.get("/jobgroup/getall"),
          API.get("/job-title/getall")
        ]);
        setJobGroups(jobGroupsRes.data || []);
        setJobTitles(jobTitlesRes.data || []);
      } catch (err) {
        console.error("Failed to load data:", err);
      }
    };
    fetchData();
  }, []);

  // Search function with job group filter
  const searchEmployees = useCallback(async (searchQuery: string, jobGroupId: number | null) => {
    if (!searchQuery.trim() && !jobGroupId) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setLoading(true);
    try {
      let response;
      
      if (jobGroupId) {
        // Use API and filter client-side
        response = await API.get("/employees/getall");
        
        let data = response.data || [];
        
        // Debug: log first employee data structure
        if (data.length > 0) {
          console.log('Employee data structure:', data[0]);
        }
        
        // Filter by job group
        data = data.filter((emp: any) => emp.job_group_id === jobGroupId);
        
        // If also has search query, filter by name
        if (searchQuery.trim()) {
          const lowerQuery = searchQuery.toLowerCase();
          data = data.filter((emp: SearchResult) => {
            const fullName = `${emp.prefix_th || ""} ${emp.first_name_th || ""} ${emp.last_name_th || ""}`.toLowerCase();
            return fullName.includes(lowerQuery);
          });
        }
        setResults(data);
        setShowResults(true);
      } else if (searchQuery.trim()) {
        response = await API.get("/employees/search", {
          params: { q: searchQuery.trim() }
        });
        
        const data = response.data || [];
        
        // Debug: log first search result data structure
        if (data.length > 0) {
          console.log('Search result data structure:', data[0]);
        }
        
        setResults(data);
        setShowResults(true);
      }
    } catch (err) {
      console.error("Search error:", err);
      setResults([]);
      setShowResults(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      searchEmployees(query, selectedJobGroupId);
    }, 300);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, selectedJobGroupId]);

  const handleClear = () => {
    setQuery("");
    setSelectedJobGroupId(null);
    setResults([]);
    setShowResults(false);
  };

  const selectedJobGroup = jobGroups.find(jg => jg.job_group_id === selectedJobGroupId);

  return (
    <div className="space-y-3">
      {/* Search Input with Job Group Button */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหาบุคลากร (ชื่อ, นามสกุล)..."
            onFocus={() => {
              if (results.length > 0) setShowResults(true);
            }}
          />
          
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Job Group Dropdown Button */}
        <div className="relative">
          <button
            onClick={() => setShowJobGroupMenu(!showJobGroupMenu)}
            className={`px-4 py-2.5 text-sm border rounded-lg transition-colors whitespace-nowrap max-w-[200px] overflow-hidden text-ellipsis ${
              selectedJobGroupId 
                ? 'bg-blue-50 border-blue-500 text-blue-700' 
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
            title={selectedJobGroup ? selectedJobGroup.job_group_name : 'เลือกกลุ่มงาน'}
          >
            {selectedJobGroup ? selectedJobGroup.job_group_name : 'กลุ่มงาน'} ▼
          </button>

          {/* Dropdown Menu */}
          {showJobGroupMenu && (
            <>
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto z-50">
                <button
                  key="all"
                  onClick={() => {
                    setSelectedJobGroupId(null);
                    setShowJobGroupMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 border-b"
                >
                  ทั้งหมด
                </button>
                {jobGroups.map((jg) => (
                  <button
                    key={jg.job_group_id}
                    onClick={() => {
                      setSelectedJobGroupId(jg.job_group_id);
                      setShowJobGroupMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                      selectedJobGroupId === jg.job_group_id ? 'bg-blue-50 text-blue-700' : ''
                    }`}
                  >
                    {jg.job_group_name}
                  </button>
                ))}
              </div>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowJobGroupMenu(false)}
              />
            </>
          )}
        </div>

        {/* Clear Button */}
        {(query || selectedJobGroupId) && (
          <button
            onClick={handleClear}
            className="px-3 py-2.5 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            title="ล้างทั้งหมด"
          >
            ✕
          </button>
        )}
      </div>

      {/* Results Section */}
      <div className="relative">
        {/* Results Dropdown */}
        {showResults && (
          <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
            {loading && (
              <div className="p-4 text-center text-gray-500 text-sm">
                กำลังค้นหา...
              </div>
            )}

            {!loading && results.length === 0 && (query || selectedJobGroup) && (
              <div className="p-4 text-center text-gray-500 text-sm">
                ไม่พบผลลัพธ์
              </div>
            )}

            {!loading && results.length > 0 && (
              <div className="divide-y divide-gray-100">
                {results.map((user: any) => {
                  const fullName = [
                    user.prefix_th,
                    user.first_name_th,
                    user.last_name_th
                  ].filter(Boolean).join(" ");

                  // Try multiple sources for job title
                  const jobTitle = 
                    user.job_title_name || 
                    user.jobTitle?.job_title_name || 
                    user.jobTitle?.name ||
                    (user.job_title_id && jobTitles.find(jt => jt.job_title_id === user.job_title_id)?.job_title_name) ||
                    "—";

                  // Try multiple sources for job group
                  const jobGroup = 
                    user.job_group_name || 
                    user.jobGroup?.job_group_name || 
                    user.jobGroup?.name ||
                    (user.job_group_id && jobGroups.find(jg => jg.job_group_id === user.job_group_id)?.job_group_name) ||
                    "—";

                  return (
                    <div
                      key={user.id}
                      className="p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => {
                        setShowResults(false);
                      }}
                    >
                      <div className="font-medium text-gray-900 text-sm">
                        {fullName || "ไม่ระบุชื่อ"}
                      </div>
                      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-600">
                        <span>
                          <span className="text-gray-400">ตำแหน่ง:</span>{" "}
                          {jobTitle}
                        </span>
                        <span>
                          <span className="text-gray-400">กลุ่มงาน:</span>{" "}
                          {jobGroup}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Backdrop to close dropdown */}
        {showResults && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowResults(false)}
          />
        )}
      </div>
    </div>
  );
}
