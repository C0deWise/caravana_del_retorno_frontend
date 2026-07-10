"use client";

import { useState } from "react";
import { ApiError } from "@/services/api.services";
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

  const registerUser = async (data: RegistrationRequest): Promise<void> => {
    void data; // TODO: Implementar API
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // API call simulada para testing
      // await registrationService.userRegistration(data);
      // const userData = await authApi.login(data.correo, data.contrasenia);
      // login(userData);

      // Simulamos la latencia de la red de 1.5 segundos
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSuccess(true);
      // setTimeout(() => router.push("/gestion"), 5000);
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
