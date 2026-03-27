"use client";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import { Member } from "../types/member";
import { LoggedUserRole } from "@/features/auth/types/roles";
import { MemberCard } from "./MemberCard";

interface MemberListProps {
  members: Member[];
  userRole: LoggedUserRole;
}

export function MemberList({ members, userRole }: MemberListProps) {
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
    <div className="space-y-4">
      {members.map((member, index) => (
        <MemberCard
          key={member.id}
          member={member}
          userRole={userRole}
          index={index + 1}
        />
      ))}
    </div>
  );
}
