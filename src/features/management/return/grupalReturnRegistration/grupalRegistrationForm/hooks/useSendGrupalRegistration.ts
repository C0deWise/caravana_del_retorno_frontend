"use client";

import { useState } from "react";
import { ApiError } from "@/services/api.services";
import { grupalReturnRegistrationService } from "../../services/grupalReturnRegistration.service";
import type {
  RegistroGrupoRetorno,
  RegistroGrupoRetornoRequest,
} from "../../types/grupalReturnRegistration";

interface UseSendGrupalRegistrationReturn {
  sendGrupalRegistration: (data: RegistroGrupoRetornoRequest) => Promise<RegistroGrupoRetorno | null>;
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

export function useSendGrupalRegistration(): UseSendGrupalRegistrationReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const sendGrupalRegistration = async (
    data: RegistroGrupoRetornoRequest,
  ): Promise<RegistroGrupoRetorno | null> => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await grupalReturnRegistrationService.registrarGrupo(data);
      setSuccess(true);
      return response;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Error al inscribir el grupo.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { sendGrupalRegistration, isLoading, error, success };
}