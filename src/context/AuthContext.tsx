"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { getAccessToken } from "@/lib/auth.client";

// Định nghĩa cấu trúc dữ liệu User (hãy đảm bảo nó khớp với API của bạn)
export interface User {
  id: string | number;
  name: string;
  username: string; // Hoặc email
  avatarUrl?: string | null; // Thêm trường này
  role?: string;
  created_at?: string;
}

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refetchUser: () => void; // Hàm để tải lại thông tin user nếu cần
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    setIsLoading(true);
    const token = getAccessToken(); // Kiểm tra token trước khi gọi API
    const localUser = localStorage.getItem('user');
    if (token && localUser) {
      try {
        setUser(JSON.parse(localUser));
      } catch (e) {
        // Nếu localStorage hỏng, gọi API
      }
    } else if (token) {
    } else {
      setUser(null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      isAuthenticated: !!user, 
      refetchUser: fetchUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook tùy chỉnh để dễ dàng sử dụng context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};