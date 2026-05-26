# ⚡ Quick Reference - 3 Keywords for Interview

## 🎯 KEYWORD 1: API Integration

### 📁 Main File: `src/lib/api.ts`

**What to say:**
> "เราใช้ Axios library เพื่อ centralize API configuration และ handle authentication ด้วย Bearer token"

**Key Features:**
- ✅ Axios instance with interceptors
- ✅ Automatic Bearer token attachment
- ✅ Global 401 error handling (auto logout)
- ✅ Support JSON & File uploads

**Code Snippet:**
```typescript
// Request Interceptor: แนบ token
config.headers.set("Authorization", `Bearer ${token}`);

// Response Interceptor: Handle 401
if (error?.response?.status === 401) {
  localStorage.removeItem("token");
  window.dispatchEvent(new Event("auth:logout"));
}
```

**Example API Calls:**
- `src/components/layout/Navbar.tsx` - ดึงข้อมูลพนักงาน
- `src/components/dashboard/EmployeeSearchWidget.tsx` - ค้นหาบุคลากร
- `src/app/(dashboard)/meeting/page.tsx` - ดึงข้อมูลการอบรม

---

## 📱 KEYWORD 2: Responsive Design

### 📁 Main Files:
- `src/app/(dashboard)/dashboard/page.tsx`
- `src/app/(dashboard)/employee/page.tsx`
- `src/app/(dashboard)/organization/page.tsx`

**What to say:**
> "เราใช้ Tailwind CSS breakpoints (sm:, md:, lg:) เพื่อให้ UI ปรับตัวได้ดีทั้งมือถือ แท็บเล็ต และ Desktop"

**Key Patterns:**
```typescript
// Grid: 1 column (mobile) → 2 columns (tablet) → 3 columns (desktop)
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

// Flex: Column (mobile) → Row (desktop)
<div className="flex flex-col lg:flex-row items-start justify-between gap-4">

// Padding: Responsive
<div className="p-4 sm:p-6 lg:p-8">

// Text: Responsive
<h1 className="text-2xl sm:text-3xl font-bold">
```

**Breakpoints Used:**
| Class | Screen | Use |
|-------|--------|-----|
| `sm:` | 640px | Tablet small |
| `md:` | 768px | Tablet |
| `lg:` | 1024px | Desktop small |

**How to Demo:**
1. Open DevTools (F12)
2. Click Device Toolbar
3. Resize from mobile → tablet → desktop
4. Show UI adapts perfectly

---

## 🔍 KEYWORD 3: SEO

### 📁 Main Files:
- `src/app/layout.tsx` - Metadata
- `next.config.mjs` - Image Optimization
- `src/app/(dashboard)/organization/page.tsx` - Semantic HTML

**What to say:**
> "เราทำ SEO ด้วย Metadata configuration, Image optimization ด้วย WebP/AVIF, และ Semantic HTML tags"

### 1️⃣ Metadata (src/app/layout.tsx)
```typescript
export const metadata: Metadata = {
  title: "DDC-1 Personnel Management System | ระบบจัดการข้อมูลบุคลากร",
  description: "ระบบจัดการข้อมูลบุคลากร...",
  keywords: ["personnel", "HR", "human resources", "บุคลากร"],
  authors: [{ name: "DDC-1" }],
  openGraph: {
    title: "DDC-1 Personnel Management System",
    description: "ระบบจัดการข้อมูลบุคลากรแบบครบวงจร",
    type: "website",
  },
  robots: {
    index: true,   // ← Allow indexing
    follow: true,  // ← Allow following links
  },
};
```

### 2️⃣ Image Optimization (next.config.mjs)
```javascript
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],  // ← Modern formats
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  compress: true,
  poweredByHeader: false,
};
```

### 3️⃣ Semantic HTML (src/app/(dashboard)/organization/page.tsx)
```typescript
<h1>โครงสร้างผู้บริหารและผังองค์กร</h1>  {/* Main title */}
<section>
  <h2>โครงสร้างการบริหารงาน</h2>
  <Image src={...} alt="Director Name" />  {/* Alt text */}
  <ul>
    <li>Duty 1</li>
    <li>Duty 2</li>
  </ul>
</section>
```

**How to Demo:**
1. Open Page Source (Ctrl+U)
2. Show `<meta name="description">`
3. Show `<meta property="og:title">`
4. Open DevTools → Network tab
5. Show images loaded as WebP

---

## 🎬 Interview Demo Checklist

### ✅ Before Interview
- [ ] Open all 3 keyword files in VS Code
- [ ] Test responsive design with DevTools
- [ ] Check Page Source for metadata
- [ ] Verify build is successful: `npm run build`

### ✅ During Interview (15 minutes total)

**API Integration (5 min)**
1. Open `src/lib/api.ts`
2. Explain Axios configuration
3. Show interceptors
4. Open `src/components/layout/Navbar.tsx` - show API call

**Responsive Design (5 min)**
1. Open `src/app/(dashboard)/dashboard/page.tsx`
2. Show grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
3. Open DevTools → Resize screen
4. Show UI adapts perfectly

**SEO (5 min)**
1. Open `src/app/layout.tsx` - show metadata
2. Open `next.config.mjs` - show image optimization
3. Open Page Source (Ctrl+U) - show meta tags
4. Open DevTools → Network - show WebP images

---

## 💬 Key Phrases to Use

### API Integration
- "Centralized API configuration"
- "Automatic token attachment"
- "Global error handling"
- "Support for JSON and file uploads"

### Responsive Design
- "Mobile-first approach"
- "Tailwind CSS breakpoints"
- "Flexible grid layouts"
- "Responsive typography and spacing"

### SEO
- "Complete metadata configuration"
- "Image optimization with WebP/AVIF"
- "Semantic HTML structure"
- "Open Graph support"

---

## 📊 File Structure Reference

```
src/
├── lib/
│   └── api.ts                          ← API Configuration
├── app/
│   ├── layout.tsx                      ← SEO Metadata
│   └── (dashboard)/
│       ├── dashboard/page.tsx          ← Responsive Grid
│       ├── employee/page.tsx           ← Responsive Cards
│       └── organization/page.tsx       ← Semantic HTML
└── components/
    ├── layout/Navbar.tsx               ← API Call Example
    └── dashboard/EmployeeSearchWidget.tsx ← API Call Example

next.config.mjs                         ← Image Optimization
```

---

## 🚀 Pro Tips

1. **Keyboard Shortcuts:**
   - `F12` - Open DevTools
   - `Ctrl+U` - View Page Source
   - `Ctrl+Shift+M` - Toggle Device Toolbar

2. **Quick Demo:**
   - Have all files open in tabs
   - Use keyboard shortcuts to switch quickly
   - Show code → Show demo → Explain

3. **Talking Points:**
   - Start with "Why" (why we chose this approach)
   - Show "What" (the code)
   - Demonstrate "How" (live demo)

---

**Last Updated:** May 26, 2026  
**Status:** ✅ Ready for Interview
