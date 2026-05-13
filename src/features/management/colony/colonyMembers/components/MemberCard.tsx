"use client";

import { useState } from "react";
import { UserIcon } from "@heroicons/react/24/solid";
import ListCard from "@/components/common/ListCard";
import { MarqueeText } from "@/components/common/MarqueeText";
import { ColonyMember } from "../../types/colony-members.types";
import { UserRole } from "@/types/user.types";
import { getVisibleMemberData } from "../utils/rolePermissions";
import { UserRoleTag } from "@/features/management/colony/components/UserRoleTag";
import { MemberActions } from "./MemberActions";
import { ConfirmModal } from "@/components/feedback/confirmModal";

interface MemberCardProps {
  readonly member: ColonyMember;
  readonly userRole: UserRole;
  readonly index: number;
  readonly colonyName?: string;
  readonly onRemove?: (memberId: number) => Promise<void>;
  readonly isRemoving?: boolean;
  readonly currentUserId?: number;
}


export function MemberCard({
  member,
  userRole,
  index,
  colonyName,
  onRemove,
  isRemoving = false,
  currentUserId,
}: MemberCardProps) {

  const [showConfirmModal, setShowConfirmModal] = useState(false);
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

  const isCurrentUser = member.id === currentUserId;
  const canRemove = userRole === "lider_colonia" && !!onRemove && !isCurrentUser;


  const handleConfirmRemove = async () => {
    if (!onRemove) return;
    await onRemove(member.id);
    setShowConfirmModal(false);
  };

  return (
    <>
      <ListCard
        index={index}
        icon={avatarContent}
        title={<MarqueeText text={fullName} className="w-full" />}
        subtitle={<UserRoleTag roleId={member.role} />}
        actions={
          <MemberActions
            visibleData={visibleData}
            userRole={userRole}
            onRemove={canRemove ? () => setShowConfirmModal(true) : undefined}
            isRemoving={isRemoving}
          />
        }
      />

      {canRemove && (
        <ConfirmModal
          isOpen={showConfirmModal}
          title="¿Eliminar miembro de la colonia?"
          details={[
            <>
              ¿Está seguro de eliminar a{" "}
              <span className="font-bold">{fullName}</span>
              {" de la colonia en "}
              <span className="font-bold">{colonyName || "esta ubicación"}</span>?
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
