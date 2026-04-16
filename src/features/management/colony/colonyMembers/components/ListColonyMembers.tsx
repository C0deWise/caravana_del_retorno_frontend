"use client";
import { useEffect, useRef } from "react";
import Spinner from "@/ui/animations/Spinner";
import { useColonyMembers } from "../hooks/useColonyMembers";
import { useAuth } from "@/auth/context/AuthContext";
import { RequireAuth } from "@/auth/components/RequireAuth";
import { MemberList } from "./MemberList";
import { UserRole } from "@/types/user.types";

interface ListColonyMembersProps {
  paramsId?: number;
}

function ColonyMembersFeature({ paramsId }: ListColonyMembersProps) {
  const { user } = useAuth();

  const targetColonyId =
    user?.role === "admin"
      ? (paramsId ?? user?.codigo_colonia ?? 1)
      : (user?.codigo_colonia ?? 0);

  const { members, colonyLabel, hasMore, loadMore, totalMembers } =
    useColonyMembers(targetColonyId);

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
              Colonia
            </span>
            <p className="text-3xl font-bold text-secondary">{colonyLabel}</p>
          </div>

          <div className="text-right">
            <span className="text-sm font-medium text-text-muted uppercase tracking-wide">
              Miembros
            </span>
            <p className="text-4xl font-bold text-secondary">
              {totalMembers ?? members.length}
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        <MemberList members={members} userRole={user?.role as UserRole} />
      </main>

      {hasMore && (
        <div className="flex items-center justify-center py-12">
          <div
            ref={sentinelRef}
            className="flex items-center space-x-3 text-primary"
          >
            <Spinner size="sm" />
            <span className="font-medium">Cargando mas miembros...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ListColonyMembers({
  paramsId,
}: ListColonyMembersProps) {
  return (
    <RequireAuth>
      <ColonyMembersFeature paramsId={paramsId} />
    </RequireAuth>
  );
}
