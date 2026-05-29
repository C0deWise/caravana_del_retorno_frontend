"use client";

import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface GrupalInvitationActionsProps {
  readonly invitationId: number;
  readonly isPending: boolean;
  readonly onAccept: (invitationId: number) => void;
  readonly onReject: (invitationId: number) => void;
  /** Bloquea las acciones cuando el usuario ya aceptó otra invitación */
  readonly hasActiveGroup: boolean;
}

export function GrupalInvitationActions({
    invitationId,
    isPending,
    onAccept,
    onReject,
    hasActiveGroup,
}: GrupalInvitationActionsProps) {
    if (!isPending) return null;

    return (
        <div className="flex items-center gap-2">
            <button
                type="button"
                onClick={() => onAccept(invitationId)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-accent-green text-text-inverse hover:opacity-90 rounded-xl text-sm font-semibold transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Aceptar invitación"
                disabled={hasActiveGroup}
            >
                <CheckIcon className="h-5 w-5" />
                Aceptar
            </button>

            <button
                type="button"
                onClick={() => onReject(invitationId)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-danger text-text-inverse hover:opacity-90 rounded-xl text-sm font-semibold transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Rechazar invitación"
                disabled={hasActiveGroup}
            >
                <XMarkIcon className="h-5 w-5" />
                Rechazar
            </button>
        </div>
    );
}