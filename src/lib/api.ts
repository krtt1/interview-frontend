import axios, { InternalAxiosRequestConfig } from "axios";

// =============================================================
// Base URL ของ backend
// Development: http://localhost:3011 (ไม่มี /api)
// Production: https://hrodpc1.ddc.moph.go.th/api (มี /api)
// =============================================================
const base = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3011"
).replace(/\/+$/, "");

// =============================================================
// Axios instance หลัก (JSON API)
// =============================================================
const API = axios.create({
  baseURL: base,
  headers: {
    "Content-Type": "application/json",
  },
  // สำคัญ: เปิดเพื่อให้ cookie/session ทำงานข้ามโดเมนได้
  withCredentials: true,
});

// =============================================================
// Axios instance สำหรับ FILE / UPLOAD / EXCEL
// =============================================================
export const API_FILE = axios.create({
  baseURL: base,
  withCredentials: true,
});

// =============================================================
// Request interceptor: แนบ Bearer token (ถ้ามี)
// รองรับ Axios v1 (ใช้ InternalAxiosRequestConfig)
// =============================================================
const attachToken = (config: InternalAxiosRequestConfig) => {
  // ป้องกัน error ตอน SSR
  if (typeof window === "undefined") return config;

  try {
    const token = localStorage.getItem("token");
    if (token) {
      // Axios v1: headers เป็น AxiosHeaders → ใช้ .set()
      config.headers.set("Authorization", `Bearer ${token}`);
    }
  } catch {
    /* ignore */
  }

  return config;
};

API.interceptors.request.use(attachToken);
API_FILE.interceptors.request.use(attachToken);

// =============================================================
// Response interceptor: ถ้าโดน 401 → logout ทั้งระบบ
// =============================================================
const handleUnauthorized = (error: any) => {
  if (error?.response?.status === 401) {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } catch {}

      // ล้าง Authorization header ที่เคย set ไว้
      delete API.defaults.headers.common["Authorization"];
      delete API_FILE.defaults.headers.common["Authorization"];

      // แจ้งทั้งแอปว่า auth หลุด
      window.dispatchEvent(new Event("auth:logout"));
    }
  }

  return Promise.reject(error);
};

API.interceptors.response.use((response) => response, handleUnauthorized);
API_FILE.interceptors.response.use((response) => response, handleUnauthorized);

// =============================================================
// ✅ default export (สำคัญมาก แก้ error ที่คุณเจอ)
// =============================================================
export default API;
