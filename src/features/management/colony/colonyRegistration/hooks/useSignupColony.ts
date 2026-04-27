import { useState } from "react";
import { signupColonyService } from "../services/signupColony.service";
import { ApiError } from "@/services/api.services";

interface UseSignupColonyReturn {
  signupColony: (codeUser: number, codeColony: number) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export const useSignupColony = (): UseSignupColonyReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const signupColony = async (
    codeUser: number,
    codeColony: number,
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await signupColonyService.crearSolicitud({
        codigo_usuario: codeUser,
        codigo_colonia: codeColony,
      });
      setSuccess(true);
      return true;
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 404) {
          setError("El usuario con el código especificado no existe.");
        } else if (err.status === 422) {
          setError("Error de validación en los datos enviados.");
        } else {
          setError(err.message);
        }
      } else {
        setError("Error de conexión, intenta de nuevo.");
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { signupColony, loading, error, success };
};
