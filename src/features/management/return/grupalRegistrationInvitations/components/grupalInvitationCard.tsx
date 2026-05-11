"use client";

import {
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import type { GrupalInvitation } from "../types/grupalInscription.types";
import ListCard from "@/components/common/ListCard";
import { StatusTag } from "@/components/common/StatusTag";
import { GrupalInvitationActions } from "./GrupalInvitationActions";

interface GrupalInvitationCardProps {
  readonly invitation: GrupalInvitation;
  readonly index: number;
  readonly onAccept: (invitationId: number) => void;
  readonly onReject: (invitationId: number) => void;
  /** Bloquea las acciones cuando el usuario ya aceptó otra invitación */
  readonly hasActiveGroup: boolean;
}

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
  index,
  onAccept,
  onReject,
  hasActiveGroup,
}: GrupalInvitationCardProps) {
  return (
    <ListCard
      index={index}
      icon={<UserGroupIcon className="h-6 w-6 text-white" />}
      badgeConfig={{
        show: invitation.isPending,
        title: "Tienes invitaciones pendientes",
        color: "bg-secondary",
      }}
      title={invitation.leaderFullName}
      subtitle={
        <div className="flex items-center gap-3">
          <span className="text-sm text-text-muted">
            Invitación recibida el {formatDate(invitation.createdAt)}
          </span>
          <StatusTag status={invitation.status}/>
        </div>
      }
      actions={
        <GrupalInvitationActions
          invitationId={invitation.id}
          isPending={invitation.isPending}
          onAccept={onAccept}
          onReject={onReject}
          hasActiveGroup={hasActiveGroup}        
        />
      }
    />
  );
}
