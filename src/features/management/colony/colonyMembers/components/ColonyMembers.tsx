"use client";
import Spinner from "@/components/feedback/Spinner";
import { useColonyMembers } from "../hooks/useColonyMembers";
import { useAuth } from "@/auth/context/AuthContext";
import { RequireAuth } from "@/auth/components/RequireAuth";
import { MemberList } from "./MemberList";
import { UserRole } from "@/types/user.types";

export default function ColonyMembers() {
  const { user } = useAuth();

  const targetColonyId = user?.codigo_colonia ?? 0;

  const { members, colonyLabel, isLoading, error, totalMembers } =
    useColonyMembers(targetColonyId);

  return (
    <RequireAuth>
      <div className="flex flex-col w-full min-h-screen">
        <header className="sticky top-0 z-10 mx-10 rounded-xl bg-bg-card px-8 py-4 shadow-xl">
          <div className="flex items-end justify-between gap-6">
            <div>
              <span className="text-sm font-medium text-text-muted uppercase tracking-wide mb-1 block">
                Colonia
              </span>
              <h1 className="text-3xl font-bold text-primary leading-none">
                {isLoading && targetColonyId
                  ? "Cargando ubicación..."
                  : colonyLabel}
              </h1>
            </div>

            <div className="text-right">
              <span className="text-sm font-medium text-text-muted uppercase tracking-wide mb-1 block">
                Miembros
              </span>
              <span className="text-3xl font-bold text-secondary leading-none block">
                {targetColonyId ? (totalMembers ?? members.length) : "-"}
              </span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto space-y-8 pb-8 md:pb-10 pt-4">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-3 text-primary">
                <Spinner size="sm" />
                <span className="font-medium">Cargando miembros...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="mx-auto max-w-3xl rounded-xl border border-bg-border bg-bg-card p-6">
              <p className="text-sm text-text-muted">{error}</p>
            </div>
          )}

          {!isLoading && !error && (
            <main className="mx-auto max-w-6xl">
              <MemberList members={members} userRole={user?.role as UserRole} />
            </main>
          )}
        </div>
      </div>
    </RequireAuth>
  );
}
