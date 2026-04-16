"use client";
import {
  PhoneIcon,
  CakeIcon,
  IdentificationIcon,
  UserIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/solid";
import { Member } from "../types/member.types";
import { UserRole } from "@/types/user.types";
import { getVisibleMemberData } from "../utils/rolePermissions";
import calculateAge from "@/utils/calculateAge";

interface MemberCardProps {
  member: Member;
  userRole: UserRole;
  index: number;
}

function getRoleConfig(role: UserRole) {
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
            {visibleData.nombre || visibleData.apellido ? (
              <span className="text-white font-bold text-xl">
                {visibleData.nombre?.charAt(0).toUpperCase()}
                {visibleData.apellido?.charAt(0).toUpperCase()}
              </span>
            ) : (
              <UserIcon className="w-7 h-7 text-text-inverse" />
            )}
          </div>
          <div>
            <h3 className="font-bold text-xl text-text">
              {visibleData.nombre} {visibleData.apellido}
            </h3>
            <span
              className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full mt-1 ${badgeClass}`}
            >
              {label}
            </span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 text-sm text-text-muted">
          <div
            className={`group flex items-center space-x-2 ${visibleData.correo ? "cursor-pointer" : ""}`}
            onClick={() =>
              visibleData.correo &&
              navigator.clipboard.writeText(visibleData.correo)
            }
            title={visibleData.correo ? "Copiar correo" : undefined}
          >
            <EnvelopeIcon
              className={`w-5 h-5 shrink-0 transition-colors ${visibleData.correo ? "text-text-muted group-hover:text-primary" : "text-text-muted"}`}
            />
            <span
              className={`transition-colors ${visibleData.correo ? "group-hover:text-primary" : ""}`}
            >
              {visibleData.correo || "—"}
            </span>
          </div>

          {userRole !== "usuario" && (
            <div className="flex items-center space-x-2">
              <PhoneIcon className="w-5 h-5 text-text-muted shrink-0" />
              <span>{visibleData.celular || "—"}</span>
            </div>
          )}

          {userRole !== "usuario" && (
            <div className="flex items-center space-x-2">
              <CakeIcon className="w-5 h-5 text-text-muted shrink-0" />
              <span>
                {visibleData.fecha_nacimiento
                  ? `${calculateAge(visibleData.fecha_nacimiento)} años`
                  : "—"}
              </span>
            </div>
          )}

          {userRole !== "usuario" && visibleData.documento && (
            <div className="flex items-center space-x-2">
              <IdentificationIcon className="w-5 h-5 text-text-muted shrink-0" />
              <span>
                {visibleData.tipo_doc} {visibleData.documento}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
