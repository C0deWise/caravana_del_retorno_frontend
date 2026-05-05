"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import { AccessibilitySettings } from "../types/accessibility.types";

const STORAGE_KEY = "accessibility_settings";

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (newSettings: AccessibilitySettings) => void;
  resetSettings: () => void;
  isOpen: boolean;
  togglePanel: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(
  undefined
);

const initializeSettings = (): AccessibilitySettings => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
};

export function AccessibilityProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [settings, setSettings] = useState<AccessibilitySettings>(
    initializeSettings
  );
  const [isOpen, setIsOpen] = useState(false);

  const updateSettings = useCallback((newSettings: AccessibilitySettings) => {
    setSettings(newSettings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings({});
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const togglePanel = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const value = useMemo(
    () => ({
      settings,
      updateSettings,
      resetSettings,
      isOpen,
      togglePanel,
    }),
    [settings, updateSettings, resetSettings, isOpen, togglePanel]
  );

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error(
      "useAccessibility must be used within AccessibilityProvider"
    );
  }
  return context;
}
