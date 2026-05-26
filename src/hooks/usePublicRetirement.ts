"use client";

import { useMemo } from "react";
import { usePublicEmployees } from "./usePublicEmployees";

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

export function usePublicRetirement(yearsAhead = 10) {
  const { employees, jobTitles, positionLevels, positionTypes, jobGroups } = usePublicEmployees();

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
    employees.forEach((emp: any) => {
      const age = emp.age;
      if (!age || age >= RETIREMENT_AGE) return;

      const yearsUntilRetirement = RETIREMENT_AGE - age;
      const retirementYear = currentYear + yearsUntilRetirement;

      const yearIndex = retirementYear - currentYear;
      if (yearIndex >= 0 && yearIndex < yearsAhead) {
        const jobTitleId = emp.job_title_id;
        const positionLevelId = emp.position_level_id;
        const positionTypeId = emp.position_type_id;
        const jobGroupId = emp.job_group_id;

        const jobTitle = jobTitles.find((jt: any) => jt.job_title_id === jobTitleId);
        const positionLevel = positionLevels.find((pl: any) => pl.position_level_id === positionLevelId);
        const positionType = positionTypes.find((pt: any) => pt.position_type_id === positionTypeId);
        const jobGroup = jobGroups.find((jg: any) => jg.job_group_id === jobGroupId);

        const name = `${emp.prefix_th || ""} ${emp.first_name_th || ""} ${emp.last_name_th || ""}`.trim();

        data[yearIndex].count++;
        data[yearIndex].employees.push({
          id: emp.id,
          name: name || emp.id,
          age: age,
          jobTitle: jobTitle?.job_title_name || jobTitle?.name_th || undefined,
          positionLevel: positionLevel?.position_level_name || positionLevel?.name_th || undefined,
          positionType: positionType?.position_type_name || positionType?.name_th || undefined,
          jobGroup: jobGroup?.job_group_name || jobGroup?.name_th || undefined,
        });
      }
    });

    return data;
  }, [employees, jobTitles, positionLevels, positionTypes, jobGroups, yearsAhead]);

  const jobTitlesSummary = useMemo(() => {
    return retirementData.map((yearData) => {
      const titleCounts: Record<string, number> = {};
      
      yearData.employees.forEach((emp) => {
        const title = emp.jobTitle || "ไม่ระบุ";
        titleCounts[title] = (titleCounts[title] || 0) + 1;
      });

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
