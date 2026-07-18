"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { googleLinkService } from "@/services/google-link.service";
import { useAuth } from "@/auth/context/AuthContext";

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

const ROLE_LABEL: Record<string, string> = {
  admin: "Administrador",
  lider_colonia: "Líder de colonia",
  usuario: "Usuario",
};

export default function UserMenuDropdown() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isLinked, setIsLinked] = useState(false);
  const [googleEmail, setGoogleEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showUnlinkModal, setShowUnlinkModal] = useState(false);
  const [unlinkPassword, setUnlinkPassword] = useState("");
  const [unlinkError, setUnlinkError] = useState("");
  const [gisLoaded, setGisLoaded] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const status = await googleLinkService.getStatus();
      setIsLinked(status.is_linked);
      setGoogleEmail(status.google_email);
    } catch {
      // Silenciar errores de red
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

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

  useEffect(() => {
    if (!gisLoaded || !window.google) return;

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleCallback,
    });
  }, [gisLoaded]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleGoogleCallback = useCallback(async (response: { credential: string }) => {
    setLoading(true);
    setMessage(null);
    try {
      await googleLinkService.link(response.credential);
      setMessage({ text: "Cuenta de Google vinculada exitosamente.", type: "success" });
      await fetchStatus();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error al vincular con Google.";
      setMessage({ text: errorMsg, type: "error" });
    } finally {
      setLoading(false);
    }
  }, [fetchStatus]);

  const handleLinkClick = () => {
    if (!window.google) {
      setMessage({ text: "Google Identity Services no está disponible.", type: "error" });
      setShowMenu(false);
      return;
    }
    setShowMenu(false);
    window.google.accounts.id.prompt();
  };

  const handleUnlink = async () => {
    if (!unlinkPassword.trim()) {
      setUnlinkError("La contraseña es obligatoria.");
      return;
    }

    setLoading(true);
    setUnlinkError("");
    try {
      await googleLinkService.unlink(unlinkPassword);
      setIsLinked(false);
      setGoogleEmail(null);
      setShowUnlinkModal(false);
      setUnlinkPassword("");
      setMessage({ text: "Cuenta de Google desvinculada exitosamente.", type: "success" });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error al desvincular.";
      setUnlinkError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const displayName = `${user.nombre} ${user.apellido}`;

  return (
    <div ref={menuRef} className="relative">
      {/* Toast de mensajes */}
      {message && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-sm font-medium shadow-lg transition-all cursor-pointer ${
            message.type === "success"
              ? "bg-green-100 text-green-800 border border-green-200"
              : "bg-red-100 text-red-800 border border-red-200"
          }`}
          onClick={() => setMessage(null)}
        >
          {message.text}
        </div>
      )}

      {/* Nombre del usuario como trigger del menú */}
      <button
        onClick={() => setShowMenu((prev) => !prev)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white text-sm font-bold hover:bg-white/20 transition-all cursor-pointer border-none"
      >
        <span className="hidden md:inline truncate max-w-[120px]">{displayName}</span>
        <svg
          className={`w-4 h-4 transition-transform ${showMenu ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Menú desplegable */}
      {showMenu && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
          {/* Info del usuario */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-bold text-gray-900 truncate">{displayName}</p>
            <p className="text-xs text-gray-500 truncate">{user.correo}</p>
            <span className="inline-block mt-1.5 text-xs font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-wide">
              {ROLE_LABEL[user.role] ?? user.role}
            </span>
          </div>

          {/* Opción de Google */}
          {GOOGLE_CLIENT_ID ? (
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide font-semibold">Cuenta de Google</p>
              {isLinked ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    <span className="text-sm text-gray-700 truncate">{googleEmail}</span>
                  </div>
                  <button
                    onClick={() => {
                      setShowUnlinkModal(true);
                      setShowMenu(false);
                    }}
                    className="shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer border-none bg-transparent"
                    title="Desvincular cuenta de Google"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleLinkClick}
                  disabled={loading}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer border-none bg-transparent text-left disabled:opacity-50"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  {loading ? "Vinculando..." : "Vincular cuenta de Google"}
                </button>
              )}
            </div>
          ) : null}

          {/* Cerrar sesión */}
          <div className="px-2 py-1">
            <button
              onClick={() => {
                setShowMenu(false);
                logout();
                router.push("/inicio");
              }}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer border-none bg-transparent text-left"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Cerrar sesión
            </button>
          </div>
        </div>
      )}

      {/* Modal de desvinculación */}
      {showUnlinkModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => {
            setShowUnlinkModal(false);
            setUnlinkPassword("");
            setUnlinkError("");
          }}
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Desvincular cuenta de Google
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Se desvinculará <strong>{googleEmail}</strong> de tu cuenta. Ingresa tu contraseña para confirmar.
            </p>

            <input
              type="password"
              placeholder="Contraseña"
              value={unlinkPassword}
              onChange={(e) => setUnlinkPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleUnlink()}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 mb-2"
              autoFocus
            />

            {unlinkError && (
              <p className="text-xs text-red-600 mb-3">{unlinkError}</p>
            )}

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowUnlinkModal(false);
                  setUnlinkPassword("");
                  setUnlinkError("");
                }}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors border-none cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleUnlink}
                disabled={loading}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors border-none cursor-pointer disabled:opacity-50"
              >
                {loading ? "Desvinculando..." : "Desvincular"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
