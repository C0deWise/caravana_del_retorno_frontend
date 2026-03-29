"use client";
import { UserIcon } from "@heroicons/react/24/solid";
import { RelationshipItem } from "../types/relationship.type";

interface RelationshipCardProps {
  relationship: RelationshipItem;
  index: number;
  targetUserId: number;
}

export function RelationshipCard({
  relationship,
  index,
  targetUserId,
}: RelationshipCardProps) {
  const { relationshipType, status, user, relatedUser } = relationship;
  const displayUser = user.id === targetUserId ? relatedUser : user;
  const displayUserName =
    `${displayUser.nombre} ${displayUser.apellido}`.trim();
  const normalizedStatus = status.toLowerCase();
  const statusLabel =
    normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1);

  const statusStyles =
    normalizedStatus === "aceptada"
      ? "bg-accent-green/12 text-accent-green border-accent-green/30"
      : normalizedStatus === "rechazada"
        ? "bg-danger/12 text-danger border-danger/30"
        : normalizedStatus === "pendiente"
          ? "bg-secondary/12 text-secondary border-secondary/30"
          : "bg-bg-card text-text-muted border-bg-border";

  return (
    <div className="bg-bg border border-gray-100 rounded-4x1 p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <span className="text-lg font-mono text-text-muted w-6 text-center shrink-0">
            {index + 1}
          </span>
          <div className="w-14 h-14 bg-linear-to-tl from-primary/90 rounded-xl flex items-center justify-center shadow-md shrink-0">
            <UserIcon className="w-6 h-6 text-text-inverse" />
          </div>
          <div>
            <h3 className="font-bold text-xl text-text">{displayUserName}</h3>
            <p className="text-sm text-text-muted">{relationshipType}</p>
          </div>
        </div>

        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${statusStyles}`}
        >
          {statusLabel}
        </span>
      </div>
    </div>
  );
}
