import React from "react";
import { X } from "lucide-react";
import { AnimatedModal } from "./AnimatedModal";

export interface FrostedModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly title?: string;
  readonly showCloseButton?: boolean;
  readonly closeOnBackdropClick?: boolean;
  readonly maxWidth?: string;
  readonly children: React.ReactNode;
}

export function FrostedModal({
  isOpen,
  onClose,
  title,
  showCloseButton = true,
  closeOnBackdropClick = true,
  maxWidth = "max-w-md",
  children,
}: FrostedModalProps) {
  return (
    <AnimatedModal
      isOpen={isOpen}
      onBackdropClick={closeOnBackdropClick ? onClose : undefined}
      maxWidth={maxWidth}
    >
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full p-8 border border-white/40 relative">
        {showCloseButton && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg transition-all"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        
        {title && (
          <h2 className="text-2xl font-bold text-primary text-center mb-6 pr-6 pl-6">
            {title}
          </h2>
        )}
        
        {children}
      </div>
    </AnimatedModal>
  );
}
