"use client";
import { AnimatedList } from "@/components/common/AnimatedList";
import { ColonyMember } from "../types/colony-members.types";
import { UserRole } from "@/types/user.types";
import { MemberCard } from "./MemberCard";

interface MemberListProps {
  readonly members: ColonyMember[];
  readonly userRole: UserRole;
}

export function MemberList({ members, userRole }: MemberListProps) {
  return (
    <AnimatedList
      items={members}
      keyExtractor={(member) => member.id}
      renderItem={(member, index) => (
        <MemberCard member={member} userRole={userRole} index={index} />
      )}
      emptyMessage="Esta colonia no tiene miembros aún."
    />
  );
}
