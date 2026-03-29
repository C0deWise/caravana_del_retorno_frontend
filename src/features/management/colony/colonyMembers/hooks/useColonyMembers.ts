import { useCallback, useMemo, useState } from "react";
import { useAuth } from "@/auth/context/AuthContext";
import type { Member } from "../types/member.types";
import { mockColonies, mockAllMembers } from "./mocks";

export function useColonyMembers(targetColonyId: number): {
  members: Member[];
  colonyLabel: string;
  hasMore: boolean;
  loadMore: () => void;
  isAdminView: boolean;
  totalMembers: number;
} {
  const { user } = useAuth();

  const filteredMembers = useMemo(
    () => mockAllMembers.filter((m) => m.codigo_colonia === targetColonyId),
    [targetColonyId],
  );

  const colony = useMemo(
    () => mockColonies.find((c) => c.codigo === targetColonyId),
    [targetColonyId],
  );

  const [page, setPage] = useState(1);
  const limit = 20;

  const colonyLabel = colony
    ? colony.ciudad && colony.departamento
      ? `${colony.ciudad}, ${colony.departamento}`
      : colony.pais
    : "Colony not found";

  const members = useMemo(
    () => filteredMembers.slice(0, page * limit),
    [filteredMembers, page],
  );

  const hasMore = page * limit < filteredMembers.length;

  const loadMore = useCallback(() => {
    setPage((p) => p + 1);
  }, []);

  const isAdminView = user?.role === "admin";

  return {
    members,
    colonyLabel,
    hasMore,
    loadMore,
    isAdminView,
    totalMembers: filteredMembers.length,
  };
}
