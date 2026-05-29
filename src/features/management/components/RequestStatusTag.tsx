import { ConfiguredTag, TagConfigRecord } from "@/components/common/Tag";

const STATUS_CONFIG: Partial<TagConfigRecord<string>> = {
  expirada: {
    label: "Expirada",
    color: "muted",
  },
  pendiente: {
    label: "Pendiente",
    color: "secondary",
  },
  rechazada: {
    label: "Rechazada",
    color: "accent-red",
  },
  aceptada: {
    label: "Aceptada",
    color: "accent-green",
  },
};

interface RequestStatusTagProps {
  readonly status: string;
}

export function RequestStatusTag({ status }: RequestStatusTagProps) {
  return <ConfiguredTag value={status} config={STATUS_CONFIG} />;
}
