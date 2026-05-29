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
import { authApi } from "@/services/auth.api";
import { tokenStorage } from "@/auth/utils/tokenStorage";

interface AuthContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  isHydrating: boolean;
  effectiveRole: UserRole | undefined;
  login: (user: UserData) => void;
  updateUser: (partial: Partial<UserData>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { readonly children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [isFetchingSession, setIsFetchingSession] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const rehidrate = async () => {
      setIsFetchingSession(true);

      try {
        const token = tokenStorage.getAccessToken();
        if (!token) {
          throw new Error("No token found");
        }
        
        // Obtenemos el usuario actual. Si el token expiró, api.services se encarga del refresh automáticamente
        const sessionUser = await authApi.me();
        setUser(sessionUser);
      } catch {
        authApi.logout();
        setUser(null);
      } finally {
        setIsFetchingSession(false);
        setSessionChecked(true);
      }
    };

    rehidrate();
  }, [mounted]);

  const isHydrating = !mounted || !sessionChecked || isFetchingSession;
  const effectiveRole = user?.role;

  const login = (newUser: UserData) => {
    setUser(newUser);
  };

  const updateUser = (partial: Partial<UserData>) => {
    setUser((prev) => (prev ? { ...prev, ...partial } : null));
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
  };

  const contextValue = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isHydrating,
      effectiveRole,
      login,
      updateUser,
      logout,
    }),
    [
      user,
      isHydrating,
      effectiveRole,
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
