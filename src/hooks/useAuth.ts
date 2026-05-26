"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import API from "@/lib/api";

/* ================= TYPES ================= */

export type AuthUser = {
  id: string; // ✅ ใช้เป็น employee_id (13 หลัก)
  role: "superadmin" | "admin" | "user";
  name?: string | null;
};

type AuthState = {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
};

/* ================= HOOK ================= */

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    loading: true,
  });

  const initialized = useRef(false);

  /* --------------------------------------------------
   * logout
   * -------------------------------------------------- */
  const logout = useCallback(() => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch {}

    delete API.defaults.headers.common["Authorization"];

    setState({
      user: null,
      token: null,
      loading: false,
    });

    if (typeof window !== "undefined") {
      window.location.replace("/");
    }
  }, []);

  /* --------------------------------------------------
   * init auth
   * -------------------------------------------------- */
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    let token: string | null = null;
    let user: AuthUser | null = null;

    try {
      token = localStorage.getItem("token");
      const raw = localStorage.getItem("user");
      if (raw) user = JSON.parse(raw);
    } catch {}

    // ✅ id = employee_id
    if (!token || !user?.id) {
      setState({ user: null, token: null, loading: false });
      return;
    }

    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // validate user ด้วย id (13 หลัก)
    API.get(`/employees/${user.id}`)
      .then((res) => {
        setState({
          user: res.data,
          token,
          loading: false,
        });
      })
      .catch(() => {
        logout();
      });
  }, [logout]);

  /* --------------------------------------------------
   * login
   * -------------------------------------------------- */
  const login = async (id: string, password: string) => {
    // id = เลขพนักงาน 13 หลัก
    const res = await API.post("/employees/login", { id, password });

    const token = res.data?.token;
    let user = res.data?.user;

    // กรณีได้ token แต่ไม่ได้ user กลับมา (บาง backend ส่งแค่ token)
    if (token && (!user || !user.id)) {
      // Set header เพื่อยิง request ต่อไป
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      try {
        // Fetch user info manually
        const userRes = await API.get(`/employees/${id}`);
        user = userRes.data;
      } catch (err) {
        // ถ้า fetch user ไม่ได้ ให้ถือว่า login fail
        throw new Error("Cannot fetch user profile");
      }
    }

    // ✅ เช็ค id อย่างเดียว
    if (!token || !user?.id) {
      throw new Error("Invalid login response");
    }

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    setState({
      user,
      token,
      loading: false,
    });

    return user;
  };

  /* --------------------------------------------------
   * helpers
   * -------------------------------------------------- */
  const isLoggedIn = !!state.user && !!state.token;
  const isAdminLevel = state.user?.role !== "user";

  return {
    user: state.user,
    token: state.token,
    loading: state.loading,
    isLoggedIn,
    isAdminLevel,
    login,
    logout,
  };
}
