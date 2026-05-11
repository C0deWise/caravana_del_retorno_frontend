"use client";

import { UserGroupIcon } from "@heroicons/react/24/outline";
import { AnimatedList } from "@/components/common/AnimatedList";
import { ColonyMember } from "../../types/colony-members.types";
import { UserRole } from "@/types/user.types";
import { MemberCard } from "./MemberCard";

interface MemberListProps {
  readonly members: ColonyMember[];
  readonly userRole: UserRole;
  readonly colonyName?: string;
  readonly onRemove?: (memberId: number) => Promise<void>;
  readonly isRemoving?: boolean;
  readonly currentUserId?: number;
}


export function MemberList({
  members,
  userRole,
  colonyName,
  onRemove,
  isRemoving,
  currentUserId,
}: MemberListProps) {

  if (members.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-24 h-24 mx-auto mb-4 bg-bg-card rounded-4xl flex items-center justify-center">
          <UserGroupIcon className="w-12 h-12 text-text-muted" />
        </div>
        <h3 className="text-xl font-bold text-text mb-2">
          No se encontraron miembros
        </h3>
        <p className="text-text-muted">Esta colonia no tiene miembros aún.</p>
      </div>
    );
  }

  return (
    <AnimatedList
      items={members}
      keyExtractor={(member) => member.id}
      renderItem={(member, index) => (
        <MemberCard
          member={member}
          userRole={userRole}
          index={index}
          colonyName={colonyName}
          onRemove={onRemove}
          isRemoving={isRemoving}
          currentUserId={currentUserId}
        />

      )}
      emptyMessage="Esta colonia no tiene miembros aún."
    />
  );
}
