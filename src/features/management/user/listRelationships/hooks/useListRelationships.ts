import { useCallback, useEffect, useMemo, useState } from "react";
import { listRelationshipsWithUsersService } from "../services/relationship.service";
import { ApiError } from "@/services/api.services";
import type {
  RelationshipItem,
  RelationshipStatus,
} from "../types/relationship.type";

interface UseListRelationshipsReturn {
  relationships: RelationshipItem[] | null;
  status: RelationshipStatus | null;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
}

const PAGE_SIZE = 20;

const normalizeStatus = (status?: string): RelationshipStatus | null => {
  if (!status) return null;
  const normalized = status.toLowerCase().trim();
  if (
    normalized === "pendiente" ||
    normalized === "aceptada" ||
    normalized === "rechazada" ||
    normalized === "expirada"
  ) {
    return normalized as RelationshipStatus;
  }
  return null;
};

const resolveErrorMessage = (error: unknown): string => {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 400:
        return "Solicitud inválida o usuario no encontrado.";
      case 422:
        return "Los datos enviados no son válidos.";
      default:
        return error.message;
    }
  }
  return "Ocurrió un error inesperado. Intenta de nuevo.";
};

export function useListRelationships(
  targetUserId: number,
): UseListRelationshipsReturn {
  const [allRelationships, setAllRelationships] = useState<RelationshipItem[]>(
    [],
  );
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!targetUserId) {
      setAllRelationships([]);
      setPage(1);
      setError(null);
      return;
    }

    let cancelled = false;

    const fetchRelationships = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await listRelationshipsWithUsersService(targetUserId);

        if (!cancelled) {
          setAllRelationships(data);
          setPage(1);
        }
      } catch (err) {
        if (!cancelled) {
          setAllRelationships([]);
          setError(resolveErrorMessage(err));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchRelationships();

    return () => {
      cancelled = true;
    };
  }, [targetUserId]);

  const uniqueRelationships = useMemo(() => {
    const map = new Map<string, RelationshipItem>();

    for (const relationship of allRelationships) {
      map.set(relationship.codigo ?? "", relationship);
    }

    return Array.from(map.values());
  }, [allRelationships]);

  const prioritizedRelationships = useMemo(
    () =>
      [...uniqueRelationships].sort((a, b) => {
        const aIsPending = normalizeStatus(a.status) === "pendiente";
        const bIsPending = normalizeStatus(b.status) === "pendiente";
        if (aIsPending === bIsPending) return 0;
        return aIsPending ? -1 : 1;
      }),
    [uniqueRelationships],
  );

  const relationships = useMemo(() => {
    const paginated = prioritizedRelationships.slice(0, page * PAGE_SIZE);
    return paginated.length > 0 ? paginated : null;
  }, [prioritizedRelationships, page]);

  const hasMore = page * PAGE_SIZE < prioritizedRelationships.length;

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    setPage((prev) => prev + 1);
  }, [loading, hasMore]);

  const status = useMemo(() => {
    if (uniqueRelationships.length === 0) return null;
    const first = normalizeStatus(uniqueRelationships[0]?.status);
    if (!first) return null;
    const mixed = uniqueRelationships.some(
      (r) => normalizeStatus(r.status) !== first,
    );
    return mixed ? null : first;
  }, [uniqueRelationships]);

  return {
    relationships,
    status,
    loading,
    error,
    hasMore,
    loadMore,
  };
}
