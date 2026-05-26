"use client";

import React, { useRef } from "react";
import { locationGroups } from "@/data/locationGroups";
import type { ChiangMaiMapRef } from "@/components/map/ChiangMaiMap";
import type { ComponentType } from "react";

interface LocationInfoPanelProps {
  MapComponent: ComponentType<any>;
}

const LocationInfoPanel: React.FC<LocationInfoPanelProps> = ({ MapComponent }) => {
  const mapRef = useRef<ChiangMaiMapRef | null>(null);

  return (
    <div className="p-4 md:p-6 h-full">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-full">
        {/* Map Section */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-4 flex flex-col h-full shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              ภาพรวมพื้นที่จังหวัดเชียงใหม่
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              แสดงที่ตั้งอาคารและพื้นที่ควบคุมโรค
            </p>
          </div>

          <div className="flex-1 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
            <MapComponent ref={mapRef} />
          </div>
        </div>

        {/* Location List Section */}
        <div className="lg:col-span-3 h-full overflow-y-auto pr-2">
          <div className="sticky top-0 bg-white z-10 pb-4 mb-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              รายการหน่วยงานและจุดควบคุมโรค
            </h2>
          </div>

          <div className="space-y-6">
            {locationGroups.map((group) => (
              <div key={group.key} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <h3 className="text-base font-semibold text-gray-800 mb-2">
                  {group.title}
                </h3>

                {group.description && (
                  <p className="text-sm text-gray-600 mb-3">
                    {group.description}
                  </p>
                )}

                <ul className="space-y-2">
                  {group.items.map((loc) => (
                    <li key={loc.id} className="flex items-start">
                      <span className="text-blue-600 mr-2 mt-1">•</span>
                      <button
                        onClick={() => mapRef.current?.flyTo(loc.lat, loc.lng)}
                        className="text-blue-600 hover:text-blue-800 hover:underline text-left transition-colors flex-1"
                      >
                        {loc.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-400 mt-6 text-center">
            ข้อมูลเพื่อการแสดงผลเชิงพื้นที่
          </p>
        </div>
      </div>
    </div>
  );
};

export default LocationInfoPanel;
