"use client";

import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { useEffect } from "react";

interface AnimatedModalProps {
  readonly isOpen: boolean;
  readonly children: React.ReactNode;
  readonly onBackdropClick?: () => void;
  readonly maxWidth?: string;
}

export function AnimatedModal({
  isOpen,
  children,
  onBackdropClick,
  maxWidth = "max-w-lg",
}: AnimatedModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onBackdropClick?.();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      globalThis.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      globalThis.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onBackdropClick]);

  if (typeof document === "undefined") return null;

  const modalContent = (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/15 p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onBackdropClick?.();
            }
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`w-full ${maxWidth}`}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
