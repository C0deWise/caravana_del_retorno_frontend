"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/auth/context/AuthContext";
import { useListRelationships } from "../hooks/useListRelationships";
import { RelationshipList } from "./RelationshipList";
import Spinner from "@/ui/animations/Spinner";
import { RequireAuth } from "@/auth/components/RequireAuth";

function ListRelationshipsComponent() {
  const { user } = useAuth();
  const targetUserId = user?.id ?? 0;
  const esAdmin = Boolean(user?.role === "admin");

  const { relationships, loading, error, hasMore, loadMore } =
    useListRelationships(targetUserId);

  const visibleCount = relationships?.length ?? 0;
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!targetUserId || loading || relationships !== null) return;
    void loadMore();
  }, [targetUserId, loading, relationships, loadMore]);

  useEffect(() => {
    if (!targetUserId || !hasMore || loading) return;

    const current = sentinelRef.current;
    if (!current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        void loadMore();
      }
    });

    observer.observe(current);

    return () => {
      observer.unobserve(current);
      observer.disconnect();
    };
  }, [targetUserId, hasMore, loading, loadMore]);

  return (
    <div className="w-full min-h-screen space-y-8 md:pb-30">
      <header className="sticky top-0 z-10 mx-10 rounded-xl bg-bg-card px-8 py-4 shadow-xl">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h1 className="text-2xl font-bold text-primary">
              Lista de parentescos
            </h1>
            <p className="mt-1 text-sm text-text-muted" aria-live="polite">
              {esAdmin
                ? null
                : `Mostrando ${visibleCount} registro${visibleCount === 1 ? "" : "s"}${hasMore ? " (desplázate para cargar más)" : ""}`}
            </p>
          </div>
        </div>
      </header>

      {error && (
        <div className="mx-10 rounded-xl border border-danger/30 bg-danger/10 px-6 py-4">
          <p className="text-sm font-medium text-danger">{error}</p>
        </div>
      )}

      {loading && relationships === null ? (
        <div className="flex items-center justify-center py-20">
          <Spinner size="sm" />
        </div>
      ) : (
        <main className="mx-auto max-w-6xl">
          {esAdmin ? (
            <div className="rounded-lg border border-bg-border bg-bg-card px-4 py-5">
              <p className="text-sm text-text-muted">
                El usuario administrador no tiene parentescos.
              </p>
            </div>
          ) : (
            <RelationshipList
              relationships={relationships ?? []}
              targetUserId={targetUserId}
            />
          )}
        </main>
      )}

      {hasMore && (
        <div
          ref={sentinelRef}
          className="flex items-center justify-center space-x-3 py-4 text-primary"
        >
          <Spinner size="sm" />
          <span className="font-medium">Cargando más parentescos...</span>
        </div>
      )}
    </div>
  );
}

export default function ListRelationships() {
  return (
    <RequireAuth>
      <ListRelationshipsComponent />
    </RequireAuth>
  );
}
