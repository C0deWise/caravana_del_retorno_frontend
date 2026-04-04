import React from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  details?: React.ReactNode[] | string[];
  onConfirm: () => void;
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
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4
                       bg-black/25 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        className="w-full max-w-sm rounded-xl p-6 shadow-lg
                           bg-bg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
      >
        {/* Título */}
        <h2
          id="confirm-modal-title"
          className="text-xl font-bold text-center mb-4
                               text-primary"
        >
          {title}
        </h2>

        {/* Detalles */}
        {details.length > 0 && (
          <ul
            className="mb-6 space-y-1 pl-5 list-disc text-base
                                   text-text"
          >
            {details.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        )}

        {/* Botones */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-lg font-semibold text-base
                                   transition-opacity disabled:opacity-50
                                   bg-success text-text-inverse"
          >
            {loading ? "Procesando..." : confirmLabel}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 rounded-lg font-semibold text-base
                                   transition-opacity disabled:opacity-50
                                   bg-danger text-text-inverse"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
