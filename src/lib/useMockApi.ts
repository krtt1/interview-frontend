// src/lib/useMockApi.ts
"use client";
import { useState } from "react";

type RecordBase = { id: string; created_at?: string; updated_at?: string; deleted_at?: string | null };

// initial mock data
const initialPersonnel = [
  { id: "p1", name: "สมชาย ใจดี", position: "เจ้าหน้าที่ธุรการ", department: "กองคลัง", phone: "081-234-5678" },
  { id: "p2", name: "อรพิน ขยันงาน", position: "นักวิชาการคอมพิวเตอร์", department: "กองยุทธศาสตร์", phone: "086-555-1234" },
];

const initialLeaves = [
  { id: "l1", employeeId: "p1", type: "annual", start: "2025-12-01", end: "2025-12-03", days: 3, status: "pending", reason: "เที่ยว" },
];

const initialTrainings = [
  { id: "t1", title: "Leadership", start: "2025-11-12", end: "2025-11-15", participants: 20 },
];

const initialEperf = [
  { id: "e1", employeeId: "p1", cycle: "2568", status: "draft", scores: [] },
];

export function useMockApi() {
  const [personnel, setPersonnel] = useState<any[]>(initialPersonnel);
  const [leaves, setLeaves] = useState<any[]>(initialLeaves);
  const [trainings, setTrainings] = useState<any[]>(initialTrainings);
  const [eperf, setEperf] = useState<any[]>(initialEperf);

  // helpers
  const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));
  const genId = (prefix = "") => `${prefix}${Math.random().toString(36).slice(2, 9)}`;

  return {
    // Personnel CRUD
    async listPersonnel() { await delay(); return personnel.filter(p => !p.deleted_at); },
    async getPersonnel(id: string) { await delay(); return personnel.find(p => p.id === id); },
    async createPersonnel(payload: any) { await delay(); const rec = { id: genId("p"), ...payload }; setPersonnel(s => [rec, ...s]); return rec; },
    async updatePersonnel(id: string, payload: any) { await delay(); setPersonnel(s => s.map(x => x.id === id ? { ...x, ...payload, updated_at: new Date().toISOString() } : x)); return { id, ...payload }; },
    async deletePersonnel(id: string) { await delay(); setPersonnel(s => s.map(x => x.id === id ? { ...x, deleted_at: new Date().toISOString() } : x)); return true; },

    // Leaves CRUD + approve
    async listLeaves() { await delay(); return leaves.filter(l => !l.deleted_at); },
    async createLeave(payload: any) { await delay(); const rec = { id: genId("l"), status: "pending", ...payload }; setLeaves(s => [rec, ...s]); return rec; },
    async updateLeave(id: string, payload: any) { await delay(); setLeaves(s => s.map(x => x.id === id ? { ...x, ...payload, updated_at: new Date().toISOString() } : x)); return { id, ...payload }; },
    async deleteLeave(id: string) { await delay(); setLeaves(s => s.map(x => x.id === id ? { ...x, deleted_at: new Date().toISOString() } : x)); return true; },
    async approveLeave(id: string, approverId?: string) { await delay(); setLeaves(s => s.map(x => x.id === id ? { ...x, status: "approved", approved_by: approverId, approved_at: new Date().toISOString() } : x)); return true; },

    // Trainings
    async listTrainings() { await delay(); return trainings.filter(t => !t.deleted_at); },
    async createTraining(payload: any) { await delay(); const rec = { id: genId("t"), ...payload }; setTrainings(s=>[rec,...s]); return rec; },
    async updateTraining(id: string, payload: any) { await delay(); setTrainings(s => s.map(x => x.id === id ? { ...x, ...payload, updated_at: new Date().toISOString() } : x)); return true; },
    async deleteTraining(id: string) { await delay(); setTrainings(s => s.map(x => x.id === id ? { ...x, deleted_at: new Date().toISOString() } : x)); return true; },

    // E-Perf (simple)
    async listEperf() { await delay(); return eperf.filter(e=>!e.deleted_at); },
    async createEperf(payload:any) { await delay(); const rec = { id: genId("e"), status: "draft", ...payload }; setEperf(s=>[rec,...s]); return rec; },
    async submitEperf(id:string) { await delay(); setEperf(s=>s.map(x=>x.id===id?{...x, status:"submitted", submitted_at: new Date().toISOString()}:x)); return true; },
    async reviewEperf(id:string, decision:"approved"|"rejected") { await delay(); setEperf(s=>s.map(x=>x.id===id?{...x, status: decision, reviewed_at: new Date().toISOString()}:x)); return true; },
  };
}
