"use client";

import dynamic from "next/dynamic";
import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { Map as LeafletMap } from "leaflet";

import { locationGroups } from "@/data/locationGroups";
import { markerIcons } from "@/components/map/markerIcons";

// Fix icon paths for Next.js
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl.src,
  iconUrl: iconUrl.src,
  shadowUrl: shadowUrl.src,
});

// Patch Leaflet strict-mode issue (Next.js)
const originalInitContainer = (L.Map as any).prototype._initContainer;
(L.Map as any).prototype._initContainer = function (id: any) {
  const container = L.DomUtil.get(id) as any;
  if (container && container._leaflet_id) {
    container._leaflet_id = undefined;
  }
  return originalInitContainer.call(this, id);
};

// Exposed ref methods
export type ChiangMaiMapRef = {
  flyTo: (lat: number, lng: number, zoom?: number) => void;
};

// Component type for typing in Dashboard / LocationInfoPanel
export type ChiangMaiMapComponent =
  React.ForwardRefExoticComponent<React.RefAttributes<ChiangMaiMapRef>>;

// ================= Component =================
const ChiangMaiMap = forwardRef<ChiangMaiMapRef, {}>(function ChiangMaiMap(
  _,
  ref
) {
  const mapRef = useRef<LeafletMap | null>(null);
  const center: [number, number] = [18.7833, 98.9853];

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    flyTo(lat: number, lng: number, zoom = 11) {
      mapRef.current?.flyTo([lat, lng], zoom, {
        animate: true,
        duration: 1,
      });
    },
  }));

  return (
    <MapContainer
  center={center}
  zoom={7}
  scrollWheelZoom={false}
  style={{ height: "100%", width: "100%" }}
  ref={mapRef}
>

      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {locationGroups.flatMap((group) =>
        group.items.map((loc) => (
          <Marker
            key={loc.id}
            position={[loc.lat, loc.lng]}
            icon={markerIcons[group.category]}
          >
            <Popup>
              <div className="space-y-1">
                <p className="font-semibold">{loc.name}</p>
                <p className="text-xs text-gray-500">{group.title}</p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-sm"
                >
                  เปิดใน Google Maps
                </a>
              </div>
            </Popup>
          </Marker>
        ))
      )}
    </MapContainer>
  );
});

// ================= Dynamic export (no SSR) =================
const ChiangMaiMapDynamic = dynamic(() => Promise.resolve(ChiangMaiMap), {
  ssr: false,
});

ChiangMaiMapDynamic.displayName = "ChiangMaiMap";

export default ChiangMaiMapDynamic;
