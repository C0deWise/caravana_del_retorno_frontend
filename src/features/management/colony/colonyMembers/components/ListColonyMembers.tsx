"use client";
import { useCallback } from "react";
import Spinner from "@/ui/animations/Spinner";
import { useColonyMembers } from "../hooks/useColonyMembers";
import { useRemoveColonyMember } from "../hooks/useRemoveColonyMember";
import { useAuth } from "@/auth/context/AuthContext";
import { RequireAuth } from "@/auth/components/RequireAuth";
import { MemberList } from "./MemberList";
import { UserRole } from "@/types/user.types";

interface ListColonyMembersProps {
  readonly paramsId?: number;
}

function ColonyMembersFeature({ paramsId }: ListColonyMembersProps) {
  const { user } = useAuth();

  const targetColonyId =
    user?.role === "admin"
      ? (paramsId ?? user?.codigo_colonia ?? 1)
      : (user?.codigo_colonia ?? 0);

  const { members, colonyLabel, isLoading, error, totalMembers, removeMemberLocally } =
    useColonyMembers(targetColonyId);

  const { removeMember, isRemoving } = useRemoveColonyMember();

  const handleRemove = useCallback(
    async (memberId: number) => {
      await removeMember(targetColonyId, memberId);
      removeMemberLocally(memberId);
    },
    [removeMember, removeMemberLocally, targetColonyId],
  );

  return (
    <div className="w-full md:pb-30 space-y-8">
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
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-3 text-primary">
              <Spinner size="sm" />
              <span className="font-medium">Cargando miembros...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center p-8">
            <div className="bg-red-100 text-red-500 rounded p-4 text-center">
              <p>{error}</p>
            </div>
          </div>
        )}

        {!isLoading && !error && members.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-text-muted">
            <p>No hay miembros en esta colonia.</p>
          </div>
        )}

        {!isLoading && members.length > 0 && (
          <MemberList
            members={members}
            userRole={user?.role as UserRole}
            colonyName={colonyLabel}
            onRemove={user?.role === "lider_colonia" ? handleRemove : undefined}
            isRemoving={isRemoving}
          />
        )}
      </main>
    </div>
  );
}

export default function ListColonyMembers({
  paramsId,
}: ListColonyMembersProps) {
  return (
    <RequireAuth requireColony>
      <ColonyMembersFeature paramsId={paramsId} />
    </RequireAuth>
  );
}
