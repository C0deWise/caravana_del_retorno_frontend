import { useState, useCallback } from "react";
import { ApiError } from "@/services/api.services";
import type { UserSearchResult } from "@/types/user.types";

interface UseGetUserReturn {
  getUser: (id: number) => Promise<UserSearchResult | null>;
  user: UserSearchResult | null;
  loading: boolean;
  error: string | null;
}

export const useGetUser = (): UseGetUserReturn => {
  const [user, setUser] = useState<UserSearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUser = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const { userService } = await import("@/services/user.service");
      const data = await userService.getUserById(id);
      setUser(data);
      return data;
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Error al cargar la información del usuario");
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { getUser, user, loading, error };
};
