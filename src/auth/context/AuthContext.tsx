"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { UserApi, UserData, UserRole, CODE_TO_ROLE } from "@/types/user.types";
import { buildMockUsers } from "../utils/mockUsers";

const IS_DEV = process.env.NEXT_PUBLIC_DEV_TOOLS === "true";
const STORAGE_KEY = "session_documento";

interface AuthContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  isHydrating: boolean;
  effectiveRole: UserRole | undefined;
  login: (user: UserData) => void;
  updateUser: (partial: Partial<UserData>) => void;
  logout: () => void;
  setRoleOverride?: (role: UserRole | undefined) => void;
  mockColoniaId?: number | null;
  setMockColoniaId?: (id: number | null) => void;
  mockUserId?: number | null;
  setMockUserId?: (id: number | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [isFetchingSession, setIsFetchingSession] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [roleOverride, setRoleOverride] = useState<UserRole | undefined>(
    IS_DEV ? "usuario" : undefined,
  );
  const [mockColoniaId, setMockColoniaId] = useState<number | null>(null);
  const [mockUserId, setMockUserId] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (IS_DEV) {
      setSessionChecked(true);
      return;
    }

    const savedDocumento = localStorage.getItem(STORAGE_KEY);

    if (!savedDocumento) {
      setSessionChecked(true);
      return;
    }

    const rehidrate = async () => {
      setIsFetchingSession(true);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      try {
        const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "";
        const res = await fetch(`${baseURL}/api/v1/usuario/todos`, {
          signal: controller.signal,
        });

        if (!res.ok) throw new Error("No se pudo consultar la sesión");

        const usuarios: UserApi[] = await res.json();
        const found = usuarios.find((u) => u.documento === savedDocumento);

        if (!found) {
          localStorage.removeItem(STORAGE_KEY);
          setUser(null);
        } else {
          const { codigo_rol, ...rest } = found;
          setUser({
            ...rest,
            role: CODE_TO_ROLE[codigo_rol],
          });
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
        setUser(null);
      } finally {
        clearTimeout(timeoutId);
        setIsFetchingSession(false);
        setSessionChecked(true);
      }
    };

    rehidrate();
  }, [mounted]);

  const isHydrating = !mounted || !sessionChecked || isFetchingSession;

  const effectiveUser: UserData | null =
    IS_DEV && roleOverride !== undefined
      ? {
          ...buildMockUsers(mockColoniaId)[
            roleOverride as Exclude<UserRole, undefined>
          ]!,
          id: mockUserId ?? 999,
        }
      : user;

  const effectiveRole =
    IS_DEV && roleOverride !== undefined ? roleOverride : user?.role;

  const login = (newUser: UserData) => {
    localStorage.setItem(STORAGE_KEY, newUser.documento);
    setUser(newUser);
  };

  const updateUser = (partial: Partial<UserData>) => {
    setUser((prev) => (prev ? { ...prev, ...partial } : null));
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setRoleOverride(undefined);
  };

  return (
    <AuthContext.Provider
      value={{
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
      }}
    >
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
