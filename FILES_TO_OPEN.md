# 📂 Files to Open During Interview

## 🎯 KEYWORD 1: API Integration

### Primary File
**`src/lib/api.ts`** (Lines 1-90)
- Show Axios configuration
- Show Request interceptor (lines 35-50)
- Show Response interceptor (lines 55-75)

### Example Usage Files
**`src/components/layout/Navbar.tsx`** (Lines 40-60)
- Show: `API.get<APIEmployee>(`/employees/${parsed.id}`)`
- Explain: How token is automatically attached

**`src/components/dashboard/EmployeeSearchWidget.tsx`** (Lines 40-96)
- Show: `API.get("/employees/search", { params: { q: searchQuery } })`
- Explain: Search functionality

**`src/app/(dashboard)/meeting/page.tsx`** (Lines 77-84)
- Show: `API.get(/meeting/getall?page=${pageNo}&limit=${LIMIT})`
- Explain: Pagination with API

---

## 📱 KEYWORD 2: Responsive Design

### Primary Files

**`src/app/(dashboard)/dashboard/page.tsx`** (Lines 50-150)
- Line 51: `<div className="w-full p-4 sm:p-6 lg:p-8">`
- Line 56: `<div className="flex flex-col lg:flex-row items-start justify-between gap-4 mb-6">`
- Line 68: `<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">`
- Line 80: `<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8">`

**`src/app/(dashboard)/employee/page.tsx`** (Lines 100-200)
- Line 110: `<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">`
- Line 130: `<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">`
- Line 180: `<div className="flex flex-col sm:flex-row items-center justify-end gap-3">`

**`src/app/(dashboard)/organization/page.tsx`** (Lines 50-150)
- Line 60: `<div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">`
- Line 70: `<div className="relative w-24 h-24 sm:w-28 sm:h-28">`
- Line 90: `<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">`

### How to Demo
1. Open DevTools: `F12`
2. Toggle Device Toolbar: `Ctrl+Shift+M`
3. Resize from 375px (mobile) → 768px (tablet) → 1024px (desktop)
4. Show UI adapts perfectly

---

## 🔍 KEYWORD 3: SEO

### Metadata File
**`src/app/layout.tsx`** (Lines 1-40)
- Line 3: `import type { Metadata } from "next";`
- Line 7: `export const metadata: Metadata = {`
- Line 8: `title: "DDC-1 Personnel Management System | ระบบจัดการข้อมูลบุคลากร",`
- Line 9: `description: "ระบบจัดการข้อมูลบุคลากร...",`
- Line 10: `keywords: ["personnel", "HR", "human resources", "บุคลากร"],`
- Line 20: `robots: { index: true, follow: true },`

### Image Optimization File
**`next.config.mjs`** (Lines 1-15)
- Line 2: `const nextConfig = {`
- Line 3: `images: {`
- Line 4: `formats: ['image/avif', 'image/webp'],`
- Line 5: `deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],`
- Line 8: `minimumCacheTTL: 60,`

### Semantic HTML File
**`src/app/(dashboard)/organization/page.tsx`** (Lines 1-50)
- Line 10: `<h1 className="text-xl sm:text-2xl font-bold text-gray-800">`
- Line 20: `<section>`
- Line 21: `<h2 className="text-base sm:text-lg font-semibold text-gray-700">`
- Line 30: `<Image src={director.image} alt={director.name} />`
- Line 40: `<ul className="list-disc list-inside space-y-1">`

### How to Demo
1. View Page Source: `Ctrl+U`
2. Search for: `<meta name="description"`
3. Search for: `<meta property="og:title"`
4. Open DevTools: `F12`
5. Go to Network tab
6. Reload page
7. Look for images with `.webp` extension

---

## 🎬 Complete Demo Sequence

### Setup (Before Interview)
```
VS Code Tabs:
1. src/lib/api.ts
2. src/components/layout/Navbar.tsx
3. src/app/(dashboard)/dashboard/page.tsx
4. src/app/layout.tsx
5. next.config.mjs

Browser:
- DevTools (F12)
- Page Source (Ctrl+U)
```

### Demo Flow (15 minutes)

#### Part 1: API Integration (5 min)
```
1. Show src/lib/api.ts (1 min)
   - Explain Axios configuration
   - Show interceptors

2. Show src/components/layout/Navbar.tsx (1 min)
   - Show API.get() call
   - Explain token attachment

3. Explain benefits (3 min)
   - Centralized configuration
   - Automatic token handling
   - Global error handling
```

#### Part 2: Responsive Design (5 min)
```
1. Show src/app/(dashboard)/dashboard/page.tsx (1 min)
   - Show grid-cols-1 sm:grid-cols-2 lg:grid-cols-3

2. Open DevTools (F12) (1 min)
   - Toggle Device Toolbar (Ctrl+Shift+M)

3. Resize screen (2 min)
   - Show 375px (mobile)
   - Show 768px (tablet)
   - Show 1024px (desktop)

4. Explain approach (1 min)
   - Mobile-first
   - Breakpoints
   - Responsive spacing
```

#### Part 3: SEO (5 min)
```
1. Show src/app/layout.tsx (1 min)
   - Show metadata configuration

2. Show next.config.mjs (1 min)
   - Show image optimization

3. View Page Source (Ctrl+U) (1 min)
   - Show meta tags
   - Show Open Graph tags

4. Show DevTools Network (1 min)
   - Show WebP images

5. Explain benefits (1 min)
   - Better search ranking
   - Faster page load
   - Social media sharing
```

---

## 📋 Checklist

### Before Interview
- [ ] All 5 files open in VS Code
- [ ] DevTools ready (F12)
- [ ] Page Source ready (Ctrl+U)
- [ ] npm run build successful
- [ ] No TypeScript errors
- [ ] Responsive design tested
- [ ] Metadata visible in Page Source
- [ ] Images optimized (WebP visible)

### During Interview
- [ ] Start with API Integration
- [ ] Show code first, then explain
- [ ] Demo responsive design with DevTools
- [ ] Show Page Source for SEO
- [ ] Answer questions confidently
- [ ] Show enthusiasm

### After Interview
- [ ] Thank the interviewer
- [ ] Ask about next steps
- [ ] Follow up with thank you email

---

## 🔗 Quick Links

### API Integration
- Main: `src/lib/api.ts`
- Example 1: `src/components/layout/Navbar.tsx` (line 42)
- Example 2: `src/components/dashboard/EmployeeSearchWidget.tsx` (line 40)
- Example 3: `src/app/(dashboard)/meeting/page.tsx` (line 81)

### Responsive Design
- Main 1: `src/app/(dashboard)/dashboard/page.tsx` (line 68)
- Main 2: `src/app/(dashboard)/employee/page.tsx` (line 110)
- Main 3: `src/app/(dashboard)/organization/page.tsx` (line 60)

### SEO
- Metadata: `src/app/layout.tsx` (line 7)
- Images: `next.config.mjs` (line 3)
- Semantic: `src/app/(dashboard)/organization/page.tsx` (line 10)

---

## 💡 Pro Tips

1. **Keyboard Shortcuts**
   - `Ctrl+G` in VS Code to go to specific line
   - `Ctrl+F` to search within file
   - `F12` to open DevTools
   - `Ctrl+U` to view Page Source

2. **Quick Navigation**
   - Use VS Code tabs to switch between files
   - Use browser tabs for DevTools and Page Source
   - Keep everything organized

3. **Talking Points**
   - Explain "Why" before "What"
   - Show code, then explain
   - Demonstrate with live examples
   - Be confident and clear

---

**Last Updated:** May 26, 2026  
**Status:** ✅ Ready for Interview
