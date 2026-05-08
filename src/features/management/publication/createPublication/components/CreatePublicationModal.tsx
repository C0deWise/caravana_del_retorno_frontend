"use client";

import { useState } from "react";
import { useAuth } from "@/auth/context/AuthContext";
import { useCreatePublication } from "../hooks/useCreatePublication";

interface CreatePublicationModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

export function CreatePublicationModal({ isOpen, onClose }: CreatePublicationModalProps) {
  const { user } = useAuth();
  const { createPublication, isLoading, error } = useCreatePublication();

  const [titulo, setTitulo] = useState("");
  const [resena, setResena] = useState("");
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) return;

    const codigoAutor = user.id;
    const codigoColonia = user.codigo_colonia ?? 0;
    const codigoRetorno = (user as unknown as Record<string, unknown>).codigo_retorno as number | undefined ?? 0;

    try {
      await createPublication({
        titulo,
        resena,
        codigo_autor: codigoAutor,
        codigo_colonia: codigoColonia,
        codigo_retorno: codigoRetorno,
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setTitulo("");
        setResena("");
        onClose();
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-lg rounded-lg bg-bg p-6 shadow-xl border border-bg-border">
        <h2 className="mb-4 text-2xl font-bold text-text">Crear Nueva Publicación</h2>

        {success ? (
          <div className="rounded-lg bg-success/10 p-4 text-success border border-success/20">
            ¡Publicación creada exitosamente!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="titulo" className="mb-1 block text-sm font-medium text-text-muted">
                Título
              </label>
              <input
                id="titulo"
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
                className="w-full rounded-lg border border-bg-border bg-bg-card p-3 text-text outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="Ingresa el título de la publicación"
              />
            </div>

            <div>
              <label htmlFor="resena" className="mb-1 block text-sm font-medium text-text-muted">
                Reseña
              </label>
              <textarea
                id="resena"
                value={resena}
                onChange={(e) => setResena(e.target.value)}
                required
                rows={4}
                className="w-full rounded-lg border border-bg-border bg-bg-card p-3 text-text outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="Escribe el contenido de tu publicación..."
              />
            </div>

            {error && <p className="text-sm text-danger">{error}</p>}

            <div className="mt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="rounded-lg border border-bg-border px-4 py-2 text-sm font-medium text-text hover:bg-bg-separator disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading || !titulo.trim() || !resena.trim()}
                className="rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-text-inverse hover:bg-secondary/90 disabled:opacity-50"
              >
                {isLoading ? "Creando..." : "Crear Publicación"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
