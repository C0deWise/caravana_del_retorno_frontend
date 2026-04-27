import { Tag } from "@/components/common/Tag";

interface RelationshipStatusTagProps {
  readonly status: string;
}

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  aceptada: {
    label: "Aceptada",
    className: "bg-accent-green/20 text-accent-green",
  },
  rechazada: {
    label: "Rechazada",
    className: "bg-accent-red/15 text-accent-red",
  },
  expirada: {
    label: "Expirada",
    className: "bg-text-muted/15 text-text-muted",
  },
  pendiente: {
    label: "Pendiente",
    className: "bg-secondary/15 text-secondary",
  },
};

export function RelationshipStatusTag({ status }: RelationshipStatusTagProps) {
  const normalizedStatus = status.trim().toLowerCase();
  const config = STATUS_CONFIG[normalizedStatus] || STATUS_CONFIG.pendiente;

  return <Tag label={config.label} className={config.className} />;
}

