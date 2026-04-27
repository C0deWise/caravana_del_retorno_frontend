"use client";

import { CheckIcon, UserIcon, XMarkIcon } from "@heroicons/react/24/outline";
import type { RelationshipItem } from "../types/relationship.type";

interface RelationshipCardProps {
  relationship: RelationshipItem;
  index: number;
  targetUserId: number;
  onApprove?: (relationshipId: string) => void;
  onReject?: (relationshipId: string) => void;
}

import { RelationshipStatusTag } from "./RelationshipStatusTag";

export function RelationshipCard({
  relationship,
  index,
  targetUserId,
  onApprove,
  onReject,
}: RelationshipCardProps) {
  const { codigo, relationshipType, status, user, relatedUser } = relationship;

  const displayUser = user.id === targetUserId ? relatedUser : user;
  const displayUserName =
    `${displayUser.nombre} ${displayUser.apellido}`.trim();

  const normalizedStatus = (status ?? "").trim().toLowerCase();
  const isPending = normalizedStatus === "pendiente";

  // Solo el destinatario ve los botones
  const isRecipient = relatedUser.id === targetUserId;
  const showActions = isPending && isRecipient;

  return (
    <div className="rounded-4xl border border-gray-100 bg-bg py-3 px-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <span className="w-6 shrink-0 pt-3 text-center font-mono text-lg text-text-muted">
            {index + 1}
          </span>

          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-linear-to-tl from-primary/90 to-secondary/90 shadow-md">
            <UserIcon className="h-6 w-6 text-white" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-text">{displayUserName}</h3>

            <div className="mt-2 flex flex-wrap items-center gap-6 text-sm">
              <span className="inline-flex items-center gap-1 text-text-muted">
                Parentesco:{" "}
                <span className="font-medium text-text">
                  {relationshipType}
                </span>
              </span>

              <span className="inline-flex items-center gap-1 text-text-muted">
                Estado: <RelationshipStatusTag status={normalizedStatus} />
              </span>
            </div>
          </div>
        </div>

        {showActions ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => codigo && onApprove?.(codigo)}
              className="inline-flex items-center gap-2 rounded-xl bg-accent-green/15 px-3 py-2 text-accent-green transition-colors hover:bg-accent-green/25"
              aria-label={`Aceptar solicitud de parentesco con ${displayUserName}`}
            >
              <CheckIcon className="h-5 w-5" />
              Aceptar
            </button>

            <button
              type="button"
              onClick={() => codigo && onReject?.(codigo)}
              className="inline-flex items-center gap-2 rounded-xl bg-accent-red/10 px-3 py-2 text-accent-red transition-colors hover:bg-accent-red/20"
              aria-label={`Rechazar solicitud de parentesco con ${displayUserName}`}
            >
              <XMarkIcon className="h-5 w-5" />
              Rechazar
            </button>
          </div>
        ) : (
          <p className="text-sm text-text-muted">
            {isPending
              ? "Solicitud pendiente de aprobación"
              : "Solicitud ya procesada"}
          </p>
        )}
      </div>
    </div>
  );
}
