"use client";

import Spinner from "@/components/feedback/Spinner";
import { useAuth } from "@/auth/context/AuthContext";
import { useListRelationships } from "../hooks/useListRelationships";
import { KinshipsList } from "../kinshipsList/KinshipsList";
import { RequestsList } from "../relationshipsRequestList/RequestsList";
import { RequestRelationshipButton } from "../relationshipRequest/components/RequestRelationshipButton";
import { RequireAuth } from "@/auth/components/RequireAuth";
import { FEATURE_FLAGS } from "@/config/featureFlags";

function RelationshipsPanelComponent() {
  const { user } = useAuth();
  const targetUserId = user?.id ?? 0;

  const { relationships, loading, error, hasMore, loadMore, refetch, usedMocks } =
    useListRelationships(targetUserId, FEATURE_FLAGS.USE_RELATIONSHIP_MOCKS);

  const normalizeTabStatus = (status?: string) =>
    status?.trim().toLowerCase() ?? "";

  const allRelationships = relationships || [];

  const myKinships = allRelationships.filter(
    (r) => normalizeTabStatus(r.status) === "aceptada",
  );
  const receivedRequests = allRelationships.filter(
    (r) =>
      normalizeTabStatus(r.status) !== "aceptada" &&
      r.relatedUser.id === targetUserId,
  );
  const sentRequests = allRelationships.filter(
    (r) =>
      normalizeTabStatus(r.status) !== "aceptada" && r.user.id === targetUserId,
  );

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
            {usedMocks && (
              <span className="ml-4 rounded-full bg-accent-yellow/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-accent-yellow border border-accent-yellow/20 animate-pulse">
                Mock Mode
              </span>
            )}
          </div>

          <div className="flex flex-1 items-center justify-end">
            <RequestRelationshipButton
              solicitanteId={targetUserId}
              onSuccess={refetch}
            />
          </div>
        </div>
      </header>

      {error && !usedMocks && (
        <div className="shrink-0 mx-10 rounded-xl border border-danger/30 bg-danger/10 px-6 py-4">
          <p className="text-sm font-medium text-danger">{error}</p>
        </div>
      )}

      {loading && allRelationships.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <main className="flex-1 min-h-0 mx-auto max-w-[90rem] w-full px-10 flex flex-col lg:flex-row gap-8 items-stretch pb-6">
          <KinshipsList
            relationships={myKinships}
            targetUserId={targetUserId}
            hasMore={hasMore}
            loading={loading}
            onLoadMore={loadMore}
          />

          <RequestsList
            receivedRequests={receivedRequests}
            sentRequests={sentRequests}
            targetUserId={targetUserId}
            hasMore={hasMore}
            loading={loading}
            onLoadMore={loadMore}
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

