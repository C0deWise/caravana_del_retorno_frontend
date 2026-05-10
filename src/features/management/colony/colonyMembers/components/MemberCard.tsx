"use client";

import { UserIcon } from "@heroicons/react/24/solid";
import ListCard from "@/components/common/ListCard";
import { MarqueeText } from "@/components/common/MarqueeText";
import { ColonyMember } from "../types/colony-members.types";
import { UserRole } from "@/types/user.types";
import { getVisibleMemberData } from "../utils/rolePermissions";
import { RoleTag } from "./RoleTag";
import { MemberActions } from "./MemberActions";

interface MemberCardProps {
  readonly member: ColonyMember;
  readonly userRole: UserRole;
  readonly index: number;
}

export function MemberCard({ member, userRole, index }: MemberCardProps) {
  const visibleData = getVisibleMemberData(member, userRole);

  const fullName =
    `${visibleData.nombre || ""} ${visibleData.apellido || ""}`.trim() ||
    "Sin nombre";

  const avatarContent =
    visibleData.nombre || visibleData.apellido ? (
      <span className="text-xl font-bold text-white">
        {visibleData.nombre?.charAt(0).toUpperCase()}
        {visibleData.apellido?.charAt(0).toUpperCase()}
      </span>
    ) : (
      <UserIcon className="h-7 w-7 text-white" />
    );

  return (
    <ListCard
      index={index}
      icon={avatarContent}
      title={<MarqueeText text={fullName} className="w-full" />}
      subtitle={<RoleTag roleId={member.role} />}
      actions={<MemberActions visibleData={visibleData} userRole={userRole} />}
    />
  );
}
