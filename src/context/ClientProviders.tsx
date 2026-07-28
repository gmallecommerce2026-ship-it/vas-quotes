"use client"; // Rất quan trọng vì Context là client-side

import React from "react";
import { SidebarProvider } from "./SidebarContext";
import { ThemeProvider } from "./ThemeContext";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  // Bọc các provider của bạn tại đây
  return (
    <ThemeProvider>
        <SidebarProvider>
          {children}
        </SidebarProvider>
    </ThemeProvider>
  );
}