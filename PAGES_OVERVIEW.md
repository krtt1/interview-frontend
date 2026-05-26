# สรุปหน้าทั้งหมดในระบบ HR ODPC1

เอกสารนี้อธิบายหน้าทั้งหมดในระบบและการใช้งาน

---

## 📁 โครงสร้างหน้า

```
src/app/
├── login/                        # หน้า Login
├── (dashboard)/                  # Layout สำหรับหน้าที่ต้อง Login
│   ├── dashboard/               # หน้า Dashboard หลัก
│   ├── employee/                # จัดการพนักงาน
│   ├── profile/                 # โปรไฟล์ส่วนตัว
│   ├── organization/            # โครงสร้างองค์กร
│   ├── job-history/             # ประวัติการทำงาน
│   ├── capacity/                # สมรรถนะ
│   │   └── [id]/               # รายละเอียดสมรรถนะ
│   ├── command/                 # คำสั่ง
│   │   └── [id]/               # รายละเอียดคำสั่ง
│   ├── meeting/                 # การประชุม
│   │   └── [id]/               # รายละเอียดการประชุม
│   ├── leave-ot/                # ลา/OT
│   └── settings/                # ตั้งค่า
```

---

## 1. 🔐 Login Page (`/login`)

### วัตถุประสงค์
หน้าเข้าสู่ระบบ

### Features
- Login ด้วยรหัสบัตรประชาชน 13 หลัก
- Login ด้วยรหัสพนักงาน (ถ้ามี)
- แสดง error message เมื่อ login ไม่สำเร็จ
- Redirect ไป `/dashboard` เมื่อ login สำเร็จ

### Components
- `LoginForm.tsx` - ฟอร์ม login
- `LoginButton.tsx` - ปุ่ม login

### Hooks
- `useAuth` - จัดการ login

### API
- `POST /auth