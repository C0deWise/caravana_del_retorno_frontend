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

const TOAST_DURATION = 8000;

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
    progressClass: "bg-accent-green",
  },
  error: {
    icon: XCircleIcon,
    colorClass: "bg-accent-red/10 text-accent-red",
    borderClass: "border-accent-red/20",
    iconColor: "text-accent-red",
    progressClass: "bg-accent-red",
  },
  warning: {
    icon: ExclamationCircleIcon,
    colorClass: "bg-accent-yellow/10 text-accent-yellow",
    borderClass: "border-accent-yellow/20",
    iconColor: "text-accent-yellow",
    progressClass: "bg-accent-yellow",
  },
  info: {
    icon: InformationCircleIcon,
    colorClass: "bg-accent-yellow/10 text-accent-yellow",
    borderClass: "border-accent-yellow/20",
    iconColor: "text-accent-yellow",
    progressClass: "bg-accent-yellow",
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

      <div className="fixed top-24 right-6 z-40 flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
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
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{
        opacity: 0,
        x: 100,
        transition: { duration: 0.3 },
      }}
      className={`relative overflow-hidden pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-2xl shadow-lg border backdrop-blur-xl ${config.colorClass} ${config.borderClass} min-w-[320px] max-w-md`}
    >
      <Icon className={`w-6 h-6 shrink-0 ${config.iconColor} z-10`} />

      <p className="flex-1 font-semibold text-sm leading-snug z-10">
        {toast.message}
      </p>

      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar notificación"
        className="p-1.5 rounded-full hover:bg-black/5 transition-colors z-10"
      >
        <XMarkIcon className="w-4 h-4 opacity-70" />
      </button>

      <motion.div
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: TOAST_DURATION / 1000, ease: "linear" }}
        className={`absolute bottom-0 left-0 h-1.5 ${config.progressClass} opacity-80`}
      />
    </motion.div>
  );
};