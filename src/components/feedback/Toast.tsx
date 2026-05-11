"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { 
  CheckCircleIcon, 
  ExclamationCircleIcon, 
  InformationCircleIcon, 
  XCircleIcon,
  XMarkIcon 
} from "@heroicons/react/24/solid";

export type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => removeToast(id), 5000);
  }, [removeToast]);


  const value = useMemo(() => ({ showToast }), [showToast]);

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

const ToastItem: React.FC<{ toast: Toast; onClose: () => void }> = ({ toast, onClose }) => {
  const configs = {
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
  };

  const config = configs[toast.type];
  const Icon = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.9, x: 20 }}
      animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.8, x: 20, transition: { duration: 0.2 } }}
      className={`pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-2xl shadow-lg border backdrop-blur-xl ${config.colorClass} ${config.borderClass} min-w-[320px] max-w-md`}
    >
      <Icon className={`w-6 h-6 shrink-0 ${config.iconColor}`} />
      <p className="flex-1 font-semibold text-sm leading-snug">
        {toast.message}
      </p>
      <button 
        onClick={onClose}
        className="p-1.5 rounded-full hover:bg-black/5 transition-colors"
      >
        <XMarkIcon className="w-4 h-4 opacity-70" />
      </button>
    </motion.div>
  );
};
