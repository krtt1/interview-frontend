// components/settings/SecuritySection.tsx
"use client";

import React, { useEffect, useState } from "react";

/**
 * Expectations for backend endpoints:
 * GET  /api/roles                  -> { data: [{ id, name, display_name, permissions: [] }, ...] }
 * GET  /api/me/permissions         -> { data: { user_id, roles: [], permissions: [] } }
 * GET  /api/users?query=...        -> user search (for assign user)
 * PUT  /api/users/:id/roles        -> body { roles: ["hr","manager"] } -> returns updated roles
 * PUT  /api/settings               -> save section payload
 */

type Role = { id: string; name: string; display_name?: string; permissions?: string[] };
type UserMin = { id: string; display_name: string; email?: string };

function apiGet(path: string) {
  return fetch(path, { credentials: "same-origin" }).then((r) => {
    if (!r.ok) throw new Error(r.statusText);
    return r.json();
  });
}
function apiPut(path: string, body: any) {
  return fetch(path, {
    method: "PUT",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).then((r) => {
    if (!r.ok) return r.text().then((t) => { throw new Error(t || r.statusText); });
    return r.json();
  });
}

export default function SecuritySection({ canEdit = true }: { canEdit?: boolean }) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [userSearchResults, setUserSearchResults] = useState<UserMin[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserMin | null>(null);
  const [selectedUserRoles, setSelectedUserRoles] = useState<string[]>([]);
  const [savingUserRoles, setSavingUserRoles] = useState(false);

  // settings fields (security)
  const [sessionTimeout, setSessionTimeout] = useState<number>(60);
  const [passwordMinLen, setPasswordMinLen] = useState<number>(8);
  const [enforce2FA, setEnforce2FA] = useState<boolean>(false);

  // load roles + me perms
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const rr = await apiGet("/api/roles").catch(() => ({ data: [] }));
        if (!mounted) return;
        setRoles(rr?.data ?? []);
      } catch (e) {
        console.error("load roles", e);
      } finally {
        if (mounted) setLoadingRoles(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // user search (simple)
  useEffect(() => {
    let ignore = false;
    if (!searchQuery) { setUserSearchResults([]); return; }
    const t = setTimeout(async () => {
      try {
        const res = await apiGet(`/api/users?query=${encodeURIComponent(searchQuery)}`).catch(() => ({ data: [] }));
        if (!ignore) setUserSearchResults(res?.data ?? []);
      } catch (e) {
        console.error(e);
      }
    }, 300);
    return () => { ignore = true; clearTimeout(t); };
  }, [searchQuery]);

  // select user -> load their roles
  async function handleSelectUser(u: UserMin) {
    setSelectedUser(u);
    try {
      const res = await apiGet(`/api/users/${u.id}/roles`).catch(() => ({ data: { roles: [] } }));
      setSelectedUserRoles(res?.data?.roles ?? []);
    } catch (e) {
      console.error("get user roles", e);
      setSelectedUserRoles([]);
    }
  }

  async function saveUserRoles() {
    if (!selectedUser) return;
    setSavingUserRoles(true);
    try {
      await apiPut(`/api/users/${selectedUser.id}/roles`, { roles: selectedUserRoles });
      alert("Assign roles updated (mock)");
    } catch (e: any) {
      alert("Save failed: " + (e.message || e));
    } finally {
      setSavingUserRoles(false);
    }
  }

  async function saveSecuritySettings() {
    // basic validation
    if (sessionTimeout < 1) { alert("Session timeout ต้อง >= 1"); return; }
    if (passwordMinLen < 6) { alert("Password min length ควร >= 6"); return; }
    try {
      await apiPut("/api/settings", {
        section: "security",
        payload: {
          session_timeout_minutes: sessionTimeout,
          password_min_length: passwordMinLen,
          two_factor_enforced_for_admins: enforce2FA,
        },
      });
      alert("Security settings saved (mock)");
    } catch (e: any) {
      alert("Save failed: " + (e.message || e));
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-red-500">
      <h2 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">ความปลอดภัยและการเข้าถึง</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ระยะเวลาหมดอายุของเซสชั่น (นาที)</label>
          <input type="number" min={1} value={sessionTimeout} onChange={(e) => setSessionTimeout(Number(e.target.value || 0))} className="w-full p-2 border rounded" disabled={!canEdit} />
          <p className="text-xs text-gray-500 mt-1">ผู้ใช้จะถูก logout หลัง inactivity ตามเวลานี้</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password min length</label>
          <input type="number" min={6} value={passwordMinLen} onChange={(e) => setPasswordMinLen(Number(e.target.value || 0))} className="w-full p-2 border rounded" disabled={!canEdit} />
          <div className="flex items-center gap-2 mt-2">
            <input type="checkbox" checked={enforce2FA} onChange={(e) => setEnforce2FA(e.target.checked)} disabled={!canEdit} />
            <span className="text-sm text-gray-600">บังคับ 2FA สำหรับผู้ดูแลระบบ</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mb-4">
        <button onClick={saveSecuritySettings} disabled={!canEdit} className={`px-4 py-2 rounded ${canEdit ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"}`}>บันทึก (Security)</button>
      </div>

      <hr className="my-4" />

      <h3 className="text-lg font-semibold mb-2">จัดการ Roles (Quick preview)</h3>
      <p className="text-sm text-gray-500 mb-3">Roles ที่มี (จากระบบ) — คลิกเพื่อดู permissions</p>

      <div className="flex gap-4">
        <div className="w-1/2">
          <div className="bg-gray-50 p-3 rounded border">
            {loadingRoles ? <div>Loading roles...</div> : roles.length === 0 ? <div className="text-sm text-gray-500">No roles</div> : (
              <ul className="space-y-2">
                {roles.map((r) => (
                  <li key={r.id} className="p-2 border rounded hover:bg-white cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{r.display_name ?? r.name}</div>
                        <div className="text-xs text-gray-500">{r.name}</div>
                      </div>
                      <div className="text-xs text-gray-400">{(r.permissions || []).length} perm</div>
                    </div>
                    <div className="mt-2 text-xs text-gray-600">Perms: {(r.permissions || []).slice(0,5).join(", ")}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="w-1/2">
          <h4 className="font-medium">Assign role to user</h4>
          <div className="mt-2">
            <input className="w-full p-2 border rounded" placeholder="ค้นหาผู้ใช้ (พิมพ์ชื่อ/อีเมล)" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <div className="mt-2 max-h-40 overflow-auto border rounded p-2 bg-white">
              {userSearchResults.length === 0 ? <div className="text-xs text-gray-500">พิมพ์ค้นหาเพื่อหา user</div> : (
                userSearchResults.map(u => (
                  <div key={u.id} className="p-2 rounded hover:bg-gray-50 cursor-pointer" onClick={() => handleSelectUser(u)}>
                    <div className="text-sm font-medium">{u.display_name}</div>
                    <div className="text-xs text-gray-400">{u.email}</div>
                  </div>
                ))
              )}
            </div>

            {selectedUser && (
              <div className="mt-4 p-3 border rounded bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{selectedUser.display_name}</div>
                    <div className="text-xs text-gray-500">{selectedUser.email}</div>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-2">
                  {roles.map(r => (
                    <label key={r.id} className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedUserRoles.includes(r.name)}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setSelectedUserRoles(prev => checked ? [...prev, r.name] : prev.filter(x => x !== r.name));
                        }} />
                      <span className="text-sm">{r.display_name ?? r.name}</span>
                    </label>
                  ))}
                </div>

                <div className="flex justify-end gap-2 mt-3">
                  <button onClick={() => { setSelectedUser(null); setSelectedUserRoles([]); }} className="px-3 py-1 border rounded">ยกเลิก</button>
                  <button onClick={saveUserRoles} disabled={savingUserRoles} className={`px-3 py-1 rounded ${savingUserRoles ? "bg-gray-300" : "bg-green-600 text-white"}`}>{savingUserRoles ? "บันทึก..." : "บันทึก roles"}</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
