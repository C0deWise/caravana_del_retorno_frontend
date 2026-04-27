"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registrationService } from "../services/userRegistry.service";
import { ApiError } from "@/services/api.services";
import type { RegistrationRequest } from "../types/registro.types";
import { useAuth } from "@/auth/context/AuthContext";
import { CODE_TO_ROLE, UserApi } from "@/types/user.types";

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

      const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "";
      const res = await fetch(`${baseURL}/api/v1/usuario/todos`);

      if (!res.ok) {
        throw new Error("No se pudo consultar la sesión");
      }

      const usuarios: UserApi[] = await res.json();
      const found = usuarios.find((u) => u.documento === data.documento);

      if (!found) {
        throw new Error("Usuario no encontrado");
      }

      const { codigo_rol, ...rest } = found;

      login({
        ...rest,
        role: CODE_TO_ROLE[codigo_rol],
      });

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
