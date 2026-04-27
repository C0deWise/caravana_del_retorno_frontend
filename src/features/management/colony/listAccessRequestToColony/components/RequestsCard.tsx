"use client";

import { CheckIcon, XMarkIcon, BellIcon } from "@heroicons/react/24/outline";
import type { AccessRequest } from "../types/access-request.types";

interface RequestsCardProps {
  request: AccessRequest;
  onApprove: (requestId: number) => void;
  onReject: (requestId: number) => void;
}

export function RequestsCard({
  request,
  onApprove,
  onReject,
}: RequestsCardProps) {
  const normalizedStatus = request.status.trim().toLowerCase();
  const isPending = request.isPending;

  const getStatusConfig = (status: string) => {
    if (status === "aceptada") {
      return {
        label: "Aceptada",
        badgeClass: "bg-accent-green/20 text-accent-green",
      };
    }

    if (status === "rechazada") {
      return {
        label: "Rechazada",
        badgeClass: "bg-accent-red/15 text-accent-red",
      };
    }

    if (status === "expirada") {
      return {
        label: "Expirada",
        badgeClass: "bg-text-muted/15 text-text-muted",
      };
    }

    return {
      label: "Pendiente",
      badgeClass: "bg-secondary/15 text-secondary",
    };
  };

  const formatDate = (dateString: string) => {
    if (!dateString) {
      return "—";
    }

    return new Date(dateString).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  const { label, badgeClass } = getStatusConfig(normalizedStatus);

  return (
    <div
      className={`rounded-4xl border p-6 shadow-sm ${
        isPending ? "border-gray-100 bg-bg" : "border-gray-200 bg-bg-card"
      }`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-linear-to-tl from-primary/90 to-secondary/90 shadow-md">
            <BellIcon className="h-6 w-6 text-white" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-xl font-bold text-text">
                {request.fullName}
              </h3>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}
              >
                {label}
              </span>
            </div>

            <p className="mt-2 text-sm text-text-muted">
              Solicitud realizada el {formatDate(request.createdAt)}
            </p>
          </div>
        </div>

        {isPending && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onApprove(request.id)}
              className="inline-flex items-center gap-2 rounded-xl bg-accent-green/15 px-3 py-2 text-accent-green transition-colors hover:bg-accent-green/25"
              aria-label={`Aprobar solicitud de ${request.fullName}`}
            >
              <CheckIcon className="h-5 w-5" />
              Aprobar
            </button>

            <button
              type="button"
              onClick={() => onReject(request.id)}
              className="inline-flex items-center gap-2 rounded-xl bg-accent-red/10 px-3 py-2 text-accent-red transition-colors hover:bg-accent-red/20"
              aria-label={`Rechazar solicitud de ${request.fullName}`}
            >
              <XMarkIcon className="h-5 w-5" />
              Rechazar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
