"use client";

import { useMemo } from "react";
import type { AccessRequest } from "../types/access-request.types";
import { RequestsCard } from "./RequestsCard";

interface RequestListProps {
  onApprove: (requestId: number) => void;
  onReject: (requestId: number) => void;
  requests: AccessRequest[];
}

export function RequestList({
  onApprove,
  onReject,
  requests,
}: RequestListProps) {
  const sortedRequests = useMemo(() => {
    return [...requests].sort((a, b) => {
      if (a.isPending === b.isPending) {
        return 0;
      }

      return a.isPending ? -1 : 1;
    });
  }, [requests]);

  return (
    <div className="space-y-4">
      {sortedRequests.map((request) => (
        <RequestsCard
          key={request.id}
          request={request}
          onApprove={onApprove}
          onReject={onReject}
        />
      ))}
    </div>
  );
}
