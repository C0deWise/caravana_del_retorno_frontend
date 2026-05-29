"use client";

import { useState, useRef, useEffect } from "react";
import { BellIcon, CheckCircleIcon, InformationCircleIcon, ExclamationTriangleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { BellIcon as BellIconSolid } from "@heroicons/react/24/solid";
import { AnimatePresence, motion } from "framer-motion";

import { useNotifications } from "../hooks/useNotifications";

const getIconForType = (type: string) => {
  switch (type) {
    case "success": return <CheckCircleIcon className="w-6 h-6 text-success" />;
    case "warning": return <ExclamationTriangleIcon className="w-6 h-6 text-accent-yellow" />;
    case "error": return <XCircleIcon className="w-6 h-6 text-danger" />;
    default: return <InformationCircleIcon className="w-6 h-6 text-primary" />;
  }
};

export default function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { notifications, unreadCount, markAllAsRead, markAsRead, isLoading } = useNotifications();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-text-muted">Cargando notificaciones...</p>
        </div>
      );
    }

    if (notifications.length > 0) {
      return (
        <div className="flex flex-col divide-y divide-bg-separator">
          {notifications.map((notification) => (
            <button
              key={notification.id}
              onClick={() => markAsRead(notification.id)}
              className={`w-full text-left flex gap-4 p-4 transition-colors cursor-pointer hover:bg-bg-card focus:outline-none focus:bg-bg-card ${notification.read ? '' : 'bg-primary/5'}`}
            >
              <div className="shrink-0 mt-1">
                {getIconForType(notification.type)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start gap-2">
                  <p className={`text-sm font-medium ${notification.read ? 'text-text' : 'text-primary'}`}>
                    {notification.title}
                  </p>
                  <span className="text-[11px] text-text-muted whitespace-nowrap">
                    {notification.date}
                  </span>
                </div>
                <p className="text-sm text-text-muted mt-1 leading-tight">
                  {notification.message}
                </p>
              </div>
              {!notification.read && (
                <div className="shrink-0 self-center">
                  <span className="block w-2 h-2 rounded-full bg-primary" />
                </div>
              )}
            </button>
          ))}
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <BellIcon className="w-12 h-12 text-bg-border mb-3" />
        <p className="text-text-muted">No tienes notificaciones</p>
      </div>
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-full transition-colors hover:bg-white/10 active:scale-95"
        aria-label="Notificaciones"
      >
        {unreadCount > 0 ? (
          <>
            <BellIconSolid className="w-8 h-8 text-text-inverse" />
            <span className="absolute top-1.5 right-1.5 flex items-center justify-center w-5 h-5 text-[11px] font-bold text-white bg-accent-red rounded-full border-2 border-primary">
              {unreadCount}
            </span>
          </>
        ) : (
          <BellIcon className="w-8 h-8 text-text-inverse" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-bg rounded-xl shadow-2xl border border-bg-border overflow-hidden z-50"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-bg-border bg-bg-card">
              <h3 className="text-lg font-semibold text-primary">Notificaciones</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm font-medium text-primary hover:text-secondary transition-colors"
                >
                  Marcar todas como leídas
                </button>
              )}
            </div>

            <div className="max-h-[60vh] overflow-y-auto overscroll-contain">
              {renderContent()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
