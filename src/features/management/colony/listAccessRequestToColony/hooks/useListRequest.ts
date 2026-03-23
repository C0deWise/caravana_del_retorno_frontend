import { useCallback, useMemo, useState } from "react";
// import { requestColonyService } from "../services/requestColony.service";
import { mockColonies, mockRequests } from "./mocks";
import type { Request } from "../types/request.types";

export function useListRequest(targetColonyId: number | string): {
    requests: Request[];
    colonyLabel: string;
    hasMore: boolean;
    loadMore: () => void;
    totalRequests: number;
} {
    const normalizedColonyId = Number(targetColonyId);

    const filterRequestsByColony = useMemo(
        () => mockRequests.filter((r) => r.colonyId === normalizedColonyId),
        [normalizedColonyId],
    );

    const colony = useMemo(
        () => mockColonies.find((c) => c.id === normalizedColonyId),
        [normalizedColonyId],
    );

    const [page, setPage] = useState(1);
    const limit = 20;

    const colonyLabel = colony
        ? colony.city && colony.department
            ? `${colony.city}, ${colony.department}`
            : colony.country
        : "Colonia desconocida";

    const requests = useMemo(
        () => filterRequestsByColony.slice(0, page * limit),
        [filterRequestsByColony, page],
    );

    const hasMore = requests.length < filterRequestsByColony.length;

    const loadMore = useCallback(() => {
        setPage((p) => p + 1);
    }, []);

    return {
        requests,
        colonyLabel,
        hasMore,
        loadMore,
        totalRequests: filterRequestsByColony.length,
    }
}