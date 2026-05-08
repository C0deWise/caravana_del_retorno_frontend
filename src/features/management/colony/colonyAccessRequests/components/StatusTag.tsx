import type { AccessRequestStatus } from "../types/access-request.types";
import { Tag } from "@/components/common/Tag";

const STATUS_CONFIG: Record<
  AccessRequestStatus,
  { label: string; className: string }
> = {
  expirada: {
    label: "Expirada",
    className: "bg-text-muted/15 text-text-muted",
  },
  pendiente: {
    label: "Pendiente",
    className: "bg-secondary/15 text-secondary",
  },
};

interface StatusTagProps {
  readonly status: AccessRequestStatus;
}

export function StatusTag({ status }: StatusTagProps) {
  const config = STATUS_CONFIG[status];

  if (!config) return null;

  return <Tag label={config.label} className={config.className} />;
}

