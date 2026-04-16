"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useAuth } from "@/auth/context/AuthContext";
import { RequireAuth } from "@/auth/components/RequireAuth";
import { ConfirmModal } from "@/components/confirmModal";
import { useListColonies } from "../../hooks/useListColonies";
import { useListAccessRequests } from "../hooks/useListAccessRequest";
import { useAcceptAccessRequest } from "../hooks/useAcceptAccessRequest";
import { useRejectAccessRequest } from "../hooks/useRejectAccessRequest";
import { RequestList } from "./RequestList";
import Spinner from "@/ui/animations/Spinner";
import type { AccessRequest } from "../types/access-request.types";
import type { ColonyItem } from "@/types/colony.types";

type PendingAction = "approve" | "reject" | null;

const normalizarTexto = (valor: string): string =>
  valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const formatColonyLabel = (colony: ColonyItem): string =>
  colony.departamento
    ? `${colony.ciudad}, ${colony.departamento}, ${colony.pais}`
    : colony.pais;

export default function ListAccessRequest() {
  const { user, effectiveRole } = useAuth();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<AccessRequest | null>(
    null,
  );
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  const [busqueda, setBusqueda] = useState("");
  const [mostrarLista, setMostrarLista] = useState(false);
  const [selectedColony, setSelectedColony] = useState<ColonyItem | null>(null);

  const isAdmin = effectiveRole === "admin";
  const isLeader = effectiveRole === "lider_colonia";

  const {
    listColonies,
    colonies,
    loading: isLoadingColonies,
    error: coloniesError,
  } = useListColonies();

  useEffect(() => {
    void listColonies();
  }, [listColonies]);

  const leaderColony =
    isLeader && user?.codigo_colonia
      ? (colonies.find((item) => item.codigo === user.codigo_colonia) ?? null)
      : null;

  const resolvedColony = isLeader ? leaderColony : selectedColony;

  const targetColonyId = isLeader
    ? (user?.codigo_colonia ?? null)
    : isAdmin
      ? (selectedColony?.codigo ?? null)
      : null;

  const {
    requests,
    isLoading,
    error,
    refetch,
    removeRequestLocally,
    totalRequests,
  } = useListAccessRequests(targetColonyId);

  const {
    acceptRequest,
    isAccepting,
    error: acceptError,
    reset: resetAccept,
  } = useAcceptAccessRequest();

  const {
    rejectRequest,
    isRejecting,
    error: rejectError,
    reset: resetReject,
  } = useRejectAccessRequest();

  const colonyLabel = !targetColonyId
    ? "Selecciona una colonia"
    : resolvedColony
      ? formatColonyLabel(resolvedColony)
      : `Colonia ${targetColonyId}`;

  const coloniasFiltradas = useMemo(() => {
    const termino = normalizarTexto(busqueda.trim());

    if (!termino) {
      return colonies;
    }

    return colonies.filter((colonia) =>
      normalizarTexto(formatColonyLabel(colonia)).includes(termino),
    );
  }, [busqueda, colonies]);

  const seleccionarColonia = useCallback((colonia: ColonyItem) => {
    setSelectedColony(colonia);
    setBusqueda(formatColonyLabel(colonia));
    setMostrarLista(false);
  }, []);

  const handleApprove = useCallback(
    async (requestId: number) => {
      const request = requests.find((item) => item.id === requestId);
      if (!request) return;

      setSelectedRequest(request);
      setPendingAction("approve");
      setShowConfirmModal(true);
    },
    [requests],
  );

  const handleReject = useCallback(
    async (requestId: number) => {
      const request = requests.find((item) => item.id === requestId);
      if (!request) return;

      setSelectedRequest(request);
      setPendingAction("reject");
      setShowConfirmModal(true);
    },
    [requests],
  );

  const handleModalConfirm = useCallback(async () => {
    if (!selectedRequest || !pendingAction) {
      return;
    }

    try {
      if (pendingAction === "approve") {
        await acceptRequest(selectedRequest.id);
        removeRequestLocally(selectedRequest.id);
        resetAccept();
      }

      if (pendingAction === "reject") {
        await rejectRequest(selectedRequest.id);
        removeRequestLocally(selectedRequest.id);
        resetReject();
      }

      setShowConfirmModal(false);
      setSelectedRequest(null);
      setPendingAction(null);
    } catch (err) {
      throw err;
    }
  }, [
    selectedRequest,
    pendingAction,
    acceptRequest,
    rejectRequest,
    removeRequestLocally,
    resetAccept,
    resetReject,
  ]);

  const handleCloseModal = useCallback(() => {
    setShowConfirmModal(false);
    setSelectedRequest(null);
    setPendingAction(null);
  }, []);

  const hasActionError = acceptError || rejectError;
  const isProcessingAction = isAccepting || isRejecting;

  const confirmTitle =
    pendingAction === "approve"
      ? "¿Confirmas aprobar esta solicitud?"
      : "¿Confirmas rechazar esta solicitud?";

  return (
    <RequireAuth roles={["admin", "lider_colonia"]}>
      <div className="flex flex-col w-full min-h-screen">
        <header className="sticky top-0 z-10 mx-10 rounded-xl bg-bg-card px-8 py-4 shadow-xl">
            <div className="flex flex-col gap-6">
              <div className="flex items-end justify-between gap-6">
                <div>
                  <span className="text-md uppercase tracking-wide text-text-muted">
                    Solicitudes de ingreso
                  </span>
                  <p className="text-3xl font-bold text-secondary">
                    {isLoadingColonies && targetColonyId
                      ? "Cargando ubicación..."
                      : colonyLabel}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-sm uppercase tracking-wide text-text-muted">
                    Solicitudes
                  </span>
                  <p className="text-4xl font-bold text-secondary">
                    {targetColonyId ? totalRequests : "-"}
                  </p>
                </div>
              </div>

              {isAdmin && (
                <div className="max-w-xl">
                  <label className="mb-2 block text-sm font-medium text-text-muted">
                    Buscar colonia
                  </label>

                  <div className="relative">
                    <Search
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"
                      size={20}
                    />

                    <input
                      id="buscar-colonia-admin"
                      type="text"
                      value={busqueda}
                      onChange={(e) => {
                        setBusqueda(e.target.value);
                        setSelectedColony(null);
                        setMostrarLista(true);
                      }}
                      onFocus={() => setMostrarLista(true)}
                      placeholder="Buscar colonia"
                      className="w-full rounded-lg border border-bg-border bg-white px-4 py-3 pr-10 text-lg text-text outline-none transition focus:ring-2 focus:ring-primary"
                    />

                    {mostrarLista && (
                      <ul className="absolute z-20 mt-2 max-h-56 w-full overflow-auto rounded-lg border border-bg-border bg-white shadow-md">
                        {isLoadingColonies && (
                          <li className="px-4 py-3 text-sm text-text-muted">
                            Cargando colonias...
                          </li>
                        )}

                        {!isLoadingColonies && coloniasFiltradas.length === 0 && (
                          <li className="px-4 py-3 text-sm text-text-muted">
                            No hay colonias disponibles para esta búsqueda.
                          </li>
                        )}

                        {!isLoadingColonies &&
                          coloniasFiltradas.map((colonia, index) => (
                            <li
                              key={
                                colonia.codigo ??
                                `${colonia.pais}-${colonia.departamento}-${colonia.ciudad}-${index}`
                              }
                            >
                              <button
                                type="button"
                                onClick={() => seleccionarColonia(colonia)}
                                className="w-full px-4 py-3 text-left text-base text-text hover:bg-bg-separator"
                              >
                                {formatColonyLabel(colonia)}
                              </button>
                            </li>
                          ))}
                      </ul>
                    )}
                  </div>

                  {coloniesError && (
                    <p className="mt-2 text-sm text-danger">{coloniesError}</p>
                  )}
                </div>
              )}
            </div>
        </header>

        <div className="flex-1 overflow-y-auto space-y-8 md:pb-30 pt-4">

        {isAdmin && !targetColonyId ? (
          <div className="mx-auto max-w-3xl rounded-xl border border-bg-border bg-bg-card p-6">
            <p className="text-sm text-text-muted">
              Selecciona una colonia desde el buscador para ver las solicitudes
              de acceso.
            </p>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-3 text-primary">
              <Spinner size="sm" />
              <span className="font-medium">Cargando solicitudes...</span>
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

            {isProcessingAction && (
              <div className="flex items-center justify-center py-4">
                <div className="flex items-center space-x-3 text-primary">
                  <Spinner size="sm" />
                  <span className="font-medium">Procesando solicitud...</span>
                </div>
              </div>
            )}

            <main className="mx-auto max-w-6xl">
              <RequestList
                requests={requests}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            </main>

            {requests.length === 0 && (
              <div className="mx-auto max-w-3xl rounded-xl border border-bg-border bg-bg-card p-6 text-center">
                <p className="text-sm text-text-muted">
                  No hay solicitudes de acceso pendientes para esta colonia.
                </p>
              </div>
            )}
          </>
        )}

        <ConfirmModal
          isOpen={showConfirmModal}
          title={confirmTitle}
          details={[
            <>
              <span className="text-lg font-bold">Solicitante:</span>{" "}
              {selectedRequest?.fullName}
            </>,
            <>
              <span className="text-lg font-bold">Colonia:</span> {colonyLabel}
            </>,
            <>
              <span className="text-lg font-bold">Acción:</span>{" "}
              {pendingAction === "approve"
                ? "Aceptar solicitud"
                : "Rechazar solicitud"}
            </>,
          ]}
          onConfirm={handleModalConfirm}
          onCancel={handleCloseModal}
          loading={isProcessingAction}
        />
        </div>
      </div>
    </RequireAuth>
  );
}
