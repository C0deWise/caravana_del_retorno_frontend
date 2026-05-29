"use client";

import { useState } from "react";
import { grupalReturnRegistrationService } from "../../../shared/services/grupalReturnRegistration.service";
import { RemoveMemberRequest } from "../types/inviteMember.types";
import { ApiError } from "@/services/api.services";

interface UseRemoveMemberReturn {
  removeMember: (data: RemoveMemberRequest) => Promise<boolean | null>;
  isLoading: boolean;
  error: string | null;
}

export function useRemoveMember(): UseRemoveMemberReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const removeMember = async (data: RemoveMemberRequest): Promise<boolean | null> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Removiendo usuario", data);
      const response = await grupalReturnRegistrationService.removerMiembro(data);
      console.log(response);
      if (!response) return null;
      return response;
    } catch (err) {
      if (err instanceof ApiError) {
        console.log(err.message);
        setError(err.message);
      } else {
        setError("Error al eliminar el miembro del grupo.");
      }
      return null;
    } finally {
      setIsLoading(false);

    }
  };

  return { removeMember, isLoading, error };
}