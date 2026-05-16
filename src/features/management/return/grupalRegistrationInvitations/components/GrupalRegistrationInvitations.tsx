"use client";

import { useCallback, useMemo, useState } from "react";
import { RequireAuth } from "@/auth/components/RequireAuth";
import { ConfirmModal } from "@/components/feedback/confirmModal";
import Spinner from "@/components/feedback/Spinner";
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
    () => invitations.some((inv) => inv.status === "aceptado"),
    [invitations],
  );

  const filteredInvitations = useMemo(
    () =>
      hasActiveGroup
        ? invitations.filter((inv) => inv.status === "aceptado")
        : invitations.filter((inv) => inv.isPending || inv.isExpired),
    [invitations, hasActiveGroup],
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
      // El error se maneja con los estados de error de cada hook
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

  const hasActionError = acceptError ?? rejectError;
  const isProcessingAction = isAccepting || isRejecting;

  let bodyContent: React.ReactNode;
  if (isLoading) {
    bodyContent = (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-3 text-primary">
          <Spinner size="sm" />
          <span className="font-medium">Cargando invitaciones...</span>
        </div>
      </div>
    );
  } else if (error) {
    bodyContent = (
      <div className="mx-auto max-w-3xl rounded-xl border border-bg-border bg-bg-card p-6">
        <p className="text-sm text-text-muted">{error}</p>
        <button
          onClick={() => void refetch()}
          className="mt-4 rounded-md bg-primary px-4 py-2 text-text-inverse"
        >
          Reintentar
        </button>
      </div>
    );
  } else {
    bodyContent = (
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
        {filteredInvitations.length === 0 ? (
          <div className="mx-auto max-w-3xl rounded-xl border border-bg-border bg-bg-card p-6 text-center">
            <p className="text-text-muted">
              No tienes invitaciones para unirte a un grupo.
            </p>
          </div>
        ) : (
          <main className="mx-auto max-w-6xl">
            <GrupalInvitationList
              invitations={filteredInvitations}
              onAccept={handleAccept}
              onReject={handleReject}
              hasActiveGroup={hasActiveGroup}
            />
          </main>
        )}
      </>
    );
  }
  return (
    <RequireAuth roles={["usuario"]}>
      <div className="flex w-full min-h-screen flex-col">
        <header className="sticky top-0 z-10 mx-10 rounded-xl bg-bg-card px-8 py-4 shadow-xl">
          <div className="flex items-end justify-between gap-6">
            <div>
              <span className="text-sm font-medium text-text-muted uppercase tracking-wide mb-1 block">
                Retorno grupal
              </span>
              <p className="text-3xl font-bold text-primary leading-none">
                Invitaciones grupales
              </p>
            </div>

            {!hasActiveGroup && (
              <div className="text-right">
                <span className="text-sm font-medium text-text-muted uppercase tracking-wide mb-1 block">
                  Invitaciones
                </span>
                <p className="text-3xl font-bold text-secondary leading-none block">
                  {isLoading ? "—" : totalInvitations}
                </p>
              </div>
            )}
          </div>
        </header>

        <div className="flex-1 space-y-8 overflow-y-auto pt-4 md:pb-30">
          {bodyContent}

          <ConfirmModal
            isOpen={showConfirmModal}
            title={pendingAction === "accept" ? "Aceptar invitación" : "Rechazar invitación"}
            details={selectedInvitation ? [
              <>
                {pendingAction === "accept" ? "¿Estás seguro de que deseas aceptar la invitación de " : "¿Estás seguro de que deseas rechazar la invitación de "}
                <strong>{selectedInvitation.leaderFullName}</strong>?
                <br />
                <span className="text-sm text-text-muted">{pendingAction === "accept" ? "Esto rechazará las otras invitaciones y no podrás inscribirte de manera individual al retorno a menos que dejes el grupo." : null}</span>
              </>,

            ] : [<span key="accept">Confirma la acción</span>]}
            onConfirm={handleModalConfirm}
            onCancel={() => {
              setShowConfirmModal(false);
              setSelectedInvitation(null);
              setPendingAction(null);
            }}
            loading={isProcessingAction}
            confirmLabel={pendingAction === "accept" ? "Aceptar" : "Rechazar"}
            cancelLabel="Cancelar"
          />
        </div>
      </div>
    </RequireAuth>
  );
}
