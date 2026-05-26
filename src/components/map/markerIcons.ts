import L, { IconOptions } from "leaflet";

/**
 * base options สำหรับ marker icon
 * ใช้ Partial เพราะ IconOptions บังคับต้องมี iconUrl
 * เราจะเติม iconUrl ตอน new L.Icon()
 */
const base: Partial<IconOptions> = {
  iconSize: [26, 42],
  iconAnchor: [13, 42],
  popupAnchor: [0, -36],
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
};

/**
 * แยกสี marker ตาม category
 */
export const markerIcons: Record<
  "office" | "border" | "support" | "vector",
  L.Icon
> = {
  office: new L.Icon({
    ...base,
    iconUrl:
      "https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png",
  }),

  border: new L.Icon({
    ...base,
    iconUrl:
      "https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png",
  }),

  support: new L.Icon({
    ...base,
    iconUrl:
      "https://maps.gstatic.com/mapfiles/ms2/micons/green-dot.png",
  }),

  vector: new L.Icon({
    ...base,
    iconUrl:
      "https://maps.gstatic.com/mapfiles/ms2/micons/yellow-dot.png",
  }),
};
