"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useMemo,
} from "react";
import { UserData, UserRole } from "@/types/user.types";
import { buildMockUsers } from "../utils/mockUsers";
import { authApi } from "@/services/auth.api";
import { tokenStorage } from "@/auth/utils/tokenStorage";

const IS_DEV = process.env.NEXT_PUBLIC_DEV_TOOLS === "true";

interface AuthContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  isHydrating: boolean;
  effectiveRole: UserRole | undefined;
  login: (user: UserData) => void;
  updateUser: (partial: Partial<UserData>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null); //uwu

export function AuthProvider({ children }: { readonly children: ReactNode }) {
  const { roleOverride, setRoleOverride, mockColoniaId, mockUserId, isDev } = useDev();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [isFetchingSession, setIsFetchingSession] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (isDev) {
      setSessionChecked(true);
      return;
    }

    const accessToken = tokenStorage.getAccessToken();

    if (!accessToken) {
      setSessionChecked(true);
      return;
    }

    const rehidrate = async () => {
      setIsFetchingSession(true);

      try {
        const sessionUser = await authApi.me();
        setUser(sessionUser);
      } catch {
        tokenStorage.clear();
        setUser(null);
      } finally {
        setIsFetchingSession(false);
        setSessionChecked(true);
      }
    };

    rehidrate();
  }, [mounted]);

  const isHydrating = !mounted || !sessionChecked || isFetchingSession;

  const effectiveUser: UserData | null =
    isDev && roleOverride !== undefined
      ? {
          ...buildMockUsers(mockColoniaId)[roleOverride]!,
          id: mockUserId ?? 999,
        }
      : user;

  const effectiveRole =
    isDev && roleOverride !== undefined ? roleOverride : user?.role;

  const login = (newUser: UserData) => {
    setUser(newUser);
  };

  const updateUser = (partial: Partial<UserData>) => {
    setUser((prev) => (prev ? { ...prev, ...partial } : null));
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
    setRoleOverride(undefined);
  };

  const contextValue = useMemo(
    () => ({
      user: effectiveUser,
      isAuthenticated: !!effectiveUser,
      isHydrating,
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
    }),
    [
      effectiveUser,
      isHydrating,
      effectiveRole,
      mockColoniaId,
      mockUserId,
      roleOverride,
    ],
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
