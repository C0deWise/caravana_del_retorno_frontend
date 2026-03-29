import { useCallback, useEffect, useMemo, useState } from "react";
import { relationshipService } from "../services/relationship.service";
import type { RelationshipItem } from "../types/relationship.type";
import { mockGetRelationships } from "./mocks";

const USE_MOCK = true;

/**
 * Contrato de salida del hook `useListRelationships`.
 */
interface UseListRelationshipsReturn {
  /**
   * Relaciones filtradas por usuario y limitadas por la paginación actual.
   * Retorna `null` cuando no existen registros para mostrar.
   */
  relationships: RelationshipItem[] | null;

  /**
   * Estado agregado de las relaciones filtradas.
   * Retorna un valor único cuando todas comparten el mismo estado; en caso contrario `null`.
   */
  status: "pendiente" | "aceptada" | "rechazada" | null;

  /**
   * Indica si existen más relaciones disponibles para cargar.
   */
  hasMore: boolean;

  /**
   * Avanza la paginación para cargar más elementos.
   */
  loadMore: () => void;
}

const PAGE_SIZE = 20;

/**
 * Normaliza un estado de relación a los valores válidos del dominio.
 *
 * @param status Estado crudo recibido desde la API.
 * @returns Estado normalizado (`pendiente`, `aceptada`, `rechazada`) o `null`.
 */
const normalizeStatus = (
  status?: string,
): "pendiente" | "aceptada" | "rechazada" | null => {
  if (!status) {
    return null;
  }

  const normalized = status.toLowerCase();

  if (
    normalized === "pendiente" ||
    normalized === "aceptada" ||
    normalized === "rechazada"
  ) {
    return normalized;
  }

  return null;
};

/**
 * Obtiene y expone la lista de parentescos de un usuario con paginación incremental.
 *
 * El hook carga todas las relaciones desde el servicio, filtra por `targetUserId`
 * (como usuario principal o relacionado), y retorna únicamente los elementos visibles
 * según la página actual.
 *
 * @param targetUserId Identificador del usuario objetivo para filtrar las relaciones.
 * @returns Datos de relaciones paginadas y utilidades de navegación.
 */
export function useListRelationships(
  targetUserId: number,
): UseListRelationshipsReturn {
  const [allRelationships, setAllRelationships] = useState<RelationshipItem[]>(
    [],
  );
  const [pagination, setPagination] = useState({
    targetUserId,
    page: 1,
  });

  useEffect(() => {
    let cancelled = false;

    const fetchRelationships = async () => {
      try {
        const response = await (USE_MOCK
          ? mockGetRelationships()
          : relationshipService.getRelationships());

        if (!cancelled && response.success && Array.isArray(response.data)) {
          setAllRelationships(response.data);
        }
      } catch {
        if (!cancelled) {
          setAllRelationships([]);
        }
      }
    };

    fetchRelationships();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredRelationships = useMemo(
    () =>
      allRelationships.filter(
        (relationship) =>
          relationship.user.id === targetUserId ||
          relationship.relatedUser.id === targetUserId,
      ),
    [allRelationships, targetUserId],
  );

  const prioritizedRelationships = useMemo(
    () =>
      [...filteredRelationships].sort((left, right) => {
        const leftIsPending = normalizeStatus(left.status) === "pendiente";
        const rightIsPending = normalizeStatus(right.status) === "pendiente";

        if (leftIsPending === rightIsPending) {
          return 0;
        }

        return leftIsPending ? -1 : 1;
      }),
    [filteredRelationships],
  );

  const currentPage =
    pagination.targetUserId === targetUserId ? pagination.page : 1;

  const relationships = useMemo(() => {
    const paginated = prioritizedRelationships.slice(
      0,
      currentPage * PAGE_SIZE,
    );
    return paginated.length > 0 ? paginated : null;
  }, [prioritizedRelationships, currentPage]);

  const hasMore = currentPage * PAGE_SIZE < prioritizedRelationships.length;

  const loadMore = useCallback(() => {
    setPagination((currentPagination) => {
      if (currentPagination.targetUserId !== targetUserId) {
        return {
          targetUserId,
          page: 2,
        };
      }

      return {
        targetUserId,
        page: currentPagination.page + 1,
      };
    });
  }, [targetUserId]);

  const status = useMemo(() => {
    if (filteredRelationships.length === 0) {
      return null;
    }

    const firstStatus = normalizeStatus(filteredRelationships[0]?.status);

    if (!firstStatus) {
      return null;
    }

    const hasMixedStatus = filteredRelationships.some(
      (relationship) => normalizeStatus(relationship.status) !== firstStatus,
    );

    return hasMixedStatus ? null : firstStatus;
  }, [filteredRelationships]);

  return {
    relationships,
    status,
    hasMore,
    loadMore,
  };
}
