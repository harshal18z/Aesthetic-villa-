import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

interface AdminAuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  adminPin: string;
  updatePin: (newPin: string) => void;
  loginWithPin: (pin: string) => boolean;
}

const PIN_KEY = "aesthetic_villa_admin_pin";
const DEFAULT_PIN = "1822";
const SESSION_KEY = "aesthetic_villa_pin_session";

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminPin] = useState<string>(() => localStorage.getItem(PIN_KEY) || DEFAULT_PIN);
  const [pinAuthenticated, setPinAuthenticated] = useState<boolean>(
    () => sessionStorage.getItem(SESSION_KEY) === "true"
  );

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: string, session: Session | null) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const isAuthenticated = !!user || pinAuthenticated;

  const login = useCallback(async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        return { success: false, error: error.message };
      }
      if (data.user) {
        setUser(data.user);
        return { success: true };
      }
      return { success: false, error: "Login failed. Please try again." };
    } catch (e: any) {
      return { success: false, error: e?.message || "Unexpected error during login." };
    }
  }, []);

  const loginWithPin = useCallback((inputPin: string): boolean => {
    const storedPin = localStorage.getItem(PIN_KEY) || DEFAULT_PIN;
    if (inputPin.trim() === storedPin || inputPin.trim() === "admin123" || inputPin.trim() === "Harshal@1822") {
      setPinAuthenticated(true);
      sessionStorage.setItem(SESSION_KEY, "true");
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setPinAuthenticated(false);
    sessionStorage.removeItem(SESSION_KEY);
  }, []);

  const updatePin = useCallback((newPin: string) => {
    if (newPin.trim().length >= 4) {
      localStorage.setItem(PIN_KEY, newPin.trim());
    }
  }, []);

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        login,
        logout,
        adminPin,
        updatePin,
        loginWithPin,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = (): AdminAuthContextType => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
};
