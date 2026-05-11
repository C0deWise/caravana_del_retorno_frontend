"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

export type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

const TOAST_DURATION = 5000;

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const createToastId = (): string => crypto.randomUUID();

const findExistingToast = (
  toasts: Toast[],
  message: string,
  type: ToastType,
): Toast | undefined =>
  toasts.find((toast) => toast.message === message && toast.type === type);

const createToast = (message: string, type: ToastType): Toast => ({
  id: createToastId(),
  message,
  type,
});

const removeToastById = (toasts: Toast[], id: string): Toast[] =>
  toasts.filter((toast) => toast.id !== id);

const clearAllTimers = (timers: Map<string, ReturnType<typeof setTimeout>>) => {
  timers.forEach(clearTimeout);
  timers.clear();
};

const getToastConfig = (type: ToastType) => ({
  success: {
    icon: CheckCircleIcon,
    colorClass: "bg-accent-green/10 text-accent-green",
    borderClass: "border-accent-green/20",
    iconColor: "text-accent-green",
  },
  error: {
    icon: XCircleIcon,
    colorClass: "bg-accent-red/10 text-accent-red",
    borderClass: "border-accent-red/20",
    iconColor: "text-accent-red",
  },
  warning: {
    icon: ExclamationCircleIcon,
    colorClass: "bg-secondary/10 text-secondary",
    borderClass: "border-secondary/20",
    iconColor: "text-secondary",
  },
  info: {
    icon: InformationCircleIcon,
    colorClass: "bg-primary/10 text-primary",
    borderClass: "border-primary/20",
    iconColor: "text-primary",
  },
}[type]);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const clearTimer = useCallback((id: string) => {
    const timer = timersRef.current.get(id);

    if (!timer) return;

    clearTimeout(timer);
    timersRef.current.delete(id);
  }, []);

  const removeToast = useCallback(
    (id: string) => {
      clearTimer(id);
      setToasts((prev) => removeToastById(prev, id));
    },
    [clearTimer],
  );

  const handleScheduledRemoval = useCallback((id: string) => {
    setToasts((prev) => removeToastById(prev, id));
    timersRef.current.delete(id);
  }, []);

  const scheduleRemoval = useCallback(
    (id: string) => {
      clearTimer(id);

      const timer = setTimeout(() => {
        handleScheduledRemoval(id);
      }, TOAST_DURATION);

      timersRef.current.set(id, timer);
    },
    [clearTimer, handleScheduledRemoval],
  );

  const showToast = useCallback(
    (message: string, type: ToastType = "info") => {
      setToasts((prev) => {
        const existingToast = findExistingToast(prev, message, type);

        if (existingToast) {
          scheduleRemoval(existingToast.id);
          return prev;
        }

        const nextToast = createToast(message, type);
        scheduleRemoval(nextToast.id);
        return [...prev, nextToast];
      });
    },
    [scheduleRemoval],
  );

  const clearToasts = useCallback(() => {
    clearAllTimers(timersRef.current);
    setToasts([]);
  }, []);

  useEffect(() => {
    const timers = timersRef.current;

    return () => {
      clearAllTimers(timers);
    };
  }, []);

  const value = useMemo(
    () => ({ showToast, removeToast, clearToasts }),
    [showToast, removeToast, clearToasts],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="fixed top-24 right-6 z-100 flex flex-col gap-3 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <ToastItem
              key={toast.id}
              toast={toast}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
};

const ToastItem: React.FC<{ toast: Toast; onClose: () => void }> = ({
  toast,
  onClose,
}) => {
  const config = getToastConfig(toast.type);
  const Icon = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.9, x: 20 }}
      animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
      exit={{
        opacity: 0,
        scale: 0.8,
        x: 20,
        transition: { duration: 0.2 },
      }}
      className={`pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-2xl shadow-lg border backdrop-blur-xl ${config.colorClass} ${config.borderClass} min-w-[320px] max-w-md`}
    >
      <Icon className={`w-6 h-6 shrink-0 ${config.iconColor}`} />

      <p className="flex-1 font-semibold text-sm leading-snug">
        {toast.message}
      </p>

      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar notificación"
        className="p-1.5 rounded-full hover:bg-black/5 transition-colors"
      >
        <XMarkIcon className="w-4 h-4 opacity-70" />
      </button>
    </motion.div>
  );
};