"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { useToast } from "@/components/feedback/Toast";
import { authApi } from "@/services/auth.api";

const PASSWORD_HELP = "Usa al menos 8 caracteres, con mayúscula, minúscula, número y símbolo.";

const validatePassword = (password: string): string => {
  if (password.length < 8) {
    return "La contraseña debe tener al menos 8 caracteres.";
  }

  if (!/[A-Z]/.test(password)) {
    return "La contraseña debe incluir una letra mayúscula.";
  }

  if (!/[a-z]/.test(password)) {
    return "La contraseña debe incluir una letra minúscula.";
  }

  if (!/\d/.test(password)) {
    return "La contraseña debe incluir un número.";
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    return "La contraseña debe incluir un carácter especial.";
  }

  return "";
};

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();
  const token = useMemo(() => searchParams.get("token")?.trim() ?? "", [searchParams]);

  const [nuevaContrasenia, setNuevaContrasenia] = useState("");
  const [confirmarContrasenia, setConfirmarContrasenia] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const submitReset = async () => {
    if (!token) {
      const message = "El enlace de recuperación no es válido o está incompleto.";
      setError(message);
      showToast(message, "error");
      return;
    }

    const passwordError = validatePassword(nuevaContrasenia);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (nuevaContrasenia !== confirmarContrasenia) {
      setError("La confirmación de la contraseña no coincide.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const message = await authApi.resetPassword(token, nuevaContrasenia, confirmarContrasenia);
      setIsSuccess(true);
      showToast(message, "success");
      router.push("/");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "No fue posible restablecer la contraseña.";
      setError(message);
      showToast(message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    void submitReset();
  };

  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
      <h1 className="mb-2 text-3xl font-bold text-primary">Restablecer contraseña</h1>
      <p className="mb-6 text-sm text-text-muted">
        Crea una nueva contraseña para tu cuenta con el enlace que recibiste por correo.
      </p>

      {!token && (
        <div className="mb-6 rounded-lg border border-accent-red/20 bg-accent-red/10 px-4 py-3 text-sm text-accent-red">
          Este enlace no incluye un token válido. Solicita uno nuevo desde la pantalla de recuperación.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="new-password" className="label-base">
            Nueva contraseña
          </label>
          <input
            id="new-password"
            type="password"
            value={nuevaContrasenia}
            onChange={(event) => {
              setNuevaContrasenia(event.target.value);
              setError("");
            }}
            disabled={isLoading || isSuccess}
            className={`input-base ${error ? "input-error" : ""}`}
          />
          <p className="mt-2 text-xs text-text-muted">{PASSWORD_HELP}</p>
        </div>

        <div>
          <label htmlFor="confirm-password" className="label-base">
            Confirmar contraseña
          </label>
          <input
            id="confirm-password"
            type="password"
            value={confirmarContrasenia}
            onChange={(event) => {
              setConfirmarContrasenia(event.target.value);
              setError("");
            }}
            disabled={isLoading || isSuccess}
            className={`input-base ${error ? "input-error" : ""}`}
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading || isSuccess || !token}
          className="btn-primary w-full"
        >
          {isLoading ? "Actualizando..." : "Guardar nueva contraseña"}
        </button>
      </form>

      <div className="mt-6 flex flex-col gap-2 text-sm text-text-muted">
        <Link href="/auth/recuperar-contrasena" className="font-semibold text-primary hover:underline">
          Solicitar un nuevo enlace
        </Link>
        <Link href="/" className="font-semibold text-primary hover:underline">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}