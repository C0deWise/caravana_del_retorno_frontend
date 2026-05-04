import { AnimatedList } from "@/components/common/AnimatedList";
import type { AccessRequest } from "../types/access-request.types";
import { AccessRequestCard } from "./AccessRequestCard";

interface RequestListProps {
  readonly onApprove: (requestId: number) => void;
  readonly onReject: (requestId: number) => void;
  readonly requests: AccessRequest[];
}

export function RequestList({
  onApprove,
  onReject,
  requests,
}: RequestListProps) {
  const sortedRequests = [...requests].sort((a, b) => {
    if (a.isPending === b.isPending) {
      return 0;
    }
    return a.isPending ? -1 : 1;
  });

  return (
    <AnimatedList
      items={sortedRequests}
      keyExtractor={(request) => request.id}
      renderItem={(request, index) => (
        <AccessRequestCard
          index={index}
          request={request}
          onApprove={onApprove}
          onReject={onReject}
        />
      )}
      emptyMessage="No hay solicitudes de acceso pendientes para esta colonia."
    />
  );
}
