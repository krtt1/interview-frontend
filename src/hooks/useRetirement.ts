"use client";

import { useMemo } from "react";
import { useEmployees } from "./useEmployees";

// อายุเกษียณ = 60 ปี
const RETIREMENT_AGE = 60;

export type RetirementYear = {
  year: number;
  buddhistYear: number;
  count: number;
  employees: Array<{
    id: string;
    name: string;
    age: number;
    jobTitle?: string;
    positionLevel?: string;
    positionType?: string;
    jobGroup?: string;
  }>;
};

export function useRetirement(yearsAhead = 10) {
  const { employees, jobTitles, positionLevels, positionTypes, jobGroups } = useEmployees();

  const retirementData = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const data: RetirementYear[] = [];

    // สร้าง array สำหรับ 10 ปีข้างหน้า
    for (let i = 0; i < yearsAhead; i++) {
      const targetYear = currentYear + i;
      const buddhistYear = targetYear + 543;
      
      data.push({
        year: targetYear,
        buddhistYear,
        count: 0,
        employees: [],
      });
    }

    // คำนวณว่าพนักงานแต่ละคนจะเกษียณปีไหน
    employees.forEach((emp) => {
      const age = emp.age;
      if (!age || age >= RETIREMENT_AGE) return; // ข้ามคนที่เกษียณแล้ว

      const yearsUntilRetirement = RETIREMENT_AGE - age;
      const retirementYear = currentYear + yearsUntilRetirement;

      // หาว่าอยู่ใน range ที่เราสนใจหรือไม่
      const yearIndex = retirementYear - currentYear;
      if (yearIndex >= 0 && yearIndex < yearsAhead) {
        // หา job title, position level, position type, และ job group
        const jobTitleId = emp.raw?.job_title_id;
        const positionLevelId = emp.raw?.position_level_id;
        const positionTypeId = emp.raw?.position_type_id;
        const jobGroupId = emp.raw?.job_group_id;

        // ✅ ใช้ job_title_id แทน id
        const jobTitle = jobTitles.find((jt) => jt.job_title_id === jobTitleId);
        const positionLevel = positionLevels.find((pl) => pl.position_level_id === positionLevelId);
        const positionType = positionTypes.find((pt) => pt.position_type_id === positionTypeId);
        const jobGroup = jobGroups.find((jg) => jg.job_group_id === jobGroupId);

        // ลองหาชื่อจากหลายฟิลด์
        const getJobTitleName = () => {
          if (!jobTitle) return undefined;
          return jobTitle.job_title_name || jobTitle.name_th || jobTitle.name || undefined;
        };

        const getPositionTypeName = () => {
          if (!positionType) return undefined;
          return positionType.position_type_name || 
                 positionType.name_th || 
                 positionType.name || 
                 undefined;
        };

        const getJobGroupName = () => {
          if (!jobGroup) return undefined;
          return jobGroup.job_group_name || 
                 jobGroup.name_th || 
                 jobGroup.name || 
                 undefined;
        };

        data[yearIndex].count++;
        data[yearIndex].employees.push({
          id: emp.id,
          name: emp.name,
          age: age,
          jobTitle: getJobTitleName(),
          positionLevel: positionLevel?.position_level_name || positionLevel?.name_th || undefined,
          positionType: getPositionTypeName(),
          jobGroup: getJobGroupName(),
        });
      }
    });

    return data;
  }, [employees, jobTitles, positionLevels, positionTypes, jobGroups, yearsAhead]);

  // สรุปตำแหน่ง (job_title) ที่จะเกษียญแต่ละปี
  const jobTitlesSummary = useMemo(() => {
    return retirementData.map((yearData) => {
      // นับจำนวนแต่ละตำแหน่ง
      const titleCounts: Record<string, number> = {};
      
      yearData.employees.forEach((emp) => {
        const title = emp.jobTitle || "ไม่ระบุ";
        titleCounts[title] = (titleCounts[title] || 0) + 1;
      });

      // แปลงเป็น array และเรียงตามจำนวน
      const titles = Object.entries(titleCounts)
        .map(([title, count]) => ({ title, count }))
        .sort((a, b) => b.count - a.count);

      return {
        year: yearData.year,
        buddhistYear: yearData.buddhistYear,
        titles,
        summary: titles.map((t) => `${t.title} (${t.count})`).join(", "),
      };
    });
  }, [retirementData]);

  return {
    retirementData,
    jobTitlesSummary,
  };
}
