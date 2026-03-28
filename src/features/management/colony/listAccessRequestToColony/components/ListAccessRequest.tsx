"use client";

import { useEffect, useRef } from "react";
import { RequestList } from "./RequestList";
import { useListRequest } from "../hooks/useListRequest";
import Spinner from "@/ui/animations/Spinner";

interface ListAccessRequestProps {
  paramsId?: number;
}

export default function ListAccessRequest({
  paramsId,
}: ListAccessRequestProps) {
  const targetColonyId = paramsId && paramsId > 0 ? paramsId : 1;

  const { requests, colonyLabel, hasMore, loadMore, totalRequests } =
    useListRequest(targetColonyId);

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (targetColonyId) loadMore();
  }, [targetColonyId, loadMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasMore) loadMore();
    });
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  return (
    <div className="w-full min-h-screen md:pb-30 space-y-8">
      <header className="mx-10 px-8 py-4 rounded-xl shadow-xl bg-bg-card sticky top-0 z-10">
        <div className="flex items-end justify-between gap-6">
          <div>
            <span className="text-md font-medium text-text-muted uppercase tracking-wide">
              Solicitudes de ingreso
            </span>
            <p className="text-3xl font-bold text-secondary">{colonyLabel}</p>
          </div>
          <div className="text-right">
            <span className="text-sm font-medium text-text-muted uppercase tracking-wide">
              Solicitudes
            </span>
            <p className="text-4xl font-bold text-secondary">
              {totalRequests ?? requests.length}
            </p>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto">
        <RequestList
          onApprove={(request) => {
            console.log("Aprobar solicitud", request);
          }}
          onReject={(request) => {
            console.log("Rechazar solicitud", request);
          }}
          requests={requests}
        />
      </main>

      {hasMore && (
        <div className="flex items-center justify-center py-12">
          <div
            ref={sentinelRef}
            className="flex items-center space-x-3 text-primary"
          >
            <Spinner size="sm" />
            <span className="font-medium">Cargando mas notificaciones...</span>
          </div>
        </div>
      )}
    </div>
  );
}
