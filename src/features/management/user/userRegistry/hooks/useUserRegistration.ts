"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registrationService } from "../services/userRegistry.service";
import { ApiError } from "@/services/api.services";
import type { RegistrationRequest } from "../types/registro.types";
import { useAuth } from "@/auth/context/AuthContext";
import { CODE_TO_ROLE, UserApi } from "@/types/user.types";
import { authApi } from "@/services/auth.api";

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
  const router = useRouter();
  const { login } = useAuth();

  const registerUser = async (data: RegistrationRequest): Promise<void> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await registrationService.userRegistration(data);
      const userData = await authApi.login(data.correo, data.contrasenia);

      login(userData);
      setSuccess(true);
      setTimeout(() => router.push("/gestion"), 1500);
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
