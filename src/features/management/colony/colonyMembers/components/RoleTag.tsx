import { Tag } from "@/components/common/Tag";
import { CODE_TO_ROLE } from "@/types/user.types";

interface RoleTagProps {
  readonly roleId: number;
}

const ROLE_CONFIG: Record<string, { label: string; className: string }> = {
  admin: {
    label: "Admin",
    className: "bg-accent-red text-text-inverse",
  },
  lider_colonia: {
    label: "Líder de colonia",
    className: "bg-secondary/85 text-text-inverse",
  },
  usuario: {
    label: "Usuario",
    className: "bg-accent-green/20 text-accent-green",
  },
  guest: {
    label: "Invitado",
    className: "bg-gray-200 text-text-muted",
  },
};

export function RoleTag({ roleId }: RoleTagProps) {
  const roleCode = CODE_TO_ROLE[roleId as keyof typeof CODE_TO_ROLE] || "guest";
  const config = ROLE_CONFIG[roleCode];

  return <Tag label={config.label} className={config.className} />;
}

