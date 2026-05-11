"use client";

import Spinner from "@/components/feedback/Spinner";
import { useColonyMembers } from "../../hooks/useColonyMembers";
import { useRemoveColonyMember } from "../../hooks/useRemoveColonyMember";
import { useAuth } from "@/auth/context/AuthContext";
import { RequireAuth } from "@/auth/components/RequireAuth";
import { MemberList } from "./MemberList";
import { UserRole } from "@/types/user.types";
import { useToast } from "@/components/feedback/Toast";

export default function ColonyMembers() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const targetColonyId = user?.codigo_colonia ?? 0;

  const {
    members,
    colonyLabel,
    isLoading,
    error,
    totalMembers,
    removeMemberLocally,
    refetchMembers,
  } = useColonyMembers(targetColonyId);

  const { removeMember, isRemoving } = useRemoveColonyMember();

  const handleRemove = async (memberId: number) => {
    if (!targetColonyId) return;

    try {
      await removeMember(targetColonyId, memberId);
      removeMemberLocally(memberId);
      showToast("Miembro eliminado correctamente", "success");
      await refetchMembers();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al eliminar el miembro";
      showToast(message, "error");
    }
  };

  return (
    <RequireAuth>
      <div className="flex flex-col w-full h-full">
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

        <div className="space-y-8 pb-8 md:pb-10 pt-4">
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
              <MemberList
                members={members}
                userRole={user?.role as UserRole}
                onRemove={handleRemove}
                isRemoving={isRemoving}
                colonyName={colonyLabel}
                currentUserId={user?.id}
              />

            </main>
          )}
        </div>
      </div>
    </RequireAuth>
  );
}
