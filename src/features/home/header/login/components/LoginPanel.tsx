"use client";

import { useState } from "react";
import { useAuth } from "@/auth/context/AuthContext";
import { authService } from "@/features/home/header/login/services/auth.service";
import { useRouter } from "next/navigation";

interface LoginPanelProps {
  onClose: () => void;
}

export default function LoginPanel({ onClose }: LoginPanelProps) {
  const [documento, setDocumento] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmed = documento.trim();
    if (!trimmed || isLoading) return;

    setIsLoading(true);
    setError("");

    try {
      const userData = await authService.loginByDocument(trimmed);
      login(userData);
      setDocumento("");
      onClose();
      router.push("/gestion");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="absolute top-full -right-9 z-50 mt-2 w-80 rounded-bl-xl bg-primary p-6 shadow-lg">
      <h2 className="mb-4 text-xl font-semibold">Iniciar sesión</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label htmlFor="documento-login" className="text-sm font-medium">
          Número de documento
        </label>

        <input
          id="documento-login"
          type="text"
          value={documento}
          onChange={(e) => {
            setDocumento(e.target.value);
            setError("");
          }}
          placeholder="Ej: 1085123456"
          disabled={isLoading}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "login-document-error" : undefined}
          className="rounded-lg border bg-bg-separator px-3 py-2 text-sm text-text placeholder:text-gray-400 focus:outline-none focus:ring-2"
        />

        {error && (
          <p
            id="login-document-error"
            role="alert"
            className="text-xs text-red-500"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading || !documento.trim()}
          aria-disabled={isLoading || !documento.trim()}
          aria-busy={isLoading}
          className="cursor-pointer rounded-lg bg-accent-green py-2 text-sm font-medium text-text-inverse transition-all duration-200 hover:brightness-110 hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:brightness-100 disabled:hover:shadow-none"
        >
          {isLoading ? "Cargando..." : "Ingresar"}
        </button>

        <button
          type="button"
          onClick={() => {
            onClose();
            router.push("/auth/registro");
          }}
          className="cursor-pointer rounded-lg bg-secondary py-2 text-sm font-medium text-text-inverse transition-all duration-200 hover:brightness-110 hover:shadow-md active:scale-[0.98]"
        >
          Registrarse
        </button>
      </form>
    </div>
  );
}
