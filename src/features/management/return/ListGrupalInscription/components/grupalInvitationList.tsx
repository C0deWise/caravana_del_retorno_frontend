"use client";

import { useMemo } from "react";
import type { GrupalInvitation } from "../types/grupalInscription.types";
import { GrupalInvitationCard } from "./grupalInvitationCard";

interface GrupalInvitationListProps {
  readonly invitations: GrupalInvitation[];
  readonly onAccept: (invitationId: number) => void;
  readonly onReject: (invitationId: number) => void;
  readonly hasActiveGroup: boolean;
}

export function GrupalInvitationList({
  invitations,
  onAccept,
  onReject,
  hasActiveGroup,
}: GrupalInvitationListProps) {
  // Pendientes primero, luego por timestamp descendente
  const sorted = useMemo(() => {
    return [...invitations].sort((a, b) => {
      if (a.isPending !== b.isPending) return a.isPending ? -1 : 1;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }, [invitations]);

  return (
    <div className="space-y-4">
      {sorted.map((invitation) => (
        <GrupalInvitationCard
          key={invitation.id}
          invitation={invitation}
          onAccept={onAccept}
          onReject={onReject}
          hasActiveGroup={hasActiveGroup}
        />
      ))}
    </div>
  );
}
