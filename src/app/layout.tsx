import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DDC-1 Personnel Management System | ระบบจัดการข้อมูลบุคลากร",
  description: "ระบบจัดการข้อมูลบุคลากร (Personnel Data Management System) สำนักงานป้องกันควบคุมโรคที่ 1 จังหวัดเชียงใหม่ - HRMS",
  keywords: ["personnel", "HR", "human resources", "management system", "บุคลากร", "ระบบจัดการ"],
  authors: [{ name: "DDC-1" }],
  openGraph: {
    title: "DDC-1 Personnel Management System",
    description: "ระบบจัดการข้อมูลบุคลากรแบบครบวงจร",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
