"use client";

import { createContext, useContext, ReactNode, useState } from "react";
import { UserData, UserRole } from "@/types/user.types";

const IS_DEV = process.env.NEXT_PUBLIC_DEV_TOOLS === "true";

interface AuthContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  effectiveRole: UserRole | undefined; // para RoleSwitcher
  login: (user: UserData) => void;
  updateUser: (partial: Partial<UserData>) => void;
  logout: () => void;
  setRoleOverride?: (role: UserRole | undefined) => void; // solo dev
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null); // ← sin mock
  const [roleOverride, setRoleOverride] = useState<UserRole | undefined>(
    undefined,
  );

  const effectiveRole =
    IS_DEV && roleOverride !== null ? roleOverride : user?.role;

  const login = (newUser: UserData) => setUser(newUser);
  const updateUser = (partial: Partial<UserData>) =>
    setUser((prev) => (prev ? { ...prev, ...partial } : null));
  const logout = () => {
    setUser(null);
    setRoleOverride(undefined);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        effectiveRole,
        login,
        updateUser,
        logout,
        ...(IS_DEV && { setRoleOverride }),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
