"use client";

import { createContext, useContext, ReactNode, useState } from "react";
import { UserData, UserRole } from "@/types/user.types";
import { buildMockUsers } from "../utils/mockUsers";

const IS_DEV = process.env.NEXT_PUBLIC_DEV_TOOLS === "true";

interface AuthContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  effectiveRole: UserRole | undefined;
  login: (user: UserData) => void;
  updateUser: (partial: Partial<UserData>) => void;
  logout: () => void;
  // solo dev
  setRoleOverride?: (role: UserRole | undefined) => void;
  mockColoniaId?: number | null;
  setMockColoniaId?: (id: number | null) => void;
  mockUserId?: number;
  setMockUserId?: (id: number) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [roleOverride, setRoleOverride] = useState<UserRole | undefined>(
    undefined,
  );
  const [mockColoniaId, setMockColoniaId] = useState<number | null>(null);
  const [mockUserId, setMockUserId] = useState(999);

  const effectiveUser: UserData | null =
    IS_DEV && roleOverride !== undefined
      ? {
          ...buildMockUsers(mockColoniaId)[
            roleOverride as Exclude<UserRole, undefined>
          ]!,
          id: mockUserId,
        }
      : user;

  const effectiveRole =
    IS_DEV && roleOverride !== undefined ? roleOverride : user?.role;

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
        user: effectiveUser,
        isAuthenticated: !!effectiveUser,
        effectiveRole,
        login,
        updateUser,
        logout,
        ...(IS_DEV && {
          setRoleOverride,
          mockColoniaId,
          setMockColoniaId,
          mockUserId,
          setMockUserId,
        }),
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
