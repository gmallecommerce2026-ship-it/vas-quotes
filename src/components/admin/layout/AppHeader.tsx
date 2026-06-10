// src/components/admin/layout/AppHeader.tsx
"use client";

import React, { useState } from "react"; // 1. Import useState
import Image from "next/image";
import { Search, Bell, Menu, ChevronDown, LogOut } from "lucide-react"; // 2. Import LogOut icon
import { usePathname } from "next/navigation";
import { logout } from "@/lib/auth.client"; // 3. Import hàm logout có sẵn

// Map tiêu đề trang (giữ nguyên)
const titleMap: { [key: string]: string } = {
  "/adminDashboard": "Dashboard",
  "/admin-user-management": "User Management",
  "/admin-appointment": "Appointment List",
  "/blood-inventory": "Blood Inventory",
  "/reporting": "Reporting and Analysis",
};

const AppHeader = () => {
  const pathname = usePathname();
  const pageTitle = titleMap[pathname] || "Admin Dashboard";
  
  // 4. State quản lý đóng/mở dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 5. Hàm xử lý đăng xuất
  const handleLogout = () => {
    logout(); // Hàm này sẽ xóa token và redirect về signin (dựa theo code lib/auth.client.ts của bạn)
  };

  return (
    <header className="sticky top-0 z-40 flex h-[100px] w-full items-center justify-between bg-[#B41919] px-6 shadow-md lg:px-10">
      <div className="flex items-center gap-4">
        <button className="text-white lg:hidden">
          <Menu size={28} />
        </button>
        <h1 className="text-2xl font-bold text-white lg:text-3xl">
          {pageTitle}
        </h1>
      </div>

      <div className="flex items-center gap-6">
        {/* Search Bar (Giữ nguyên) */}
        <div className="hidden md:block">
          <div className="relative">
            <input
              type="text"
              placeholder="Search here..."
              className="h-12 w-[280px] rounded-xl border border-white/20 bg-white py-2 pl-11 pr-4 text-sm text-gray-700 placeholder-gray-400 shadow-sm focus:border-white focus:outline-none focus:ring-2 focus:ring-white/20"
            />
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Notification (Giữ nguyên) */}
        <div className="relative">
          <button className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20">
            <Bell size={22} />
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-yellow-400 border border-[#B41919]"></span>
          </button>
        </div>

        {/* User Profile & Dropdown */}
        <div className="relative ml-4"> {/* Thêm relative để định vị dropdown */}
          <div 
            className="flex items-center gap-3 border-l border-white/20 pl-6 cursor-pointer"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Toggle dropdown
          >
            <div className="hidden text-right md:block">
              <p className="text-sm font-bold text-white">Admin User</p>
              <p className="text-xs text-red-100">Super Admin</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white p-0.5">
              <Image
                src="/images/user/user-01.jpg"
                width={44}
                height={44}
                alt="Avatar"
                className="rounded-lg object-cover"
              />
            </div>
            <button className="hidden text-white md:block">
              <ChevronDown size={20} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* 6. Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-3 w-48 rounded-xl bg-white p-2 shadow-lg ring-1 ring-black ring-opacity-5 animate-fadeIn z-50">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;