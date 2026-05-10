"use client";

import {
  PhoneIcon,
  CakeIcon,
  IdentificationIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/solid";
import { UserRole } from "@/types/user.types";
import { ColonyMember } from "../types/colony-members.types";
import { calculateAge } from "@/utils/formatting";
import { CopyableAction } from "@/components/common/CopyableAction";

interface MemberActionsProps {
  readonly visibleData: Partial<ColonyMember>;
  readonly userRole: UserRole;
}

export function MemberActions({ visibleData, userRole }: MemberActionsProps) {
  const documentLabel = [visibleData.tipo_doc, visibleData.documento]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="flex flex-col gap-4 text-sm text-text-muted sm:flex-row">
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
  );
}
