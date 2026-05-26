# คู่มือ Custom Hooks - ระบบ HR ODPC1

เอกสารนี้อธิบายการใช้งาน Custom Hooks ทั้งหมดในโปรเจค เพื่อใช้ในการส่งมอบงาน

---

## 📁 โครงสร้าง Hooks

```
src/hooks/
├── useAuth.ts                    # จัดการ Authentication
├── useCapacity.ts                # จัดการข้อมูลสมรรถนะ
├── useDashboard.ts               # จัดการข้อมูล Dashboard
├── useEmployees.ts               # จัดการข้อมูลพนักงาน (Admin)
├── useEmployeeSummary.ts         # สรุปข้อมูลพนักงาน
├── useJobHistory.ts              # จัดการประวัติการทำงาน
├── usePublicEmployees.ts         # ข้อมูลพนักงานสำหรับ User ทั่วไป
└── useRetirement.ts              # จัดการข้อมูลเกษียณอายุ
```

---

## 1. useAuth.ts

### วัตถุประสงค์
จัดการ Authentication, Login, Logout และข้อมูล User ที่ล็อกอินอยู่

### API Endpoints
- `POST /auth/login` - เข้าสู่ระบบ
- `POST /auth/logout` - ออกจากระบบ
- `GET /auth/me` - ดึงข้อมูล User ปัจจุบัน

### Return Values
```typescript
{
  user: User | null,           // ข้อมูล User ที่ล็อกอิน
  loading: boolean,            // สถานะกำลังโหลด
  login: (id, password) => Promise<void>,
  logout: () => Promise<void>
}
```

### User Object
```typescript
{
  id: string,                  // รหัสบัตรประชาชน
  role: 'user' | 'admin' | 'superadmin',
  prefix_th: string,
  first_name_th: string,
  last_name_th: string,
  email?: string,
  // ... ข้อมูลอื่นๆ
}
```

### ใช้ในหน้า
- ทุกหน้าที่ต้องเช็ค role (Dashboard, Employee, Command, Meeting, etc.)
- Login page
- Layout components

### ตัวอย่างการใช้งาน
```typescript
const { user, loading, login, logout } = useAuth();

// เช็ค role
const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

// Login
await login('1234567890123', 'password');

// Logout
await logout();
```

---

## 2. useCapacity.ts

### วัตถุประสงค์
จัดการข้อมูลสมรรถนะของพนักงาน (ทักษะ, ความสามารถ)

### API Endpoints
- `GET /capacity/getall?page=1&limit=10` - ดึงข้อมูลทั้งหมด (Admin)
- `GET /capacity/employee/:id` - ดึงข้อมูลตาม employee_id
- `POST /capacity/create` - สร้างข้อมูลสมรรถนะ
- `PUT /capacity/:id` - แก้ไขข้อมูลสมรรถนะ
- `DELETE /capacity/:id` - ลบข้อมูลสมรรถนะ
- `GET /capacity/export-excel` - Export Excel
- `POST /capacity/import-excel` - Import Excel

### Return Values
```typescript
{
  data: Capacity[],
  loading: boolean,
  error: string | null,
  pagination: {
    page: number,
    limit: number,
    total: number,
    totalPages: number
  },
  fetchCapacities: (page?) => Promise<void>,
  createCapacity: (data) => Promise<void>,
  updateCapacity: (id, data) => Promise<void>,
  deleteCapacity: (id) => Promise<void>,
  exportExcel: () => Promise<void>,
  importExcel: (file) => Promise<void>
}
```

### ใช้ในหน้า
- `/capacity` - หน้าจัดการสมรรถนะ (Admin)
- `/capacity/[id]` - หน้ารายละเอียดสมรรถนะ
- `/profile` - แสดงสมรรถนะของตัวเอง (ใน CapacitySection)

### ฟิลด์สำคัญ
- ทักษะพื้นฐาน: การใช้คอมพิวเตอร์, ภาษาอังกฤษ, ปฐมพยาบาล
- ทักษะระบาดวิทยา: การสอบสวน, การวิเคราะห์ข้อมูล
- ทักษะการเก็บตัวอย่าง: น้ำ, อาหาร, แมลง
- ทักษะ PPE: ชุด PPE ระดับต่างๆ
- Competency: งานวัคซีน, งานโรคติดต่อ, งานด่าน

---

## 3. useDashboard.ts

### วัตถุประสงค์
จัดการข้อมูลสำหรับหน้า Dashboard (สถิติ, กราฟ, ตาราง)

### API Endpoints
- `GET /dashboard/summary` - สรุปข้อมูลภาพรวม
- `GET /dashboard/charts` - ข้อมูลสำหรับกราฟ
- `GET /dashboard/retirement` - รายชื่อผู้ใกล้เกษียณ

### Return Values
```typescript
{
  summary: {
    totalEmployees: number,
    totalMale: number,
    totalFemale: number,
    avgAge: number,
    retiringSoon: number
  },
  charts: {
    genderChart: ChartData,
    educationChart: ChartData,
    performanceChart: ChartData
  },
  retirementList: Employee[],
  loading: boolean,
  fetchDashboard: () => Promise<void>
}
```

### ใช้ในหน้า
- `/dashboard` - หน้า Dashboard หลัก

### Components ที่เกี่ยวข้อง
- `DashboardContent.tsx` - แสดงสถิติและกราฟ
- `RetirementTable.tsx` - ตารางผู้ใกล้เกษียณ (Admin)
- `PublicRetirementTable.tsx` - ตารางผู้ใกล้เกษียณ (User)
- `EmployeeSearchWidget.tsx` - ค้นหาพนักงาน

---

## 4. useEmployees.ts

### วัตถุประสงค์
จัดการข้อมูลพนักงานทั้งหมด (สำหรับ Admin)

### API Endpoints
- `GET /employees/getall?page=1&limit=10` - ดึงข้อมูลทั้งหมด
- `GET /employees/search?q=keyword` - ค้นหาพนักงาน
- `GET /employees/:id` - ดึงข้อมูลตาม ID
- `POST /employees/create` - สร้างพนักงานใหม่
- `PUT /employees/:id` - แก้ไขข้อมูลพนักงาน
- `DELETE /employees/:id` - ลบพนักงาน

### Return Values
```typescript
{
  employees: Employee[],
  loading: boolean,
  error: string | null,
  pagination: PaginationData,
  fetchEmployees: (page?) => Promise<void>,
  searchEmployees: (keyword) => Promise<Employee[]>,
  createEmployee: (data) => Promise<void>,
  updateEmployee: (id, data) => Promise<void>,
  deleteEmployee: (id) => Promise<void>
}
```

### ใช้ในหน้า
- `/employee` - หน้าจัดการพนักงาน (Admin)

### Components ที่เกี่ยวข้อง
- `EmployeeCard.tsx` - แสดงการ์ดพนักงาน
- `EmployeeDetailModal.tsx` - แสดงรายละเอียดพนักงาน
- `EmployeeFormModal.tsx` - ฟอร์มสร้าง/แก้ไขพนักงาน

---

## 5. useEmployeeSummary.ts

### วัตถุประสงค์
สรุปข้อมูลพนักงานสำหรับแสดงในหน้าต่างๆ

### API Endpoints
- `GET /employees/summary` - สรุปข้อมูลพนักงาน

### Return Values
```typescript
{
  summary: {
    total: number,
    byGender: { male: number, female: number },
    byEducation: { bachelor: number, master: number, phd: number },
    byPosition: { [key: string]: number }
  },
  loading: boolean
}
```

### ใช้ในหน้า
- `/dashboard` - แสดงสถิติ
- `/organization` - แสดงจำนวนคนในแต่ละหน่วยงาน

---

## 6. useJobHistory.ts

### วัตถุประสงค์
จัดการประวัติการทำงานของพนักงาน (เปลี่ยนตำแหน่ง, เลื่อนขั้น)

### API Endpoints
- `GET /job-history/getall?page=1&limit=10` - ดึงข้อมูลทั้งหมด (Admin)
- `GET /job-history/employee/:id` - ดึงประวัติตาม employee_id
- `POST /job-history/create` - สร้างประวัติใหม่
- `PUT /job-history/:id` - แก้ไขประวัติ
- `DELETE /job-history/:id` - ลบประวัติ

### Return Values
```typescript
{
  jobHistory: JobHistory[],
  loading: boolean,
  pagination: PaginationData,
  fetchJobHistory: (page?) => Promise<void>,
  createJobHistory: (data) => Promise<void>,
  updateJobHistory: (id, data) => Promise<void>,
  deleteJobHistory: (id) => Promise<void>
}
```

### JobHistory Object
```typescript
{
  id: number,
  employee_id: string,
  start_date: string,
  end_date?: string,
  jobtitle_id: number,
  jobgroup_id: number,
  positionlevel_id: number,
  positiontype_id: number,
  note?: string
}
```

### ใช้ในหน้า
- `/job-history` - หน้าจัดการประวัติการทำงาน (Admin)
- `/profile` - แสดงประวัติการทำงานของตัวเอง (JobHistorySection)

### Components ที่เกี่ยวข้อง
- `JobHistorySection.tsx` - แสดงประวัติในหน้า Profile
- `JobHistoryDetailModal.tsx` - แสดงรายละเอียดประวัติ
- `ChangeJobModal.tsx` - ฟอร์มเปลี่ยนตำแหน่ง
- `InitializeJobHistoryModal.tsx` - สร้างประวัติเริ่มต้น

---

## 7. usePublicEmployees.ts

### วัตถุประสงค์
ดึงข้อมูลพนักงานแบบ public (ไม่มีข้อมูลละเอียด) สำหรับ User ทั่วไป

### API Endpoints
- `GET /employees/public` - ดึงข้อมูล public
- `GET /employees/getall` - fallback ถ้า public ไม่มี

### Return Values
```typescript
{
  employees: PublicEmployee[],
  loading: boolean,
  error: string | null,
  searchEmployees: (keyword) => PublicEmployee[]
}
```

### PublicEmployee Object (ข้อมูลจำกัด)
```typescript
{
  id: string,
  prefix_th: string,
  first_name_th: string,
  last_name_th: string,
  jobTitle?: { name: string },
  jobGroup?: { group_name: string }
  // ไม่มีข้อมูลส่วนตัว เช่น เบอร์โทร, อีเมล
}
```

### ใช้ในหน้า
- `/dashboard` - ค้นหาพนักงาน (User ทั่วไป)
- `PublicRetirementTable.tsx` - แสดงรายชื่อผู้ใกล้เกษียณ

---

## 8. useRetirement.ts

### วัตถุประสงค์
จัดการข้อมูลพนักงานที่ใกล้เกษียณอายุ

### API Endpoints
- `GET /employees/retirement?years=5` - ดึงรายชื่อผู้ใกล้เกษียณ

### Return Values
```typescript
{
  retirementList: Employee[],
  loading: boolean,
  fetchRetirement: (years?) => Promise<void>
}
```

### ใช้ในหน้า
- `/dashboard` - แสดงตารางผู้ใกล้เกษียณ
- `RetirementTable.tsx` - ตารางแสดงรายละเอียด

### การคำนวณ
- อายุเกษียณ: 60 ปี
- แสดงพนักงานที่เหลือเวลาเกษียณ ≤ 5 ปี (ปรับได้)

---

## 🔑 สิ่งสำคัญสำหรับการส่งมอบงาน

### 1. Authentication Flow
```
Login → useAuth.login() → localStorage.setItem('token') → 
Redirect to Dashboard → useAuth() auto-fetch user data
```

### 2. Role-Based Access Control
```typescript
// ใช้ useAuth เพื่อเช็ค role
const { user } = useAuth();
const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

// แสดง UI ตาม role
{isAdmin ? <AdminComponent /> : <UserComponent />}
```

### 3. Data Fetching Pattern
```typescript
// ทุก hook ใช้ pattern เดียวกัน
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  fetchData();
}, []);

const fetchData = async () => {
  try {
    setLoading(true);
    const res = await API.get('/endpoint');
    setData(res.data);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

### 4. Pagination Pattern
```typescript
const [page, setPage] = useState(1);
const [pagination, setPagination] = useState({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1
});

// Fetch with pagination
const res = await API.get(`/endpoint?page=${page}&limit=10`);
setPagination(res.data.pagination);
```

### 5. Error Handling
```typescript
try {
  await API.post('/endpoint', data);
  alert('บันทึกสำเร็จ');
} catch (err) {
  console.error(err);
  alert('เกิดข้อผิดพลาด: ' + err.message);
}
```

---

## 📝 Checklist การส่งมอบงาน

### Frontend
- [ ] ตรวจสอบว่าทุก hook ทำงานได้ปกติ
- [ ] ทดสอบ Login/Logout
- [ ] ทดสอบ role-based access (user, admin, superadmin)
- [ ] ทดสอบ pagination ในทุกหน้า
- [ ] ทดสอบ search/filter
- [ ] ทดสอบ CRUD operations (Create, Read, Update, Delete)
- [ ] ตรวจสอบ error handling

### Backend
- [ ] ตรวจสอบว่า API endpoints ทั้งหมดทำงานได้
- [ ] ตรวจสอบ authentication middleware
- [ ] ตรวจสอบ role-based authorization
- [ ] ตรวจสอบ database schema
- [ ] ตรวจสอบ error logging

### Documentation
- [ ] อธิบายการใช้งานแต่ละหน้า
- [ ] อธิบาย API endpoints
- [ ] อธิบาย database schema
- [ ] อธิบาย environment variables
- [ ] อธิบายวิธี deploy

---

## 🚀 การ Deploy

### Environment Variables
```env
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=https://hrodpc1.ddc.moph.go.th/api

# Backend (.env)
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=password
DATABASE_NAME=hr_odpc1
JWT_SECRET=your-secret-key
PORT=3011
```

### Build Commands
```bash
# Frontend
npm run build
npm start

# Backend
npm start
```

---

## 📞 ติดต่อ

หากมีปัญหาหรือข้อสงสัย กรุณาติดต่อทีมพัฒนา
