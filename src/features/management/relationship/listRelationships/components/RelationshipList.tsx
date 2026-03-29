"use client";

import { UserGroupIcon } from "@heroicons/react/24/outline";
import { RelationshipItem } from "../types/relationship.type";
import { RelationshipCard } from "./RelationshipCard";

interface RelationshipListProps {
  relationships: RelationshipItem[];
  targetUserId: number;
}

export function RelationshipList({
  relationships,
  targetUserId,
}: RelationshipListProps) {
  if (relationships.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-24 h-24 mx-auto mb-4 bg-bg-card rounded-4xl flex items-center justify-center">
          <UserGroupIcon className="w-12 h-12 text-text-muted" />
        </div>
        <h3 className="text-xl font-bold text-text mb-2">
          No se encontraron relaciones
        </h3>
        <p className="text-text-muted">Todavía no has establecido relaciones</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {relationships.map((relationship, index) => (
        <RelationshipCard
          key={relationship.codigo}
          relationship={relationship}
          index={index}
          targetUserId={targetUserId}
        />
      ))}
    </div>
  );
}
