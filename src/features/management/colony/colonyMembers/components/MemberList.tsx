"use client";
import { AnimatedList } from "@/components/common/AnimatedList";
import { ColonyMember } from "../../types/colony-members.types";
import { UserRole } from "@/types/user.types";
import { MemberCard } from "./MemberCard";

interface MemberListProps {
  readonly members: ColonyMember[];
  readonly userRole: UserRole;
  readonly members: ColonyMember[];
  readonly userRole: UserRole;
  readonly colonyName?: string;
  readonly onRemove?: (memberId: number) => Promise<void>;
  readonly isRemoving?: boolean;
}

export function MemberList({ members, userRole }: MemberListProps) {
  export function MemberList({
    members,
    userRole,
    colonyName,
    onRemove,
    isRemoving,
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
          <p className="text-text-muted">Esta colonia no tiene miembros aun.</p>
        </div>
      );
    }

    return (
    <AnimatedList
      items={members}
      keyExtractor={(member) => member.id}
      renderItem={(member, index) => (
        <MemberCard member={member} userRole={userRole} index={index} />
      )}
      emptyMessage="Esta colonia no tiene miembros aún."
    />
    <div className="space-y-4">
      {members.map((member, index) => (
        <MemberCard
          key={member.id}
          member={member}
          userRole={userRole}
          index={index + 1}
          colonyName={colonyName}
          onRemove={onRemove}
          isRemoving={isRemoving}
        />
      ))}
    </div>
    );
  }
