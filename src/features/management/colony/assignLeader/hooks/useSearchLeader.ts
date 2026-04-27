import { useState, useCallback } from "react";
import { ApiError } from "@/services/api.services";
import { leaderService } from "../services/leader.service";
import type { UserSearchResult, SearchMode } from "../types/leader.types";

interface UseSearchLeaderReturn {
  searchUsers: (
    mode: SearchMode,
    value: string,
  ) => Promise<UserSearchResult[] | null>;
  results: UserSearchResult[];
  loading: boolean;
  error: string | null;
}

export const useSearchLeader = (): UseSearchLeaderReturn => {
  const [results, setResults] = useState<UserSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchUsers = useCallback(async (
    mode: SearchMode,
    value: string,
  ): Promise<UserSearchResult[] | null> => {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      setError("Debes ingresar un valor para buscar");
      setResults([]);
      return null;
    }

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      let response: UserSearchResult[];

      if (mode === "nombre") {
        response = await leaderService.searchByName(trimmedValue);
      } else {
        const user = await leaderService.searchByDocument(trimmedValue);
        response = [user];
      }

      setResults(response);
      return response;
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 404) {
          setError("No se encontraron usuarios");
        } else if (err.status === 422) {
          setError("Error de validación en la búsqueda");
        } else {
          setError(err.message);
        }
      } else {
        setError("Error de conexión, intenta de nuevo");
      }

      setResults([]);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    searchUsers,
    results,
    loading,
    error,
  };
};
