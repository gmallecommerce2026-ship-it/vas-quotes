"use client"; // Rất quan trọng vì Context là client-side

import React from "react";
import { SidebarProvider } from "./SidebarContext";
import { ThemeProvider } from "./ThemeContext";
import { AuthProvider } from "./AuthContext"; // <-- THÊM DÒNG NÀY

export function ClientProviders({ children }: { children: React.ReactNode }) {
  // Bọc các provider của bạn tại đây
  return (
    <ThemeProvider>
      <AuthProvider> {/* <-- BỌC Ở ĐÂY */}
        <SidebarProvider>
          {children}
        </SidebarProvider>
      </AuthProvider> {/* <-- BỌC Ở ĐÂY */}
    </ThemeProvider>
  );
}