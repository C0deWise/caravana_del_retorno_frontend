"use client";

import { useCallback, useMemo, useState } from "react";
import { RequireAuth } from "@/auth/components/RequireAuth";
import { ConfirmModal } from "@/components/confirmModal";
import Spinner from "@/ui/animations/Spinner";
import { useGrupalInscriptionList } from "../hooks/useGrupalInscriptionList.hook";
import { useAcceptGrupalInvitation } from "../hooks/useAcceptGrupalInvitation.hook";
import { useRejectGrupalInvitation } from "../hooks/useRejectGrupalInvitation.hook";
import { GrupalInvitationList } from "./grupalInvitationList";
import type { GrupalInvitation } from "../types/grupalInscription.types";

type PendingAction = "accept" | "reject" | null;

export default function ListGrupalInscription() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedInvitation, setSelectedInvitation] =
    useState<GrupalInvitation | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  const {
    invitations,
    isLoading,
    error,
    refetch,
    updateInvitationLocally,
    totalInvitations,
  } = useGrupalInscriptionList();

  const {
    acceptInvitation,
    isAccepting,
    error: acceptError,
    reset: resetAccept,
  } = useAcceptGrupalInvitation();

  const {
    rejectInvitation,
    isRejecting,
    error: rejectError,
    reset: resetReject,
  } = useRejectGrupalInvitation();

  // El usuario ya pertenece a un grupo si tiene al menos una invitación aceptada
  const hasActiveGroup = useMemo(
    () => invitations.some((inv) => inv.status === "aprobado"),
    [invitations],
  );

  const handleAccept = useCallback(
    (invitationId: number) => {
      const invitation = invitations.find((inv) => inv.id === invitationId);
      if (!invitation?.isActionable) return;

      setSelectedInvitation(invitation);
      setPendingAction("accept");
      setShowConfirmModal(true);
    },
    [invitations],
  );

  const handleReject = useCallback(
    (invitationId: number) => {
      const invitation = invitations.find((inv) => inv.id === invitationId);
      if (!invitation?.isActionable) return;

      setSelectedInvitation(invitation);
      setPendingAction("reject");
      setShowConfirmModal(true);
    },
    [invitations],
  );

  const handleModalConfirm = useCallback(async () => {
    if (!selectedInvitation || !pendingAction) return;

    try {
      if (pendingAction === "accept") {
        const updated = await acceptInvitation(selectedInvitation.id);
        updateInvitationLocally(updated);
        resetAccept();
        // Refetch para que el backend actualice el estado del resto de invitaciones
        await refetch();
      }

      if (pendingAction === "reject") {
        const updated = await rejectInvitation(selectedInvitation.id);
        updateInvitationLocally(updated);
        resetReject();
      }

      setShowConfirmModal(false);
      setSelectedInvitation(null);
      setPendingAction(null);
    } catch {
      // El error ya queda en acceptError / rejectError para mostrarlo en UI
    }
  }, [
    selectedInvitation,
    pendingAction,
    acceptInvitation,
    rejectInvitation,
    updateInvitationLocally,
    resetAccept,
    resetReject,
    refetch,
  ]);

  const handleCloseModal = useCallback(() => {
    setShowConfirmModal(false);
    setSelectedInvitation(null);
    setPendingAction(null);
  }, []);

  const hasActionError = acceptError ?? rejectError;
  const isProcessingAction = isAccepting || isRejecting;

  const confirmTitle =
    pendingAction === "accept"
      ? "¿Estás seguro de aceptar la invitación?"
      : "¿Estás seguro de rechazar la invitación?";

  const confirmDetails: React.ReactNode[] =
    pendingAction === "accept"
      ? [
          <>
            <span className="font-bold">Líder del grupo:</span>{" "}
            {selectedInvitation?.leaderFullName}
          </>,
          <>
            Esto rechazará las otras invitaciones y no podrás inscribirte de
            manera individual al retorno a menos que dejes el grupo.
          </>,
        ]
      : [
          <>
            <span className="font-bold">Líder del grupo:</span>{" "}
            {selectedInvitation?.leaderFullName}
          </>,
        ];

  return (
    <RequireAuth roles={["usuario"]}>
      <div className="flex w-full min-h-screen flex-col">
        {/* ── Encabezado ──────────────────────────────────────── */}
        <header className="sticky top-0 z-10 mx-10 rounded-xl bg-bg-card px-8 py-4 shadow-xl">
          <div className="flex items-end justify-between gap-6">
            <div>
              <span className="text-md uppercase tracking-wide text-text-muted">
                Retorno grupal
              </span>
              <p className="text-3xl font-bold text-secondary">
                Invitaciones grupales
              </p>
            </div>

            <div className="text-right">
              <span className="text-sm uppercase tracking-wide text-text-muted">
                Invitaciones
              </span>
              <p className="text-4xl font-bold text-secondary">
                {isLoading ? "—" : totalInvitations}
              </p>
            </div>
          </div>
        </header>

        {/* ── Cuerpo ──────────────────────────────────────────── */}
        <div className="flex-1 space-y-8 overflow-y-auto pt-4 md:pb-30">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-3 text-primary">
                <Spinner size="sm" />
                <span className="font-medium">Cargando invitaciones...</span>
              </div>
            </div>
          ) : error ? (
            <div className="mx-auto max-w-3xl rounded-xl border border-bg-border bg-bg-card p-6">
              <p className="text-sm text-text-muted">{error}</p>
              <button
                onClick={() => void refetch()}
                className="mt-4 rounded-md bg-primary px-4 py-2 text-text-inverse"
              >
                Reintentar
              </button>
            </div>
          ) : (
            <>
              {/* Error de acción */}
              {hasActionError && (
                <div className="mx-auto max-w-3xl rounded-xl border border-bg-border bg-bg-card p-6">
                  <p className="text-sm text-danger">{hasActionError}</p>
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

              {/* Spinner de procesamiento */}
              {isProcessingAction && (
                <div className="flex items-center justify-center py-4">
                  <div className="flex items-center space-x-3 text-primary">
                    <Spinner size="sm" />
                    <span className="font-medium">
                      Procesando invitación...
                    </span>
                  </div>
                </div>
              )}

              {/* Aviso de grupo activo */}
              {hasActiveGroup && (
                <div className="mx-auto max-w-3xl rounded-xl border border-accent-green/30 bg-accent-green/10 p-4">
                  <p className="text-sm text-accent-green font-medium">
                    Ya perteneces a un grupo familiar. Las demás invitaciones no
                    están disponibles para aceptar.
                  </p>
                </div>
              )}

              {/* Lista o estado vacío */}
              {invitations.length === 0 ? (
                <div className="mx-auto max-w-3xl rounded-xl border border-bg-border bg-bg-card p-6 text-center">
                  <p className="text-text-muted">
                    No tienes invitaciones para unirte a un grupo.
                  </p>
                </div>
              ) : (
                <main className="mx-auto max-w-6xl">
                  <p className="mb-4 text-center text-text-muted">
                    Tienes las siguientes invitaciones para unirte a un grupo
                  </p>
                  <GrupalInvitationList
                    invitations={invitations}
                    onAccept={handleAccept}
                    onReject={handleReject}
                    hasActiveGroup={hasActiveGroup}
                  />
                </main>
              )}
            </>
          )}

          {/* ── Modal de confirmación ────────────────────────── */}
          <ConfirmModal
            isOpen={showConfirmModal}
            title={confirmTitle}
            details={confirmDetails}
            onConfirm={handleModalConfirm}
            onCancel={handleCloseModal}
            loading={isProcessingAction}
            confirmLabel={pendingAction === "accept" ? "Confirmar" : "Confirmar"}
            cancelLabel="Cancelar"
          />
        </div>
      </div>
    </RequireAuth>
  );
}
