"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/auth/context/AuthContext";
import { RequireAuth } from "@/auth/components/RequireAuth";
import { ConfirmModal } from "@/components/feedback/confirmModal";
import { useListColonies } from "../../hooks/useListColonies";
import { useListAccessRequests } from "../hooks/useListAccessRequest";
import { useAcceptAccessRequest } from "../hooks/useAcceptAccessRequest";
import { useRejectAccessRequest } from "../hooks/useRejectAccessRequest";
import { RequestList } from "./RequestList";
import Spinner from "@/components/feedback/Spinner";
import { formatColonyLabel } from "../utils/formatters";
import type { AccessRequest } from "../types/access-request.types";

type PendingAction = "approve" | "reject" | null;

export default function AccessRequests() {
  const { user } = useAuth();
  const targetColonyId = user?.codigo_colonia ?? null;

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<AccessRequest | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  const { listColonies, colonies, loading: isLoadingColonies } = useListColonies();
  const { requests, isLoading, error, refetch, removeRequestLocally, totalRequests } = useListAccessRequests(targetColonyId);
  const { acceptRequest, isAccepting, error: acceptError, reset: resetAccept } = useAcceptAccessRequest();
  const { rejectRequest, isRejecting, error: rejectError, reset: resetReject } = useRejectAccessRequest();

  useEffect(() => {
    void listColonies();
  }, [listColonies]);

  const leaderColony = user?.codigo_colonia
    ? colonies.find((item) => item.codigo === user.codigo_colonia) ?? null
    : null;

  const handleApprove = useCallback((requestId: number) => {
    const request = requests.find((item) => item.id === requestId);
    if (!request) return;
    setSelectedRequest(request);
    setPendingAction("approve");
    setShowConfirmModal(true);
  }, [requests]);

  const handleReject = useCallback((requestId: number) => {
    const request = requests.find((item) => item.id === requestId);
    if (!request) return;
    setSelectedRequest(request);
    setPendingAction("reject");
    setShowConfirmModal(true);
  }, [requests]);

  const handleModalConfirm = useCallback(async () => {
    if (!selectedRequest || !pendingAction) return;
    if (pendingAction === "approve") {
      await acceptRequest(selectedRequest.id);
    } else {
      await rejectRequest(selectedRequest.id);
    }
    removeRequestLocally(selectedRequest.id);
    resetAccept();
    resetReject();
    setShowConfirmModal(false);
    setSelectedRequest(null);
    setPendingAction(null);
  }, [selectedRequest, pendingAction, acceptRequest, rejectRequest, removeRequestLocally, resetAccept, resetReject]);

  const colonyLabel = leaderColony ? formatColonyLabel(leaderColony) : `Colonia ${targetColonyId}`;
  const hasActionError = acceptError || rejectError;
  const isProcessingAction = isAccepting || isRejecting;

  return (
    <RequireAuth roles={["lider_colonia"]}>
      <div className="flex flex-col w-full min-h-screen">
        <header className="sticky top-0 z-10 mx-10 rounded-xl bg-bg-card px-8 py-4 shadow-xl">
          <div className="flex items-end justify-between gap-6">
            <div>
              <span className="text-sm font-medium text-text-muted uppercase tracking-wide mb-1 block">
                Solicitudes de ingreso
              </span>
              <h1 className="text-3xl font-bold text-primary leading-none">
                {isLoadingColonies && targetColonyId ? "Cargando ubicación..." : colonyLabel}
              </h1>
            </div>

            <div className="text-right">
              <span className="text-sm font-medium text-text-muted uppercase tracking-wide mb-1 block">
                Solicitudes
              </span>
              <span className="text-3xl font-bold text-secondary leading-none block">
                {targetColonyId ? totalRequests : "-"}
              </span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto space-y-8 pb-8 md:pb-10 pt-4">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-3 text-primary">
                <Spinner size="sm" />
                <span className="font-medium">Cargando solicitudes...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="mx-auto max-w-3xl rounded-xl border border-bg-border bg-bg-card p-6">
              <p className="text-sm text-text-muted">{error}</p>
              <button
                onClick={() => void refetch()}
                className="mt-4 rounded-md bg-primary px-4 py-2 text-text-inverse"
              >
                Reintentar
              </button>
            </div>
          )}

          {!isLoading && !error && (
            <>
              {hasActionError && (
                <div className="mx-auto max-w-3xl rounded-xl border border-bg-border bg-bg-card p-6">
                  <p className="text-sm text-text-muted">{hasActionError}</p>
                  <button
                    onClick={() => {
                      resetAccept();
                      resetReject();
                    }}
                    className="mt-4 rounded-md bg-primary px-4 py-2 text-text-inverse"
                  >
                    Cerrar
                  </button>
                </div>
              )}
              <main className="mx-auto max-w-6xl">
                <RequestList requests={requests} onApprove={handleApprove} onReject={handleReject} />
              </main>
            </>
          )}
        </div>

        <ConfirmModal
          isOpen={showConfirmModal}
          title={pendingAction === "approve" ? "Aprobar solicitud" : "Rechazar solicitud"}
          details={selectedRequest ? [
            <>
              {pendingAction === "approve" ? "¿Estás seguro de que deseas aprobar a " : "¿Estás seguro de que deseas rechazar a "}
              <strong>{selectedRequest.fullName}</strong>
              {pendingAction === "approve" ? " en " : " de "}
              la colonia <strong>{colonyLabel}</strong>?
            </>,
          ] : [<span key="confirm">Confirma la acción</span>]}
          onConfirm={handleModalConfirm}
          onCancel={() => {
            setShowConfirmModal(false);
            setSelectedRequest(null);
            setPendingAction(null);
          }}
          loading={isProcessingAction}
          confirmLabel={pendingAction === "approve" ? "Aprobar" : "Rechazar"}
          cancelLabel="Cancelar"
        />
      </div>
    </RequireAuth>
  );
}

