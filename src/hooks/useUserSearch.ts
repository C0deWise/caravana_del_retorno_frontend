import { useState, useCallback, useRef } from "react";
import { ApiError } from "@/services/api.services";
import { userService } from "@/services/user.service";
import type { UserSearchResult, UserSearchMode } from "@/types/user.types";

interface UseUserSearchReturn {
  search: (mode: UserSearchMode, value: string) => Promise<UserSearchResult[] | null>;
  results: UserSearchResult[];
  loading: boolean;
  error: string | null;
}

const getErrorMessage = (err: unknown): string => {
  if (!(err instanceof ApiError)) {
    return "Error de conexión, intenta de nuevo";
  }

  switch (err.status) {
    case 404:
      return "No se encontraron resultados";
    case 422:
      return "Error de validación en la búsqueda";
    default:
      return err.message;
  }
};

export const useUserSearch = (): UseUserSearchReturn => {
  const [results, setResults] = useState<UserSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const lastRequestRef = useRef<number>(0);

  const search = useCallback(
    async (mode: UserSearchMode, value: string): Promise<UserSearchResult[] | null> => {
      const trimmedValue = value.trim();

      if (!trimmedValue) {
        setError("Debes ingresar un valor para buscar");
        setResults([]);
        return null;
      }

      const currentRequestId = ++lastRequestRef.current;
      setLoading(true);
      setError(null);

      try {
        const response = await userService.createSearchFn(mode, value);
        
        if (currentRequestId !== lastRequestRef.current) {
          return null;
        }

        setResults(response);
        return response;
      } catch (err) {
        if (currentRequestId === lastRequestRef.current) {
          setError(getErrorMessage(err));
          setResults([]);
        }
        return null;
      } finally {
        if (currentRequestId === lastRequestRef.current) {
          setLoading(false);
        }
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
