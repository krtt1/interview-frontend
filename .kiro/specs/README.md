# คู่มือเอกสาร Specs - ODPC1 HR System

**ระบบข้อมูลสารสนเทศบุคลากร สำนักงานป้องกันควบคุมโรคที่ 1 จังหวัดเชียงใหม่**

---

## 📚 โครงสร้างเอกสาร

```
.kiro/specs/
├── README.md                          # คู่มือนี้
├── BACKEND-MISSING-ENDPOINTS.md       # รายการ API endpoints ที่ Backend ต้องสร้าง
├── FINAL-CODE-REVIEW.md              # รายงานการตรวจสอบโค้ดแบบละเอียด
│
├── capacity-feature/                  # ระบบจัดการข้อมูลสมรรถนะ
│   ├── BACKEND-API-REQUIREMENTS.md    # API specifications
│   ├── FIELD-LABEL-MAPPING.md         # การ mapping ชื่อ fields
│   ├── FINAL-SUMMARY.md               # สรุปการพัฒนา
│   ├── TESTING-CHECKLIST.md           # รายการทดสอบ
│   └── create-table-capacity-FULL.sql # SQL สำหรับสร้างตาราง
│
└── job-history-feature/               # ระบบประวัติการทำงาน
    ├── requirements.md                # Requirements document
    ├── DEPLOYMENT-GUIDE.md            # คู่มือการ deploy
    ├── create-table-job-history.sql   # SQL สำหรับสร้างตาราง
    └── alter-table-add-position-fields.sql # SQL เพิ่ม fields
```

---

## 🎯 วัตถุประสงค์

เอกสารชุดนี้จัดทำขึ้นเพื่อ:
1. **บันทึกความต้องการ** (Requirements) ของระบบ
2. **อ้างอิง API Specifications** สำหรับการพัฒนา
3. **คู่มือการ Deploy** และการติดตั้งระบบ
4. **SQL Scripts** สำหรับสร้างและแก้ไขฐานข้อมูล
5. **Testing Checklist** สำหรับการทดสอบระบบ

---

## 📖 คำอธิบายเอกสารแต่ละไฟล์

### Root Level

#### 1. BACKEND-MISSING-ENDPOINTS.md
**วัตถุประสงค์**: รายการ API endpoints ที่ Backend ต้องสร้าง

**เนื้อหา**:
- รายการ endpoints ที่ขาดหายไป
- HTTP methods และ parameters
- Response format ที่คาดหวัง
- ความสำคัญของแต่ละ endpoint

**ใช้เมื่อไหร่**:
- เมื่อ Frontend พบว่า API ไม่มี
- เมื่อต้องการแจ้ง Backend developer
- เมื่อวางแผนการพัฒนา Backend

---

#### 2. FINAL-CODE-REVIEW.md
**วัตถุประสงค์**: รายงานการตรวจสอบโค้ดแบบละเอียด

**เนื้อหา**:
- สรุปการแก้ไขโค้ดทั้งหมด
- ปัญหาที่พบและวิธีแก้ไข
- คำแนะนำการปรับปรุง
- Metrics และสถิติ

**ใช้เมื่อไหร่**:
- เมื่อต้องการทบทวนการพัฒนา
- เมื่อต้องการดู best practices
- เมื่อต้องการอ้างอิงการแก้ไขปัญหา

---

### Capacity Feature

#### 1. BACKEND-API-REQUIREMENTS.md
**วัตถุประสงค์**: API specifications สำหรับระบบ Capacity

**เนื้อหา**:
- รายการ API endpoints ทั้งหมด (6 endpoints)
- Request/Response format
- Field definitions
- Error handling

**ใช้เมื่อไหร่**:
- เมื่อพัฒนา Frontend
- เมื่อต้องการเช็ค API format
- เมื่อ debug API calls

**Endpoints**:
```
GET    /capacity              # ดึงรายการทั้งหมด
GET    /capacity/:id          # ดึงข้อมูลตาม ID
POST   /capacity/:id          # สร้าง/อัพเดทข้อมูล
DELETE /capacity/:id          # ลบข้อมูล
GET    /capacity/export       # Export Excel
POST   /capacity/import       # Import Excel
```

---

#### 2. FIELD-LABEL-MAPPING.md
**วัตถุประสงค์**: การ mapping ระหว่างชื่อ field ใน Database กับ Label ที่แสดง

**เนื้อหา**:
- ตาราง mapping ทั้งหมด 100+ fields
- จัดกลุ่มตาม tabs (18 tabs)
- ชื่อ field ใน Database
- Label ภาษาไทยที่แสดงใน UI

**ใช้เมื่อไหร่**:
- เมื่อสร้าง form fields
- เมื่อต้องการเช็คชื่อ field
- เมื่อ debug data mapping

**ตัวอย่าง**:
```
Database Field          | UI Label
------------------------|---------------------------
skill_official_writing  | การเขียนหนังสือราชการ
skill_meeting_summary   | การสรุปการประชุม
```

---

#### 3. FINAL-SUMMARY.md
**วัตถุประสงค์**: สรุปการพัฒนาระบบ Capacity แบบสมบูรณ์

**เนื้อหา**:
- สรุป features ทั้งหมด
- สถานะการพัฒนา
- ปัญหาที่พบและวิธีแก้
- Next steps

**ใช้เมื่อไหร่**:
- เมื่อต้องการภาพรวมของระบบ
- เมื่อส่งมอบงาน
- เมื่อทำ documentation

---

#### 4. TESTING-CHECKLIST.md
**วัตถุประสงค์**: รายการทดสอบระบบ Capacity

**เนื้อหา**:
- Test cases ทั้งหมด
- Expected results
- Status (Pass/Fail)
- Notes

**ใช้เมื่อไหร่**:
- ก่อน deploy
- หลังแก้ไข code
- เมื่อทำ regression testing

**หมวดหมู่การทดสอบ**:
1. List Page (ค้นหา, export, import, delete)
2. Detail Page (18 tabs, save, validation)
3. API Integration
4. Error Handling

---

#### 5. create-table-capacity-FULL.sql
**วัตถุประสงค์**: SQL script สำหรับสร้างตารางและ indexes

**เนื้อหา**:
- CREATE TABLE statements (6 ตาราง)
- Field definitions
- Indexes
- Foreign keys

**ใช้เมื่อไหร่**:
- เมื่อติดตั้งระบบครั้งแรก
- เมื่อสร้าง database ใหม่
- เมื่อต้องการ reference schema

**ตารางที่สร้าง**:
```sql
tb_capacity                    -- ตารางหลัก
tb_capacity_training_courses   -- หลักสูตรระบาดวิทยา
tb_capacity_vector_courses     -- หลักสูตรโรคติดต่อนำโดยแมลง
tb_capacity_envocc_courses     -- หลักสูตร EnvOcc
tb_capacity_law_courses        -- หลักสูตรกฎหมาย
tb_capacity_other_experiences  -- ประสบการณ์อื่นๆ
```

---

### Job History Feature

#### 1. requirements.md
**วัตถุประสงค์**: เอกสาร requirements ของระบบประวัติการทำงาน

**เนื้อหา**:
- User stories
- Functional requirements
- Non-functional requirements
- Use cases

**ใช้เมื่อไหร่**:
- เมื่อเริ่มพัฒนา feature ใหม่
- เมื่อต้องการทำความเข้าใจระบบ
- เมื่อวางแผนการพัฒนา

---

#### 2. DEPLOYMENT-GUIDE.md
**วัตถุประสงค์**: คู่มือการ deploy ระบบประวัติการทำงาน

**เนื้อหา**:
- ขั้นตอนการติดตั้ง
- SQL scripts ที่ต้องรัน
- Configuration ที่ต้องตั้งค่า
- Troubleshooting

**ใช้เมื่อไหร่**:
- เมื่อ deploy ระบบ
- เมื่อติดตั้งใน production
- เมื่อมีปัญหาหลัง deploy

**ขั้นตอนการ Deploy**:
1. รัน SQL scripts
2. ตั้งค่า environment variables
3. Deploy Frontend
4. Deploy Backend
5. ทดสอบระบบ

---

#### 3. create-table-job-history.sql
**วัตถุประสงค์**: SQL script สำหรับสร้างตารางประวัติการทำงาน

**เนื้อหา**:
```sql
CREATE TABLE tb_employee_job_history (
  history_id INT PRIMARY KEY AUTO_INCREMENT,
  employee_id VARCHAR(13),
  job_group_id INT,
  position_type_id INT,
  position_level_id INT,
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

**ใช้เมื่อไหร่**:
- เมื่อติดตั้งระบบครั้งแรก
- เมื่อสร้าง database ใหม่

---

#### 4. alter-table-add-position-fields.sql
**วัตถุประสงค์**: SQL script สำหรับเพิ่ม fields ใหม่

**เนื้อหา**:
```sql
ALTER TABLE tb_employee_job_history
ADD COLUMN position_type_id INT,
ADD COLUMN position_level_id INT;
```

**ใช้เมื่อไหร่**:
- เมื่ออัพเกรดระบบเดิม
- เมื่อเพิ่ม features ใหม่

---

## 🚀 การใช้งาน

### สำหรับ Frontend Developer

1. **เริ่มพัฒนา Feature ใหม่**:
   ```
   1. อ่าน requirements.md
   2. ดู BACKEND-API-REQUIREMENTS.md
   3. ดู FIELD-LABEL-MAPPING.md
   4. เริ่มเขียน code
   ```

2. **Debug API Issues**:
   ```
   1. เช็ค BACKEND-API-REQUIREMENTS.md
   2. เช็ค BACKEND-MISSING-ENDPOINTS.md
   3. ติดต่อ Backend developer
   ```

3. **ก่อน Deploy**:
   ```
   1. ทำตาม TESTING-CHECKLIST.md
   2. อ่าน DEPLOYMENT-GUIDE.md
   3. Deploy
   ```

---

### สำหรับ Backend Developer

1. **สร้าง API ใหม่**:
   ```
   1. ดู BACKEND-API-REQUIREMENTS.md
   2. ดู BACKEND-MISSING-ENDPOINTS.md
   3. สร้าง endpoints ตาม spec
   ```

2. **สร้าง Database**:
   ```
   1. รัน create-table-*.sql
   2. รัน alter-table-*.sql (ถ้ามี)
   3. ทดสอบ
   ```

---

### สำหรับ QA/Tester

1. **ทดสอบระบบ**:
   ```
   1. ดู TESTING-CHECKLIST.md
   2. ทดสอบตาม checklist
   3. บันทึกผลการทดสอบ
   ```

---

## 📝 หมายเหตุสำคัญ

### 1. การตั้งชื่อไฟล์
- **UPPERCASE.md**: เอกสารสำคัญ (README, FINAL-SUMMARY)
- **lowercase.md**: เอกสารทั่วไป (requirements, design)
- **kebab-case.sql**: SQL scripts

### 2. การอัพเดทเอกสาร
- อัพเดทเมื่อมีการเปลี่ยนแปลง
- ใส่วันที่และผู้แก้ไข
- เก็บ version history

### 3. การลบเอกสาร
**ลบได้**:
- ไฟล์ชั่วคราว (TODO, CURRENT-STATUS)
- ไฟล์ที่ใช้แล้ว (completed tasks)
- ไฟล์ซ้ำซ้อน

**ห้ามลบ**:
- Requirements documents
- API specifications
- SQL scripts
- Deployment guides
- Testing checklists

---

## 🔄 Version History

### v1.0 (9 กุมภาพันธ์ 2026)
- สร้างเอกสารครั้งแรก
- จัดระเบียบ folder structure
- ลบไฟล์ที่ไม่จำเป็น (37 ไฟล์)
- เหลือเอกสารสำคัญ 11 ไฟล์

---

## 📞 ติดต่อ

**Frontend Developer**: [ชื่อ]  
**Backend Developer**: [ชื่อ]  
**Project Manager**: [ชื่อ]

---

## 📚 เอกสารอ้างอิง

1. [Next.js Documentation](https://nextjs.org/docs)
2. [TypeScript Documentation](https://www.typescriptlang.org/docs)
3. [Tailwind CSS Documentation](https://tailwindcss.com/docs)
4. [MySQL Documentation](https://dev.mysql.com/doc)

---

**อัพเดทล่าสุด**: 9 กุมภาพันธ์ 2026  
**เวอร์ชัน**: 1.0  
**สถานะ**: ✅ ใช้งานได้
