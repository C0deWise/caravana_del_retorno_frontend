import { Tag } from "@/components/common/Tag";

const STATUS_CONFIG: Partial<Record<
  string,
  { label: string; className: string }
>> = {
  expirada: {
    label: "Expirada",
    className: "bg-text-muted/15 text-text-muted",
  },
  pendiente: {
    label: "Pendiente",
    className: "bg-secondary/15 text-secondary",
  },
  rechazada: {
    label: "Rechazada",
    className: "bg-accent-red/15 text-accent-red",
  },
  aceptada: {
    label: "Aceptada",
    className: "bg-accent-green/20 text-accent-green",
  },
};

interface StatusTagProps {
  readonly status: string;
}

export function StatusTag({ status }: StatusTagProps) {
  const config = STATUS_CONFIG[status];

  if (!config) return null;

  return <Tag label={config.label} className={config.className} />;
}

