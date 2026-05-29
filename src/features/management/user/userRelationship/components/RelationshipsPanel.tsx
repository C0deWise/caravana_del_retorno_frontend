"use client";

import Spinner from "@/components/feedback/Spinner";
import { useAuth } from "@/auth/context/AuthContext";
import { useListRelationships } from "../hooks/useListRelationships";
import { KinshipsList } from "../kinshipsList/KinshipsList";
import { RequestsList } from "../relationshipsRequestList/RequestsList";
import { RequestRelationshipButton } from "../relationshipRequest/components/RequestRelationshipButton";
import { RequireAuth } from "@/auth/components/RequireAuth";
import { acceptRelationshipService, rejectRelationshipService } from "../services/relationship.service";
import { useToast } from "@/components/feedback/Toast";

function RelationshipsPanelComponent() {
  const { user } = useAuth();
  const targetUserId = user?.id ?? 0;
  const { showToast } = useToast();

  const { relationships, loading, error, refetch } =
    useListRelationships(targetUserId);

  const normalizeTabStatus = (status?: string) =>
    status?.trim().toLowerCase() ?? "";

  const allRelationships = relationships || [];

  const myKinships = allRelationships.filter(
    (r) => normalizeTabStatus(r.status) === "aceptada",
  );
  const receivedRequests = allRelationships.filter(
    (r) =>
      normalizeTabStatus(r.status) === "pendiente" &&
      String(r.relatedUser.id) === String(targetUserId),
  );
  const sentRequests = allRelationships.filter(
    (r) =>
      normalizeTabStatus(r.status) === "pendiente" &&
      String(r.user.id) === String(targetUserId),
  );

  const handleApprove = async (id: string, userName: string) => {
    try {
      await acceptRelationshipService(id);
      showToast(`La solicitud de parentesco de ${userName} fue aceptada con éxito`, "success");
      refetch();
    } catch (err) {
      console.error("Error al aceptar la solicitud:", err);
      showToast(`Ocurrió un error al aceptar la solicitud de ${userName}`, "error");
    }
  };

  const handleReject = async (id: string, userName: string) => {
    try {
      await rejectRelationshipService(id);
      showToast(`Rechazaste la solicitud de parentesco de ${userName}`, "info");
      refetch();
    } catch (err) {
      console.error("Error al rechazar la solicitud:", err);
      showToast(`Ocurrió un error al rechazar la solicitud de ${userName}`, "error");
    }
  };

  return (
    <div className="w-full h-[calc(100vh-15.5rem)] flex flex-col space-y-6 pt-2 pb-4">
      <header className="shrink-0 mx-10 rounded-xl bg-bg-card px-8 py-4 shadow-xl">
        <div className="flex items-center justify-between gap-10">
          <div className="flex flex-1 items-center">
            <div className="shrink-0 pr-6">
              <span className="mb-1 block text-sm font-medium uppercase tracking-wide text-text-muted">
                Gestión
              </span>
              <h1 className="text-3xl font-bold leading-none text-primary">
                Parentescos
              </h1>
            </div>
          </div>

          <div className="flex flex-1 items-center justify-end">
            <RequestRelationshipButton
              solicitanteId={targetUserId}
              onSuccess={refetch}
            />
          </div>
        </div>
      </header>

      {error && (
        <div className="shrink-0 mx-10 rounded-xl border border-danger/30 bg-danger/10 px-6 py-4">
          <p className="text-sm font-medium text-danger">{error}</p>
        </div>
      )}

      {loading && allRelationships.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <main className="flex-1 min-h-0 mx-auto max-w-360 w-full px-10 flex flex-col lg:flex-row gap-8 items-stretch pb-6">
          <KinshipsList
            relationships={myKinships}
            targetUserId={targetUserId}
            loading={loading}
          />

          <RequestsList
            receivedRequests={receivedRequests}
            sentRequests={sentRequests}
            targetUserId={targetUserId}
            loading={loading}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </main>
      )}
    </div>
  );
}

export default function RelationshipsPanel() {
  return (
    <RequireAuth roles={["usuario", "lider_colonia"]}>
      <RelationshipsPanelComponent />
    </RequireAuth>
  );
}

