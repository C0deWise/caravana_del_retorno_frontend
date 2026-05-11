"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/services/api.services";
import type { AccessRequest } from "../types/access-request.types";
import { listAccessRequestsByColony } from "../services/access-request.service";

interface UseListAccessRequestsReturn {
  requests: AccessRequest[];
  isLoading: boolean;
  error: string | null;
  totalRequests: number;
  refetch: () => Promise<void>;
  removeRequestLocally: (requestId: number) => void;
  updateRequestLocally: (updatedRequest: AccessRequest) => void;
  clearRequests: () => void;
}

export function useListAccessRequests(
  colonyId: number | null,
): UseListAccessRequestsReturn {
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    if (!colonyId) {
      setRequests([]);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await listAccessRequestsByColony(colonyId);
      setRequests(data);
    } catch (err) {
      const apiError = err as ApiError;
      switch (apiError.status) {
        case 404:
          setError(
            "No se encontraron solicitudes pendientes para la colonia indicada.",
          );
          setRequests([]);
          break;
        case 422:
          setError("Error de validación en la colonia solicitada");
          setRequests([]);
          break;
        default:
          setError(apiError.message || "Error cargando solicitudes");
          setRequests([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [colonyId]);

  useEffect(() => {
    void fetchRequests();
  }, [fetchRequests]);

  const removeRequestLocally = useCallback((requestId: number) => {
    setRequests((prev) => prev.filter((request) => request.id !== requestId));
  }, []);

  const updateRequestLocally = useCallback((updatedRequest: AccessRequest) => {
    setRequests((prev) =>
      prev.map((request) =>
        request.id === updatedRequest.id ? updatedRequest : request,
      ),
    );
  }, []);

  const clearRequests = useCallback(() => {
    setRequests([]);
  }, []);

  return {
    requests,
    isLoading,
    error,
    totalRequests: requests.length,
    refetch: fetchRequests,
    removeRequestLocally,
    updateRequestLocally,
    clearRequests,
  };
}
