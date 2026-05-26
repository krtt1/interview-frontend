"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { HiMenu, HiX } from "react-icons/hi";
import { useAuth } from "@/hooks/useAuth";

type Role = "superadmin" | "admin" | "user" | "unknown";

const normalizeRole = (raw: any): Role => {
  const s = String(raw || "").toLowerCase();
  if (s === "superadmin") return "superadmin";
  if (s === "admin") return "admin";
  if (s === "user") return "user";
  return "unknown";
};

const menuItems = [
  {
    title: "MANAGE",
    items: [
      { label: "หน้าหลัก", href: "/dashboard", iconSrc: "/home.png" },
      {
        label: "ฐานข้อมูลบุคลากร",
        href: "/employee",
        iconSrc: "/employee.png",
        roles: ["admin", "superadmin"] as Role[],
      },
      {
        label: "จัดการประวัติการทำงาน",
        href: "/job-history",
        iconSrc: "/history.png",
        roles: ["admin", "superadmin"] as Role[],
      },
      { label: "การฝึกอบรมและพัฒนา", href: "/meeting", iconSrc: "/training.png" },
      { label: "คำสั่งและเอกสาร", href: "/command", iconSrc: "/performance.png" },
      { 
        label: "ข้อมูลสมรรถนะ", 
        href: "/capacity", 
        iconSrc: "/competency.png",
        roles: ["admin", "superadmin"] as Role[],
      },
    ],
  },
  {
    title: "SETTINGS",
    items: [
      { label: "ข้อมูลของฉัน", href: "/profile", iconSrc: "/avatar.png" },
      {
        label: "โครงสร้างการบริหารงาน",
        href: "/organization",
        iconSrc: "/organization.png",
        roles: ["admin", "superadmin"] as Role[],
      },
    ],
  },
  {
    title: "OTHER",
    items: [{ label: "Logout", action: "logout", iconSrc: "/logout.png" }],
  },
];

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState<Role>("unknown");
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored);
      setRole(normalizeRole(parsed.role));
    } catch {
      setRole("unknown");
    }
  }, []);

  const canSeeItem = (item: any) => {
    if (!item.roles) return true;
    if (role === "unknown") return false;
    return item.roles.includes(role);
  };

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  const renderItem = (item: any, mobile = false) => {
    const isActive = pathname === item.href && item.href;

    if (item.action === "logout") {
      return (
        <button
          key={item.label}
          onClick={handleLogout}
          className="flex items-center gap-3 w-full py-2.5 px-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition"
        >
          <Image src={item.iconSrc} alt="" width={20} height={20} />
          <span>{item.label}</span>
        </button>
      );
    }

    return (
      <Link
        key={item.label}
        href={item.href}
        onClick={() => mobile && setIsOpen(false)}
        className={`flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium transition ${
          isActive
            ? "bg-blue-50 text-blue-600 font-semibold"
            : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
        }`}
      >
        <Image src={item.iconSrc} alt="" width={20} height={20} />
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded shadow"
      >
        {isOpen ? <HiX /> : <HiMenu />}
      </button>

      <nav
        className={`md:hidden fixed top-0 left-0 h-full w-64 bg-white z-40 transform transition ${
          isOpen ? "" : "-translate-x-full"
        }`}
      >
        <div className="p-4">
          {menuItems.map(section => (
            <div key={section.title} className="mb-6">
              <div className="text-xs text-gray-400 mb-2">{section.title}</div>
              {section.items.filter(canSeeItem).map(item => renderItem(item, true))}
            </div>
          ))}
        </div>
      </nav>

      {/* Desktop */}
      <div className="hidden md:block">
        {menuItems.map(section => (
          <div key={section.title} className="mb-6">
            <div className="text-xs text-gray-400 mb-2">{section.title}</div>
            {section.items.filter(canSeeItem).map(item => renderItem(item))}
          </div>
        ))}
      </div>
    </>
  );
};

export default Menu;
