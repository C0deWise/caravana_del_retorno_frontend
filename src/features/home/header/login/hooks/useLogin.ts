"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/auth/context/AuthContext";
import { authService } from "../services/auth.service";

interface UseLoginReturn {
  loginUser: (correo: string, contrasenia: string) => Promise<boolean>;
  isLoading: boolean;
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

export const useLogin = (): UseLoginReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const loginUser = async (correo: string, contrasenia: string): Promise<boolean> => {
    const correoNormalizado = correo.trim().toLowerCase();
    const contraseniaNormalizada = contrasenia.trim();

    if (!correoNormalizado || !contraseniaNormalizada || isLoading) return false;

    setIsLoading(true);
    setError("");

    try {
      const userData = await authService.login(correoNormalizado, contraseniaNormalizada);
      login(userData);
      router.push("/gestion");
      return true;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { loginUser, isLoading, error, setError };
};
