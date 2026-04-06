import { useState } from "react";
import { userService } from "@/services/user/user.services";
import { UserData, UserApi } from "@/types/user.types";

interface AssignLeaderParams {
  userId: number;
  colonyCode: number;
}

interface UseAssignLeaderToColonyReturn {
  assignLeader: (params: AssignLeaderParams) => Promise<UserApi | null>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export const useAssignLeaderToColony = (): UseAssignLeaderToColonyReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const assignLeader = async (params: AssignLeaderParams): Promise<UserApi | null> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await userService.patchUser(params.userId, {
        role: "lider_colonia",
        codigo_colonia: params.colonyCode,
      });

      setSuccess(true);
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
