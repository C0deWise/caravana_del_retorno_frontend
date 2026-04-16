import { useState } from "react";
import { useRouter } from "next/navigation";
import { registrationService } from "../services/userRegistry.service";
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
  const router = useRouter();

  const registerUser = async (data: RegistrationRequest): Promise<void> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await registrationService.userRegistration(data);
      setSuccess(true);
      setTimeout(() => router.push("/"), 2000);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 422) {
          setError("Error de validación de campos.");
        } else {
          setError(err.message);
        }
      } else {
        setError("Error de conexión, intenta de nuevo");
      }
    } finally {
      setLoading(false);
    }
  };

  return { registerUser, loading, error, success };
};
