"use client";
import { useState } from "react";
import {
  PhoneIcon,
  CakeIcon,
  IdentificationIcon,
  UserIcon,
  EnvelopeIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { ColonyMember } from "../types/colony-members.types";
import { UserRole, CODE_TO_ROLE } from "@/types/user.types";
import { getVisibleMemberData } from "../utils/rolePermissions";
import calculateAge from "@/utils/calculateAge";
import { ConfirmModal } from "@/components/confirmModal";

interface MemberCardProps {
  readonly member: ColonyMember;
  readonly userRole: UserRole;
  readonly index: number;
  readonly colonyName?: string;
  readonly onRemove?: (memberId: number) => Promise<void>;
  readonly isRemoving?: boolean;
}

function getRoleConfig(roleId: number) {
  const roleCode = CODE_TO_ROLE[roleId as keyof typeof CODE_TO_ROLE];

  if (roleCode === "admin")
    return { label: "Admin", badgeClass: "bg-accent-red text-text-inverse" };
  if (roleCode === "lider_colonia")
    return {
      label: "Líder de colonia",
      badgeClass: "bg-secondary/85 text-text-inverse",
    };
  if (roleCode === "usuario") {
    return {
      label: "Usuario",
      badgeClass: "bg-accent-green/20 text-accent-green",
    };
  }

  return {
    label: "Invitado",
    badgeClass: "bg-gray-200 text-text-muted",
  };
}

export function MemberCard({
  member,
  userRole,
  index,
  colonyName,
  onRemove,
  isRemoving = false,
}: MemberCardProps) {
  const visibleData = getVisibleMemberData(member, userRole);
  const { label, badgeClass } = getRoleConfig(member.role);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const canRemove = userRole === "lider_colonia" && !!onRemove;

  const handleConfirmRemove = async () => {
    if (!onRemove) return;
    await onRemove(member.id);
  };

  return (
    <>
      <div className="bg-bg border border-gray-100 rounded-4xl px-5 py-4 shadow-sm">
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
            <button
              type="button"
              disabled={!visibleData.correo}
              onClick={() =>
                visibleData.correo &&
                navigator.clipboard.writeText(visibleData.correo)
              }
              className={`group flex items-center space-x-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-lg px-2 -mx-2 ${visibleData.correo ? "cursor-pointer" : "cursor-default"}`}
              title={visibleData.correo ? "Copiar correo" : undefined}
            >
              <EnvelopeIcon
                className={`w-5 h-5 shrink-0 transition-colors ${visibleData.correo ? "text-text-muted group-hover:text-primary group-focus:text-primary" : "text-text-muted"}`}
              />
              <span
                className={`transition-colors ${visibleData.correo ? "group-hover:text-primary group-focus:text-primary" : ""}`}
              >
                {visibleData.correo || "—"}
              </span>
            </button>

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

            {canRemove && (
              <button
                type="button"
                onClick={() => setShowConfirmModal(true)}
                disabled={isRemoving}
                aria-label={`Eliminar a ${visibleData.nombre} ${visibleData.apellido}`}
                className="flex items-center space-x-1.5 text-danger hover:text-danger/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-2 cursor-pointer"
              >
                <TrashIcon className="w-5 h-5 shrink-0" />
                <span className="text-sm font-medium">Eliminar</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {canRemove && (
        <ConfirmModal
          isOpen={showConfirmModal}
          title="¿Eliminar miembro de la colonia?"
          details={[
            <>
              ¿Está seguro de eliminar a{" "}
              <span className="font-bold">
                {visibleData.nombre} {visibleData.apellido}
              </span>{" "}
              de la colonia en <span className="font-bold">{colonyName}</span>?
            </>,
          ]}
          confirmLabel="Eliminar"
          cancelLabel="Cancelar"
          onConfirm={handleConfirmRemove}
          onCancel={() => setShowConfirmModal(false)}
          loading={isRemoving}
        />
      )}
    </>
  );
}
