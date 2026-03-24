"use client";
import {
  PhoneIcon,
  CakeIcon,
  IdentificationIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import { Member } from "../types/member.types";
import { LoggedUserRole } from "@/features/auth/types/roles";
import { getVisibleMemberData } from "../utils/rolePermissions";

interface MemberCardProps {
  member: Member;
  userRole: LoggedUserRole;
  index: number;
}

function getRoleConfig(role: LoggedUserRole) {
  if (role === "admin")
    return { label: "Admin", badgeClass: "bg-accent-red text-text-inverse" };
  if (role === "lider_colonia")
    return {
      label: "Líder de colonia",
      badgeClass: "bg-secondary/85 text-text-inverse",
    };
  return {
    label: "Usuario",
    badgeClass: "bg-accent-green/20 text-accent-green",
  };
}

export function MemberCard({ member, userRole, index }: MemberCardProps) {
  const visibleData = getVisibleMemberData(member, userRole);
  const { label, badgeClass } = getRoleConfig(member.role);

  return (
    <div className="bg-bg border border-gray-100 rounded-4xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <span className="text-lg font-mono text-text-muted w-6 text-center shrink-0">
            {index}
          </span>
          <div className="w-14 h-14 bg-linear-to-tl from-primary/90 to-secondary/90 rounded-xl flex items-center justify-center shadow-md shrink-0">
            {visibleData.firstName || visibleData.lastName ? (
              <span className="text-white font-bold text-xl">
                {visibleData.firstName?.charAt(0).toUpperCase()}
                {visibleData.lastName?.charAt(0).toUpperCase()}
              </span>
            ) : (
              <UserIcon className="w-7 h-7 text-text-inverse" />
            )}
          </div>
          <div>
            <h3 className="font-bold text-xl text-text">
              {visibleData.firstName} {visibleData.lastName}
            </h3>
            <span
              className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full mt-1 ${badgeClass}`}
            >
              {label}
            </span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 text-sm text-text-muted">
          <div className="flex items-center space-x-2">
            <PhoneIcon className="w-5 h-5 text-text-muted shrink-0" />
            <span>{visibleData.phone || "—"}</span>
          </div>

          {userRole !== "usuario" && (
            <div className="flex items-center space-x-2">
              <CakeIcon className="w-5 h-5 text-text-muted shrink-0" />
              <span>{visibleData.birthDate || "—"}</span>
            </div>
          )}

          {userRole !== "usuario" && visibleData.documentNumber && (
            <div className="flex items-center space-x-2">
              <IdentificationIcon className="w-5 h-5 text-text-muted shrink-0" />
              <span>
                {visibleData.documentType} {visibleData.documentNumber}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
