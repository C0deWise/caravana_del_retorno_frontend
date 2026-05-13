"use client";

import { UserIcon } from "@heroicons/react/24/outline";
import type { RelationshipItem } from "../types/relationship.type";
import ListCard from "@/components/common/ListCard";

interface RelationshipCardProps {
  readonly relationship: RelationshipItem;
  readonly index: number;
  readonly targetUserId: number;
  readonly onApprove?: (relationshipId: string) => void;
  readonly onReject?: (relationshipId: string) => void;
}

import { RelationshipStatusTag } from "./RelationshipStatusTag";
import { RelationshipActions } from "./RelationshipActions";

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

  const isRecipient = relatedUser.id === targetUserId;
  const showActions = isPending && isRecipient;

  return (
    <ListCard
      index={index}
      showIndex={false}
      icon={<UserIcon className="h-6 w-6 text-white" />}
      badgeConfig={{title: "Pendiente", show: isPending && showActions, color: "bg-accent-yellow"}}
      title={displayUserName}
      subtitle={
        <div className="flex flex-wrap items-center gap-6 text-sm">
          <span className="inline-flex items-center gap-1 text-text-muted">
            Parentesco:{" "}
            <span className="font-medium text-text">
              {relationshipType}
            </span>
          </span>

          {normalizedStatus !== "aceptada" && (
            <span className="inline-flex items-center gap-1 text-text-muted">
              Estado: <RelationshipStatusTag status={normalizedStatus} />
            </span>
          )}
        </div>
      }
      actions={
        <RelationshipActions
          showActions={showActions}
          isPending={isPending}
          codigo={codigo}
          displayUserName={displayUserName}
          onApprove={onApprove}
          onReject={onReject}
        />
      }
    />
  );
}
