// components/RetirementTableWidget.tsx

import React from 'react';

// ข้อมูลการเกษียณอ้างอิงจากไฟล์ PPT (ย่อให้สั้นลง)
const retirementData = [
    { year: 2568, total: 18, critical: "รอง ผอ., หน.LAB" },
    { year: 2569, total: 10, critical: "หน.ระบาดวิทยา" },
    { year: 2570, total: 15, critical: "จนท.บริหารงานทั่วไป" },
    { year: 2571, total: 7, critical: "-" },
];

const RetirementTableWidget = () => {
    return (
        <div className="p-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr>
                        <th className="px-3 py-2 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">ปีงบฯ</th>
                        <th className="px-3 py-2 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">รวม (คน)</th>
                        <th className="px-3 py-2 text-left text-xs font-bold text-red-600 uppercase tracking-wider">ตำแหน่งสำคัญที่เกษียณ</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                    {retirementData.map((item, index) => (
                        <tr key={item.year} className={`${index === 0 ? 'bg-yellow-50/70' : 'hover:bg-gray-50'}`}>
                            <td className="px-3 py-2 whitespace-nowrap text-sm font-bold text-gray-900">{item.year}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-center text-sm font-semibold text-gray-800">{item.total}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-red-700">{item.critical}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <p className="mt-3 text-xs text-gray-500">ข้อมูลนี้ช่วยในการวางแผนสรรหาบุคลากรทดแทน</p>
        </div>
    );
};

export default RetirementTableWidget;