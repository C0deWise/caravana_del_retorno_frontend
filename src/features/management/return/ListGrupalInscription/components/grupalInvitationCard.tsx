"use client";

import {
  CheckIcon,
  XMarkIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import type { GrupalInvitation } from "../types/grupalInscription.types";

interface GrupalInvitationCardProps {
  readonly invitation: GrupalInvitation;
  readonly onAccept: (invitationId: number) => void;
  readonly onReject: (invitationId: number) => void;
  /** Bloquea las acciones cuando el usuario ya aceptó otra invitación */
  readonly hasActiveGroup: boolean;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; badgeClass: string }
> = {
  aprobado: {
    label: "Aceptada",
    badgeClass: "bg-accent-green/20 text-accent-green",
  },
  rechazado: {
    label: "Rechazada",
    badgeClass: "bg-accent-red/15 text-accent-red",
  },
  expirado: {
    label: "Invitación vencida",
    badgeClass: "bg-text-muted/15 text-text-muted",
  },
  pendiente: {
    label: "Pendiente",
    badgeClass: "bg-secondary/15 text-secondary",
  },
};

const formatDate = (dateString: string) => {
  if (!dateString) return "—";

  return new Date(dateString).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

export function GrupalInvitationCard({
  invitation,
  onAccept,
  onReject,
  hasActiveGroup,
}: GrupalInvitationCardProps) {
  const normalized = invitation.status.trim().toLowerCase();
  const { label, badgeClass } =
    STATUS_CONFIG[normalized] ?? STATUS_CONFIG["pendiente"];

  const showActions = invitation.isPending && !hasActiveGroup;

  return (
    <div
      className={`rounded-4xl border p-6 shadow-sm ${
        invitation.isPending
          ? "border-gray-100 bg-bg"
          : "border-gray-200 bg-bg-card"
      }`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* ── Ícono + datos ─────────────────────────────────── */}
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-linear-to-tl from-primary/90 to-secondary/90 shadow-md">
            <UserGroupIcon className="h-6 w-6 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-xl font-bold text-text">
                {invitation.leaderFullName}
              </h3>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}
              >
                {label}
              </span>
            </div>

            <p className="mt-1 text-sm font-medium text-primary">
              Retorno: {formatDate(invitation.returnDate)}
            </p>

            {invitation.confirmedParticipants.length > 0 && (
              <ul className="mt-2 space-y-0.5">
                {invitation.confirmedParticipants.map((p) => (
                  <li key={p.userId} className="text-sm text-text-muted">
                    • {p.fullName}
                  </li>
                ))}
              </ul>
            )}

            <p className="mt-2 text-xs text-text-muted">
              Recibida el {formatDate(invitation.timestamp)}
            </p>
          </div>
        </div>

        {/* ── Acciones ──────────────────────────────────────── */}
        {invitation.isPending && (
          <div className="flex shrink-0 items-center gap-2">
            {showActions ? (
              <>
                <button
                  type="button"
                  onClick={() => onAccept(invitation.id)}
                  className="inline-flex items-center gap-2 rounded-xl bg-accent-green/15 px-3 py-2 text-sm font-medium text-accent-green transition-colors hover:bg-accent-green/25"
                  aria-label={`Aceptar invitación de ${invitation.leaderFullName}`}
                >
                  <CheckIcon className="h-5 w-5" />
                  Aceptar
                </button>

                <button
                  type="button"
                  onClick={() => onReject(invitation.id)}
                  className="inline-flex items-center gap-2 rounded-xl bg-accent-red/10 px-3 py-2 text-sm font-medium text-accent-red transition-colors hover:bg-accent-red/20"
                  aria-label={`Rechazar invitación de ${invitation.leaderFullName}`}
                >
                  <XMarkIcon className="h-5 w-5" />
                  Rechazar
                </button>
              </>
            ) : (
              <span className="text-xs text-text-muted italic">
                Ya perteneces a un grupo
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
