import { useState, useCallback } from "react";
import { ApiError } from "@/services/api.services";
import { userService } from "@/services/user.service";
import type { UserSearchResult, UserSearchMode } from "@/types/user.types";

interface UseUserSearchReturn {
  search: (mode: UserSearchMode, value: string) => Promise<UserSearchResult[] | null>;
  results: UserSearchResult[];
  loading: boolean;
  error: string | null;
}

export const useUserSearch = (): UseUserSearchReturn => {
  const [results, setResults] = useState<UserSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(
    async (mode: UserSearchMode, value: string): Promise<UserSearchResult[] | null> => {
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
        const response = await userService.createSearchFn(mode, value);
        setResults(response);
        return response;
      } catch (err) {
        if (err instanceof ApiError) {
          if (err.status === 404) {
            setError("No se encontraron resultados");
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
    },
    [],
  );

  return {
    search,
    results,
    loading,
    error,
  };
};
