import { useCallback, useEffect, useState, useMemo } from "react";
import { useAuth } from "@/auth/context/AuthContext";
import { ColonyMember } from "../types/colony-members.types";
import { listColonyMembers } from "../services/colony-members.service";
import { ApiError } from "@/services/api.services";
import { useListColonies } from "../../hooks/useListColonies";

export function useColonyMembers(targetColonyId: number): {
  members: ColonyMember[];
  colonyLabel: string;
  isLoading: boolean;
  error: string | null;
  isAdminView: boolean;
  totalMembers: number;
  removeMemberLocally: (memberId: number) => void;
} {
  const { user } = useAuth();
  const [members, setMembers] = useState<ColonyMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { colonies, listColonies } = useListColonies();

  useEffect(() => {
    void listColonies();
  }, [listColonies]);

  const colony = useMemo(
    () => colonies.find((c) => c.codigo === targetColonyId),
    [colonies, targetColonyId],
  );

  const colonyLabel = colony
    ? [colony.ciudad, colony.departamento, colony.pais]
        .filter(Boolean)
        .join(", ")
    : "Cargando...";

  const fetchMembers = useCallback(async () => {
    if (!targetColonyId) {
      setMembers([]);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await listColonyMembers(targetColonyId);
      setMembers(data);
    } catch (err) {
      const apiError = err as ApiError;
      switch (apiError.status) {
        case 422:
          setError("Error de validación en la colonia solicitada");
          setMembers([]);
          break;
        case 404:
          setError("No se encontraron miembros en la colonia indicada");
          setMembers([]);
          break;
        default:
          setError(apiError.message || "Error cargando miembros");
          setMembers([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [targetColonyId]);

  useEffect(() => {
    void fetchMembers();
  }, [fetchMembers]);

  const isAdminView = user?.role === "admin";

  const removeMemberLocally = useCallback(
    (memberId: number) =>
      setMembers((prev) => prev.filter((m) => m.id !== memberId)),
    [],
  );

  return {
    members,
    colonyLabel,
    isLoading,
    error,
    isAdminView,
    totalMembers: members.length,
    removeMemberLocally,
  };
}
