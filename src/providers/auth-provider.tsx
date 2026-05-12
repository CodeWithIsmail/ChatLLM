"use client";

import React, { createContext, useContext, useEffect, ReactNode } from "react";
import useAuthStore from "@/app/hooks/useAuthStore";
import useChatStore from "@/app/hooks/useChatStore";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

interface AuthContextType {
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { token, user, isAuthenticated, logout: authLogout, setLoading } = useAuthStore();
  const { loadChatsFromDB, clearChats } = useChatStore();
  const router = useRouter();
  const pathname = usePathname();

  // Load user data on app start if token exists
  useEffect(() => {
    const initAuth = async () => {
      if (token && !user) {
        setLoading(true);
        try {
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error('Invalid token');
          }

          const data = await response.json();
          // User data is already in the store from the token
          
          // Load chats from database
          await loadChatsFromDB();
          toast.success('Welcome back! Your chats have been loaded.');
        } catch (error) {
          console.error('Auth initialization error:', error);
          authLogout();
          toast.error('Session expired. Please login again.');
          if (pathname !== '/auth') {
            router.push('/auth');
          }
        } finally {
          setLoading(false);
        }
      }
    };

    initAuth();
  }, [token, user, setLoading, authLogout, loadChatsFromDB, router, pathname]);

  // Load chats when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadChatsFromDB();
    }
  }, [isAuthenticated, user, loadChatsFromDB]);

  const logout = () => {
    authLogout();
    clearChats();
    router.push('/auth');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
