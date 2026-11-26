
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "../hooks/useLogin";
import Image from "next/image";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { createPortal } from "react-dom";

interface LoginPanelProps {
  readonly isVisible?: boolean;
  readonly isMobile?: boolean;
  readonly onClose: () => void;
  readonly onNavigateToRegister?: () => void;
}

export default function LoginPanel({ isVisible = true, isMobile = false, onClose, onNavigateToRegister }: LoginPanelProps) {
  const [correo, setCorreo] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const router = useRouter();
  const { loginUser, isLoading, error, setError } = useLogin();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = await loginUser(correo, contrasenia);
    if (success) {
      setCorreo("");
      setContrasenia("");
      onClose();
    }
  };

  const panelContent = (
    <div
      onClick={(e) => isMobile && e.stopPropagation()}
      className={
        isMobile
          ? `relative w-full max-w-[92%] sm:max-w-[450px] md:max-w-[500px] lg:max-w-[600px] max-h-[95dvh] overflow-y-auto rounded-3xl bg-primary/95 backdrop-blur-3xl border border-white/20 px-5 sm:px-8 pt-14 pb-6 sm:pb-8 shadow-2xl transition-all duration-300 ${
              isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`
          : `absolute top-full -right-9 z-50 mt-4 w-80 rounded-2xl bg-primary/85 backdrop-blur-2xl border border-white/10 p-6 shadow-2xl overflow-hidden transition-all duration-300 ${
              isVisible
                ? "opacity-100 translate-y-0 visible pointer-events-auto"
                : "opacity-0 -translate-y-2 invisible pointer-events-none"
            }`
      }
    >
      {/* Patrón de topografía */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src="/backgrounds/topography.svg"
          alt="Topography Pattern"
          fill
          className="object-cover opacity-[0.07] mix-blend-overlay"
          priority
          loading="eager"
        />
      </div>

      {/* Botón Cerrar (Solo móvil) */}
      {isMobile && (
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 text-white/70 hover:text-white transition-colors p-2 focus:outline-none"
          aria-label="Cerrar"
        >
          <XMarkIcon className="w-8 h-8" />
        </button>
      )}

      {/* Contenido del modal */}
      <div className="relative z-10 text-white">
        <h2 className="mb-5 text-xl sm:text-2xl font-bold text-center">¡Bienvenido de vuelta!</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="correo-login" className="text-sm font-medium block mb-1">
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
              className="w-full rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-3 text-base text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-white/20 transition-all"
            />
          </div>

          <div>
            <label htmlFor="contrasenia-login" className="text-sm font-medium block mb-1">
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
              className="w-full rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-3 text-base text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-white/20 transition-all"
            />
          </div>

          {error && (
            <p
              id="login-error"
              role="alert"
              className="text-xs text-accent-red font-semibold drop-shadow-md"
            >
              {error}
            </p>
          )}

          <div className="mt-2 flex flex-col gap-3">
            <button
              type="submit"
              disabled={isLoading || !correo.trim() || !contrasenia.trim()}
              aria-disabled={isLoading || !correo.trim() || !contrasenia.trim()}
              aria-busy={isLoading}
              className="w-full cursor-pointer rounded-lg bg-accent-green py-3 text-base font-bold text-white transition-all duration-300 hover:brightness-110 hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:brightness-100 disabled:hover:shadow-none border border-transparent hover:border-white/20"
            >
              {isLoading ? "Cargando..." : "Ingresar"}
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onNavigateToRegister?.();
                router.push("/auth/registro");
              }}
              className="w-full cursor-pointer rounded-lg bg-secondary py-3 text-base font-bold text-white transition-all duration-300 hover:brightness-110 hover:shadow-lg active:scale-[0.98] border border-transparent hover:border-white/20"
            >
              Registrarse
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  if (isMobile) {
    if (!mounted) return null;
    return createPortal(
      <div
        className={`fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md transition-all duration-300 ${
          isVisible ? "opacity-100 visible pointer-events-auto" : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={onClose}
      >
        {panelContent}
      </div>,
      document.body
    );
  }

  return panelContent;
}
