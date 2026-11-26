"use client";

import { useState } from "react";
import { ApiError } from "@/services/api.services";
import { authApi } from "@/services/auth.api";
import { useAuth } from "@/auth/context/AuthContext";
import { useDev } from "@/features/dev/context/DevContext";
import { registrationService } from "../services/userRegistry.service";
import type { RegistrationRequest } from "../types/registro.types";

interface UseRegisterUserReturn {
  registerUser: (data: RegistrationRequest) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export const useRegisterUser = (): UseRegisterUserReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { login } = useAuth();
  const { apiMode } = useDev();

  const registerUser = async (data: RegistrationRequest): Promise<void> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (apiMode) {
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(
            () => reject(new Error("No se pudo conectar con el servidor. Intenta de nuevo más tarde.")),
            10000
          )
        );

        await Promise.race([registrationService.userRegistration(data), timeoutPromise]);
        const userData = await Promise.race([authApi.login(data.correo, data.contrasenia), timeoutPromise]);
        login(userData);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }

      setSuccess(true);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 422) {
          setError("Error de validación de campos.");
        } else {
          setError(err.message);
        }
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error de conexión, intenta de nuevo");
      }
    } finally {
      setLoading(false);
    }
  };

  return { registerUser, loading, error, success };
};
