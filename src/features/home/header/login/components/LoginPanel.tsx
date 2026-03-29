"use client";

import { useState } from "react";
import { useAuth } from "@/auth/context/AuthContext";
import { authService } from "@/features/home/header/login/services/auth.service";
import { useRouter } from "next/navigation";

interface LoginPanelProps {
  onClose: () => void;
}

export default function LoginPanel({ onClose }: LoginPanelProps) {
  const [document, setDocument] = useState("1085123456");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const { login } = useAuth();

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");

    try {
      const userData = await authService.loginByDocument(document);
      login(userData);
      onClose();
      setDocument("");
      router.push("/gestion");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="absolute top-full -right-9 z-50 mt-2 w-80 bg-primary rounded-bl-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Iniciar sesión</h2>

      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium">Número de documento</label>
        <input
          type="text"
          value={document}
          onChange={(e) => {
            setDocument(e.target.value);
            setError("");
          }}
          placeholder="Ej: CC10000000"
          disabled={isLoading}
          className="bg-bg-separator border rounded-lg px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 placeholder:text-gray-400"
        />

        {error && <p className="text-red-500 text-xs">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={isLoading || !document.trim()}
          className="bg-black text-white rounded-lg py-2 text-sm font-medium disabled:opacity-50"
        >
          {isLoading ? "Cargando..." : "Ingresar"}
        </button>
      </div>
    </div>
  );
}
