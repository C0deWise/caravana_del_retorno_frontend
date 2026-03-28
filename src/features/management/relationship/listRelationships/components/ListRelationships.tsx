"use client";

import { useEffect, useRef } from "react";
import { useListRelationships } from "../hooks/useListRelationships";
import { RelationshipList } from "./RelationshipList";
import Spinner from "@/ui/animations/Spinner";

interface ListRelationshipsProps {
  paramsId?: string | number;
}

export default function ListRelationships({
  paramsId,
}: ListRelationshipsProps) {
  const targetUserId = paramsId ? String(paramsId) : "0"; // Valor por defecto para pruebas

  const { relationships, hasMore, loadMore } =
    useListRelationships(targetUserId);
  const visibleCount = relationships?.length ?? 0;

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (targetUserId) loadMore();
  }, [targetUserId, loadMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasMore) loadMore();
    });
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  return (
    <div className="w-full min-h screen md:pb-30 space-y-8">
      <header className="mx-10 px-8 py-4 rounded-xl shadow-xl bg-bg-card sticky top-0 z-10">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h1 className="text-2xl font-bold text-primary">
              Lista de parentescos
            </h1>
            <p className="text-sm text-text-muted mt-1" aria-live="polite">
              Mostrando {visibleCount} registro{visibleCount === 1 ? "" : "s"}
              {hasMore ? " (desplázate para cargar más)" : ""}
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto">
        <RelationshipList
          relationships={relationships ?? []}
          targetUserId={targetUserId}
        />
      </main>

      {hasMore && (
        <div className="flex items-center space-x-3 text-primary">
          <div
            ref={sentinelRef}
            className="flex items-center space-x-3 text-primary"
          >
            <Spinner size="sm" />
            <span className="font-medium">Cargando más parentescos...</span>
          </div>
        </div>
      )}
    </div>
  );
}
