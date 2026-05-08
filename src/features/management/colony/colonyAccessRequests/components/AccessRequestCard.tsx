import { BellIcon } from "@heroicons/react/24/outline";
import ListCard from "@/components/common/ListCard";
import type { AccessRequest } from "../types/access-request.types";
import { AccessRequestActions } from "./AccessRequestActions";
import { StatusTag } from "./StatusTag";
import { formatDate } from "@/utils/formatting";

interface AccessRequestCardProps {
  readonly request: AccessRequest;
  readonly index: number;
  readonly onApprove: (requestId: number) => void;
  readonly onReject: (requestId: number) => void;
}

export function AccessRequestCard({
  request,
  index,
  onApprove,
  onReject,
}: AccessRequestCardProps) {
  return (
    <ListCard
      index={index}
      icon={<BellIcon className="h-6 w-6 text-white" />}
      badgeConfig={{
        show: request.isPending,
        title: "Solicitud pendiente",
        color: "bg-secondary",
      }}
      title={request.fullName}
      subtitle={
        <div className="flex items-center gap-3">
          <span className="text-sm text-text-muted">
            Solicitud realizada el {formatDate(request.createdAt)}
          </span>
          <StatusTag status={request.status} />
        </div>
      }
      actions={
        <AccessRequestActions
          requestId={request.id}
          isPending={request.isPending}
          onApprove={onApprove}
          onReject={onReject}
        />
      }
    />
  );
}

