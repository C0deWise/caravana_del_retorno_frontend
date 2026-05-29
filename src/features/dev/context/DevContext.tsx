"use client";

import { createContext, useContext, useState, ReactNode, useMemo } from "react";
import { UserRole } from "@/types/user.types";
import { FEATURE_FLAGS } from "@/config/featureFlags";

export const IS_DEV = process.env.NEXT_PUBLIC_DEV_TOOLS === "true";

interface DevContextType {
  roleOverride: UserRole | undefined;
  setRoleOverride: (role: UserRole | undefined) => void;
  mockColoniaId: number | null;
  setMockColoniaId: (id: number | null) => void;
  mockUserId: number | null;
  setMockUserId: (id: number | null) => void;
  isDev: boolean;
  apiMode: boolean;
  setApiMode: (mode: boolean) => void;
  featureFlags: typeof FEATURE_FLAGS;
  setFeatureFlag: (key: keyof typeof FEATURE_FLAGS, value: boolean) => void;
}

const DevContext = createContext<DevContextType | undefined>(undefined);

export function DevProvider({ children }: { readonly children: ReactNode }) {
  const [roleOverride, setRoleOverride] = useState<UserRole | undefined>(
    IS_DEV ? "usuario" : undefined
  );
  const [mockColoniaId, setMockColoniaId] = useState<number | null>(null);
  const [mockUserId, setMockUserId] = useState<number | null>(null);
  const [apiMode, setApiMode] = useState<boolean>(false);
  const [featureFlags, setFeatureFlags] = useState(() => {
    const flags = { ...FEATURE_FLAGS };
    Object.keys(flags).forEach((key) => {
      flags[key as keyof typeof FEATURE_FLAGS] = true;
    });
    return flags;
  });

  const setFeatureFlag = (key: keyof typeof FEATURE_FLAGS, value: boolean) => {
    setFeatureFlags(prev => ({ ...prev, [key]: value }));
  };

  const handleSetApiMode = (mode: boolean) => {
    setApiMode(mode);
    setFeatureFlags(prev => {
      const newFlags = { ...prev };
      Object.keys(newFlags).forEach((key) => {
        newFlags[key as keyof typeof FEATURE_FLAGS] = !mode;
      });
      return newFlags;
    });
  };

  const value = useMemo(
    () => ({
      roleOverride: apiMode ? undefined : roleOverride,
      setRoleOverride,
      mockColoniaId,
      setMockColoniaId,
      mockUserId,
      setMockUserId,
      isDev: IS_DEV,
      apiMode,
      setApiMode: handleSetApiMode,
      featureFlags,
      setFeatureFlag,
    }),
    [roleOverride, mockColoniaId, mockUserId, apiMode, featureFlags],
  );

  return <DevContext.Provider value={value}>{children}</DevContext.Provider>;
}

export function useDev() {
  const context = useContext(DevContext);
  if (context === undefined) {
    return {
      roleOverride: undefined,
      setRoleOverride: () => { },
      mockColoniaId: null,
      setMockColoniaId: () => { },
      mockUserId: null,
      setMockUserId: () => { },
      isDev: false,
      apiMode: false,
      setApiMode: () => { },
      featureFlags: FEATURE_FLAGS,
      setFeatureFlag: () => { },
    };
  }
  return context;
}
