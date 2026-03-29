import { useState } from "react";
import { userService } from "@/services/user/user.services";
import { UserData, UserApi } from "@/types/user.types";

interface UseAssignLeaderToColonyReturn {
  assignLeader: (userData: UserData) => Promise<UserApi | null>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export const useAssignLeaderToColony = (): UseAssignLeaderToColonyReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const assignLeader = async (data: UserData): Promise<UserApi | null> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Validar que el rol no esté vacío
      if (!data.role) {
        setError("El campo rol es obligatorio");
        return null;
      }

      const response = await userService.patchUser(data.id, {
        role: data.role,
      });

      return response;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Error al asignar el líder a la colonia";
      setError(message);
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
