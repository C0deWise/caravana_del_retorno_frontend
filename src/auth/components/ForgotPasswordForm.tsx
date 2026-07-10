"use client";

import { useState } from "react";
import Link from "next/link";

import { useToast } from "@/components/feedback/Toast";
import { authApi } from "@/services/auth.api";

const isValidEmail = (value: string): boolean => {
  const email = value.trim();
  const atIndex = email.indexOf("@");
  const dotIndex = email.lastIndexOf(".");

  return atIndex > 0 && dotIndex > atIndex + 1 && dotIndex < email.length - 1;
};

export default function ForgotPasswordForm() {
  const [correo, setCorreo] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const { showToast } = useToast();

  const submitRequest = async () => {
    const normalizedCorreo = correo.trim().toLowerCase();

    if (!isValidEmail(normalizedCorreo)) {
      setError("Ingresa un correo electrónico válido.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const message = await authApi.requestPasswordReset(normalizedCorreo);
      setSuccessMessage(message);
      showToast(message, "success");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "No fue posible procesar la solicitud.";
      setError(message);
      showToast(message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    void submitRequest();
  };

  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
      <h1 className="mb-2 text-3xl font-bold text-primary">Recuperar contraseña</h1>
      <p className="mb-6 text-sm text-text-muted">
        Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="recovery-email" className="label-base">
            Correo electrónico
          </label>
          <input
            id="recovery-email"
            type="email"
            value={correo}
            onChange={(event) => {
              setCorreo(event.target.value);
              setError("");
            }}
            placeholder="usuario@correo.com"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "recovery-email-error" : undefined}
            disabled={isLoading}
            className={`input-base ${error ? "input-error" : ""}`}
          />
        </div>

        {error && (
          <p id="recovery-email-error" role="alert" className="text-sm text-danger">
            {error}
          </p>
        )}

        {successMessage && !error && (
          <output className="block rounded-lg bg-accent-green/10 px-4 py-3 text-sm text-accent-green">
            {successMessage}
          </output>
        )}

        <button
          type="submit"
          disabled={isLoading || !correo.trim()}
          className="btn-primary w-full"
        >
          {isLoading ? "Enviando..." : "Enviar enlace"}
        </button>
      </form>

      <p className="mt-6 text-sm text-text-muted">
        <Link href="/" className="font-semibold text-primary hover:underline">
          Volver al inicio
        </Link>
      </p>
    </div>
  );
}