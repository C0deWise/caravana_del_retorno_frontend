"use client";

import { createContext, useContext, useState, ReactNode, useMemo } from "react";
import { UserRole } from "@/types/user.types";

export const IS_DEV = process.env.NEXT_PUBLIC_DEV_TOOLS === "true";

interface DevContextType {
  roleOverride: UserRole | undefined;
  setRoleOverride: (role: UserRole | undefined) => void;
  mockColoniaId: number | null;
  setMockColoniaId: (id: number | null) => void;
  mockUserId: number | null;
  setMockUserId: (id: number | null) => void;
  isDev: boolean;
}

const DevContext = createContext<DevContextType | undefined>(undefined);

export function DevProvider({ children }: { readonly children: ReactNode }) {
  const [roleOverride, setRoleOverride] = useState<UserRole | undefined>(
    IS_DEV ? "usuario" : undefined
  );
  const [mockColoniaId, setMockColoniaId] = useState<number | null>(null);
  const [mockUserId, setMockUserId] = useState<number | null>(null);

  const value = useMemo(
    () => ({
      roleOverride,
      setRoleOverride,
      mockColoniaId,
      setMockColoniaId,
      mockUserId,
      setMockUserId,
      isDev: IS_DEV,
    }),
    [roleOverride, mockColoniaId, mockUserId],
  );

  return <DevContext.Provider value={value}>{children}</DevContext.Provider>;
}

export function useDev() {
  const context = useContext(DevContext);
  if (context === undefined) {
    return {
      roleOverride: undefined,
      setRoleOverride: () => {},
      mockColoniaId: null,
      setMockColoniaId: () => {},
      mockUserId: null,
      setMockUserId: () => {},
      isDev: false,
    };
  }
  return context;
}
