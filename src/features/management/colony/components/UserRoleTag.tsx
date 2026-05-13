import { ConfiguredTag, TagConfigRecord } from "@/components/common/Tag";
import { CODE_TO_ROLE } from "@/types/user.types";

interface UserRoleTagProps {
  readonly roleId: number;
}

const ROLE_CONFIG: TagConfigRecord<string> = {
  admin: {
    label: "Admin",
    color: "accent-red",
  },
  lider_colonia: {
    label: "Líder de colonia",
    color: "secondary",
  },
  usuario: {
    label: "Usuario",
    color: "accent-green",
  },
  Invitado: {
    label: "Invitado",
    color: "accent-yellow",
  },
};

export function UserRoleTag({ roleId }: UserRoleTagProps) {
  return <ConfiguredTag value={CODE_TO_ROLE[roleId]} config={ROLE_CONFIG} defaultKey="Invitado" />;
}
