"use client";
import NotificationDropdown from "@/components/header/NotificationDropdown";
import UserDropdown from "@/components/header/UserDropdown";
// Import các icon bạn có. 
// Tôi dùng BoxCubeIcon và PlugInIcon làm placeholder cho "Fullscreen" và "Settings/Plug"
import { BoxCubeIcon, PlugInIcon } from "@/icons"; 
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import AppNavBar from "./AppNavBar";

const AppHeader: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Component nút biểu tượng (ĐÃ CẬP NHẬT STYLING CHO DARK MODE)
  const HeaderIconButton = ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
  }) => (
    <button
      onClick={onClick}
      className="relative flex items-center justify-center w-10 h-10 text-gray-500 transition-colors bg-white border border-gray-200 rounded-full
                 hover:text-gray-700 hover:bg-gray-100
                 dark:text-gray-400 dark:hover:text-white 
                 dark:bg-white/[.05] dark:border-white/[.08] dark:hover:bg-white/[.1]"
    >
      {children}
    </button>
  );

  return (
    <>
      <header className="sticky top-0 flex w-full bg-white border-b border-gray-200 z-99999">
        {/* Header sẽ chiếm 100vw.
          Div bên trong này sẽ co lại theo max-w-7xl và căn giữa nội dung.
        */}
        <div className="flex items-center justify-between w-full px-4 py-3 mx-auto 2xl:max-w-7xl sm:px-6 md:px-8">
          {/* */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-2xl font-bold text-red-600 dark:text-red-500"
              style={{ textTransform: "uppercase" }}
            >
              B-Donor
            </Link>
          </div>

          {/* */}
          <div className="flex-1 max-w-lg px-4">
            <form>
              <div className="relative">
                <span className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2">
                  {/* Search Icon */}
                  <svg className="fill-gray-500 dark:fill-gray-400" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z" fill=""/>
                  </svg>
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search for..."
                  className="w-full h-11 rounded-3xl border border-gray-200 bg-transparent py-2.5 pl-12 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 
                            dark:border-red-700 dark:text-white/90 dark:placeholder:text-gray-400 dark:focus:border-brand-800"
                />
              </div>
            </form>
          </div>

          {/* */}
          <div className="flex items-center gap-3">
            <HeaderIconButton>
              <BoxCubeIcon className="w-5 h-5" /> {/* Tạm cho Fullscreen */}
            </HeaderIconButton>

            <NotificationDropdown />

            {/* Nút Ngôn ngữ */}
            <div className="relative">
              <HeaderIconButton>
                <span className="text-sm font-medium">EN</span>
              </HeaderIconButton>
            </div>
            
            <UserDropdown />

            <HeaderIconButton>
              <PlugInIcon className="w-5 h-5" /> {/* Tạm cho Settings (Plug icon) */}
            </HeaderIconButton>
          </div>
        </div>
      </header>
      
      <AppNavBar />
    </>
  );
};

export default AppHeader;