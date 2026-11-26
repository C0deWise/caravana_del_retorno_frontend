"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from "react";
import { UserRole } from "@/types/user.types";
import { FEATURE_FLAGS } from "@/config/featureFlags";

export const IS_DEV =
  process.env.NEXT_PUBLIC_DEV_TOOLS === "true" || process.env.NODE_ENV === "development";

export interface DevRegisterOptions {
  blockRedirect: boolean;
}

const DEFAULT_REGISTER_OPTIONS: DevRegisterOptions = {
  blockRedirect: false,
};

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
  devRegisterOptions: DevRegisterOptions;
  setDevRegisterOption: (key: keyof DevRegisterOptions, value: boolean) => void;
}

const DevContext = createContext<DevContextType | undefined>(undefined);

export function DevProvider({ children }: { readonly children: ReactNode }) {
  const [roleOverride, setRoleOverride] = useState<UserRole | undefined>(
    IS_DEV ? "usuario" : undefined
  );
  const [mockColoniaId, setMockColoniaId] = useState<number | null>(null);
  const [mockUserId, setMockUserId] = useState<number | null>(null);
  const [apiMode, setApiMode] = useState<boolean>(!IS_DEV);
  const [featureFlags, setFeatureFlags] = useState(() => {
    const flags = { ...FEATURE_FLAGS };
    (Object.keys(flags) as Array<keyof typeof FEATURE_FLAGS>).forEach((key) => {
      flags[key] = IS_DEV;
    });
    return flags;
  });

  const [devRegisterOptions, setDevRegisterOptions] = useState<DevRegisterOptions>(DEFAULT_REGISTER_OPTIONS);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("dev_register_options");
      if (saved) {
        setDevRegisterOptions({ ...DEFAULT_REGISTER_OPTIONS, ...JSON.parse(saved) });
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const setDevRegisterOption = (key: keyof DevRegisterOptions, value: boolean) => {
    setDevRegisterOptions((prev) => {
      const next = { ...prev, [key]: value };
      try {
        localStorage.setItem("dev_register_options", JSON.stringify(next));
      } catch {
        // ignore storage errors
      }
      return next;
    });
  };

  const setFeatureFlag = (key: keyof typeof FEATURE_FLAGS, value: boolean) => {
    setFeatureFlags(prev => ({ ...prev, [key]: value }));
  };

  const handleSetApiMode = (mode: boolean) => {
    setApiMode(mode);
    setFeatureFlags(prev => {
      const nextFlags = { ...prev };
      (Object.keys(nextFlags) as Array<keyof typeof FEATURE_FLAGS>).forEach((key) => {
        nextFlags[key] = !mode;
      });
      return nextFlags;
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
      devRegisterOptions,
      setDevRegisterOption,
    }),
    [roleOverride, mockColoniaId, mockUserId, apiMode, featureFlags, devRegisterOptions],
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
      devRegisterOptions: DEFAULT_REGISTER_OPTIONS,
      setDevRegisterOption: () => { },
    };
  }
  return context;
}
