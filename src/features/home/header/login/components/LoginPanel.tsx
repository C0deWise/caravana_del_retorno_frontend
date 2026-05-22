


"use client";

import { useState } from "react";
import { useAuth } from "@/auth/context/AuthContext";
import { authService } from "@/features/home/header/login/services/auth.service";
import { useRouter } from "next/navigation";

interface LoginPanelProps {
  readonly onClose: () => void;
}

export default function LoginPanel({ onClose }: LoginPanelProps) {
  const [correo, setCorreo] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const correoNormalizado = correo.trim().toLowerCase();
    const contraseniaNormalizada = contrasenia.trim();
    if (!correoNormalizado || !contraseniaNormalizada || isLoading) return;

    setIsLoading(true);
    setError("");

    try {
      const userData = await authService.login(correoNormalizado, contraseniaNormalizada);
      login(userData);
      setCorreo("");
      setContrasenia("");
      onClose();
      router.push("/gestion");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="absolute top-full -right-9 z-50 mt-2 w-80 rounded-b-xl bg-primary p-6 shadow-lg">
      <h2 className="mb-4 text-xl font-semibold">Iniciar sesión</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label htmlFor="correo-login" className="text-sm font-medium">
          Correo
        </label>

        <input
          id="correo-login"
          type="email"
          value={correo} //uwu
          onChange={(e) => {
            setCorreo(e.target.value);
            setError("");
          }}
          placeholder="Ej: usuario@correo.com"
          disabled={isLoading}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "login-error" : undefined}
          className="rounded-lg border bg-bg-separator px-3 py-2 text-sm text-text placeholder:text-gray-400 focus:outline-none focus:ring-2"
        />

        <label htmlFor="contrasenia-login" className="text-sm font-medium">
          Contraseña
        </label>

        <input
          id="contrasenia-login"
          type="password"
          value={contrasenia}
          onChange={(e) => {
            setContrasenia(e.target.value);
            setError("");
          }}
          placeholder="Tu contraseña"
          disabled={isLoading}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "login-error" : undefined}
          className="rounded-lg border bg-bg-separator px-3 py-2 text-sm text-text placeholder:text-gray-400 focus:outline-none focus:ring-2"
        />

        {error && (
          <p
            id="login-error"
            role="alert"
            className="text-xs text-red-500"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading || !correo.trim() || !contrasenia.trim()}
          aria-disabled={isLoading || !correo.trim() || !contrasenia.trim()}
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
