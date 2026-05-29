"use client";

import type { GrupalInvitation } from "../types/grupalInscription.types";
import { AnimatedList } from "@/components/common/AnimatedList";
import { GrupalInvitationCard } from "./grupalInvitationCard";

interface GrupalInvitationListProps {
  readonly onAccept: (invitationId: number) => void;
  readonly onReject: (invitationId: number) => void;
  readonly invitations: GrupalInvitation[];
  readonly hasActiveGroup: boolean;
}

export function GrupalInvitationList({
  onAccept,
  onReject,
  invitations,
  hasActiveGroup,
}: GrupalInvitationListProps) {

  const sortedInvitations = [ ...invitations].sort((a, b) => {
    if (a.isPending === b.isPending) {
      return 0;
    }
    return a.isPending ? -1 : 1;
  });

  return (
    <AnimatedList
      items={sortedInvitations}
      keyExtractor={(invitation) => invitation.id}
      renderItem={(invitation, index) => (
        <GrupalInvitationCard
          index={index}
          invitation={invitation}
          onAccept={onAccept}
          onReject={onReject}
          hasActiveGroup={hasActiveGroup}
        />
      )}
      emptyMessage={"No tienes invitaciones pendientes para inscribirte en un grupo."}
    />
  );
}
    
