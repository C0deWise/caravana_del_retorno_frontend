
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "../hooks/useLogin";

interface LoginPanelProps {
  readonly onClose: () => void;
}

export default function LoginPanel({ onClose }: LoginPanelProps) {
  const [correo, setCorreo] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const router = useRouter();
  const { loginUser, isLoading, error, setError } = useLogin();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = await loginUser(correo, contrasenia);
    if (success) {
      setCorreo("");
      setContrasenia("");
      onClose();
    }
  };

  return (
    <div className="absolute top-full -right-9 z-50 mt-2 w-80 rounded-b-xl bg-primary p-6 shadow-lg">
      <h2 className="mb-4 text-xl font-bold text-center">¡Bienvenido de vuelta!</h2>

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
