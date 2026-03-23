import type { ReactNode } from 'react';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    details?: ReactNode[];
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
    confirmLabel = 'Confirmar',
    cancelLabel = 'Cancelar',
    loading = false,
}: ConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.45)' }}
            onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
        >
            <div
                className="w-full max-w-sm rounded-xl p-6 shadow-lg"
                style={{ backgroundColor: 'var(--color-bg)' }}
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirm-modal-title"
            >
                {/* Título */}
                <h2
                    id="confirm-modal-title"
                    className="text-xl font-bold text-center mb-4"
                    style={{ color: 'var(--color-primary)' }}
                >
                    {title}
                </h2>

                {/* Detalles */}
                {details.length > 0 && (
                    <ul className="mb-6 space-y-1 pl-5 list-disc text-base"
                        style={{ color: 'var(--color-text)' }}
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
                        className="flex-1 py-2.5 rounded-lg font-semibold text-base transition-opacity disabled:opacity-50"
                        style={{
                            backgroundColor: 'var(--color-accent-green)',
                            color: 'var(--color-text-inverse)',
                        }}
                    >
                        {loading ? 'Procesando...' : confirmLabel}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="flex-1 py-2.5 rounded-lg font-semibold text-base transition-opacity disabled:opacity-50"
                        style={{
                            backgroundColor: 'var(--color-danger)',
                            color: 'var(--color-text-inverse)',
                        }}
                    >
                        {cancelLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}