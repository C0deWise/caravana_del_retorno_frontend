"use client";
import Spinner from "@/components/feedback/Spinner";
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

  const { members, colonyLabel, isLoading, error, totalMembers } =
    useColonyMembers(targetColonyId);

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
          <MemberList members={members} userRole={user?.role as UserRole} />
        )}
      </main>
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

