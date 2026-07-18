
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "../hooks/useLogin";
import { useAuth } from "@/auth/context/AuthContext";
import { googleLinkService } from "@/services/google-link.service";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          prompt: () => void;
        };
      };
    };
  }
}

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

interface LoginPanelProps {
  readonly onClose: () => void;
}

export default function LoginPanel({ onClose }: LoginPanelProps) {
  const [correo, setCorreo] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState("");
  const [gisLoaded, setGisLoaded] = useState(false);
  const router = useRouter();
  const { loginUser, isLoading, error, setError } = useLogin();
  const { login } = useAuth();

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => setGisLoaded(true);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handleGoogleCallback = useCallback(async (response: { credential: string }) => {
    setGoogleLoading(true);
    setGoogleError("");
    try {
      const userData = await googleLinkService.login(response.credential);
      login(userData);
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al iniciar sesión con Google.";
      setGoogleError(msg);
    } finally {
      setGoogleLoading(false);
    }
  }, [login, onClose]);

  useEffect(() => {
    if (!gisLoaded || !window.google) return;

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleCallback,
    });
  }, [gisLoaded, handleGoogleCallback]);

  const handleGoogleLogin = () => {
    if (!window.google) {
      setGoogleError("Google Identity Services no está disponible.");
      return;
    }
    setGoogleError("");
    window.google.accounts.id.prompt();
  };

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
          value={correo}
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

        <button
          type="button"
          onClick={() => {
            onClose();
            router.push("/auth/recuperar-contrasena");
          }}
          className="text-sm font-medium text-text-inverse underline underline-offset-4 hover:opacity-90"
        >
          ¿Olvidaste tu contraseña?
        </button>
      </form>

      {GOOGLE_CLIENT_ID && (
        <>
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-white/20" />
            <span className="text-xs text-white/60">o</span>
            <div className="flex-1 h-px bg-white/20" />
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading || !gisLoaded}
            className="flex items-center justify-center gap-2 w-full cursor-pointer rounded-lg bg-white py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-50 hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 border-none"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {googleLoading ? "Conectando..." : "Iniciar sesión con Google"}
          </button>

          {googleError && (
            <p className="text-xs text-red-300 mt-2 text-center">{googleError}</p>
          )}
        </>
      )}
    </div>
  );
}
