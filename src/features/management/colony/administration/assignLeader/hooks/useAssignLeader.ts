import { useState } from "react";
import { ApiError } from "@/services/api.services";
import { leaderService } from "../services/leader.service";
import type {
  AssignLeaderRequest,
  SetLeaderResponse,
} from "../types/leader.types";

interface UseAssignLeader {
  assignLeader: (
    request: AssignLeaderRequest,
  ) => Promise<SetLeaderResponse | null>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export const useAssignLeaderToColony = (): UseAssignLeader => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const assignLeader = async ({
    coloniaCodigo,
    liderId,
  }: AssignLeaderRequest): Promise<SetLeaderResponse | null> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await leaderService.setLeader(coloniaCodigo, {
        lider_id: liderId,
      });

      setSuccess(true);
      return response;
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 404) {
          setError("Colonia o líder no encontrado.");
        } else if (err.status === 422) {
          setError("Datos inválidos o campos faltantes.");
        } else {
          setError(err.message);
        }
      } else {
        setError("Error de conexión, intenta de nuevo");
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    assignLeader,
    loading,
    error,
    success,
  };
};
