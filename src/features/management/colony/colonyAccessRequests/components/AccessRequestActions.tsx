"use client";

import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";

interface AccessRequestActionsProps {
  readonly requestId: number;
  readonly isPending: boolean;
  readonly onApprove: (requestId: number) => void;
  readonly onReject: (requestId: number) => void;
}

export function AccessRequestActions({
  requestId,
  isPending,
  onApprove,
  onReject,
}: AccessRequestActionsProps) {
  if (!isPending) return null;

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onApprove(requestId)}
        className="flex items-center justify-center gap-2 px-4 py-2 bg-accent-green text-text-inverse hover:opacity-90 rounded-xl text-sm font-semibold transition-all shadow-md active:scale-95 cursor-pointer"
        aria-label="Aprobar solicitud"
      >
        <CheckIcon className="w-5 h-5" />
        <span>Aprobar</span>
      </button>

      <button
        type="button"
        onClick={() => onReject(requestId)}
        className="flex items-center justify-center gap-2 px-4 py-2 bg-danger text-text-inverse hover:opacity-90 rounded-xl text-sm font-semibold transition-all shadow-md active:scale-95 cursor-pointer"
        aria-label="Rechazar solicitud"
      >
        <XMarkIcon className="w-5 h-5" />
        <span>Rechazar</span>
      </button>
    </div>
  );
}
