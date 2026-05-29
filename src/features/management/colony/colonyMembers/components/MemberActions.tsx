"use client";

import {
  PhoneIcon,
  CakeIcon,
  IdentificationIcon,
  EnvelopeIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { UserRole } from "@/types/user.types";
import { ColonyMember } from "../../types/colony-members.types";
import { calculateAge } from "@/utils/formatting";
import { CopyableAction } from "@/components/common/CopyableAction";

interface MemberActionsProps {
  readonly visibleData: Partial<ColonyMember>;
  readonly userRole: UserRole;
  readonly onRemove?: () => void;
  readonly isRemoving?: boolean;
}

export function MemberActions({
  visibleData,
  userRole,
  onRemove,
  isRemoving = false,
}: MemberActionsProps) {
  const documentLabel = [visibleData.tipo_doc, visibleData.documento]
    .filter(Boolean)
    .join(" ");

  const canRemove = userRole === "lider_colonia" && !!onRemove;

  return (
    <div className="flex flex-col gap-4 text-sm text-text-muted sm:flex-row items-center w-full">
      <div className="flex flex-col gap-4 sm:flex-row flex-1">
        <CopyableAction
          icon={EnvelopeIcon}
          valueToCopy={visibleData.correo}
          title="Copiar correo"
          className="min-w-0"
        >
          {visibleData.correo ?? "—"}
        </CopyableAction>

        {userRole !== "usuario" && (
          <CopyableAction
            icon={PhoneIcon}
            valueToCopy={visibleData.celular}
            title="Copiar teléfono"
            className="min-w-0"
          >
            {visibleData.celular ?? "—"}
          </CopyableAction>
        )}

        {userRole !== "usuario" && (
          <CopyableAction
            icon={CakeIcon}
            valueToCopy={visibleData.fecha_nacimiento}
            title="Copiar fecha de nacimiento"
            className="min-w-0"
          >
            {visibleData.fecha_nacimiento
              ? `${calculateAge(visibleData.fecha_nacimiento)} años`
              : "—"}
          </CopyableAction>
        )}

        {userRole !== "usuario" && visibleData.documento && (
          <CopyableAction
            icon={IdentificationIcon}
            valueToCopy={documentLabel}
            title="Copiar documento"
            className="min-w-0"
          >
            {documentLabel}
          </CopyableAction>
        )}
      </div>

      {canRemove && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            disabled={isRemoving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-red text-white hover:bg-accent-red/90 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm ml-4"
            title="Eliminar miembro"
          >
            <TrashIcon className="w-4 h-4 shrink-0" />
            <span className="font-bold">Eliminar</span>
          </button>
        </div>
      )}
    </div>
  );
}
