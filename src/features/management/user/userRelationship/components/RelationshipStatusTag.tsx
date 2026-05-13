import { ConfiguredTag, TagConfigRecord } from "@/components/common/Tag";

interface RelationshipStatusTagProps {
  readonly status: string;
}

const STATUS_CONFIG: TagConfigRecord<string> = {
  expirada: {
    label: "Expirada",
    color: "muted",
  },
  pendiente: {
    label: "Pendiente",
    color: "accent-yellow",
  },
};

export function RelationshipStatusTag({ status }: RelationshipStatusTagProps) {
  return <ConfiguredTag value={status} config={STATUS_CONFIG} defaultKey="pendiente" />;
}

