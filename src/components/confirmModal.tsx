"use client";

import React, { useEffect, useId, useRef } from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  details?: React.ReactNode[] | string[];
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
}

export function ConfirmModal({
  isOpen,
  title,
  details = [],
  onConfirm,
  onCancel,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  loading = false,
}: ConfirmModalProps) {
  const titleId = useId();
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    confirmButtonRef.current?.focus();

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !loading) {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, loading, onCancel]);

  const handleConfirm = async () => {
    try {
      await onConfirm();
    } finally {
      onCancel();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 p-4 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onCancel();
      }}
    >
      <div
        className="w-full max-w-lg rounded-xl bg-bg p-6 shadow-lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <h2
          id={titleId}
          className="mb-4 text-center text-xl font-bold text-primary"
        >
          {title}
        </h2>

        {details.length > 0 && (
          <ul className="mb-6 list-disc space-y-1 pl-5 text-base text-text">
            {details.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        )}

        <div className="flex gap-3">
          <button
            ref={confirmButtonRef}
            type="button"
            onClick={() => void handleConfirm()}
            disabled={loading}
            className="flex-1 cursor-pointer rounded-lg bg-success py-2.5 text-base font-semibold text-text-inverse transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Procesando..." : confirmLabel}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 cursor-pointer rounded-lg bg-danger py-2.5 text-base font-semibold text-text-inverse transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
