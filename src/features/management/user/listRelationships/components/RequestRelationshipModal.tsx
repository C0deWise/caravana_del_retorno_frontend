"use client";

import { useEffect, useRef, useState } from "react";
import { XMarkIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { UserByIdResponse, KINSHIP_TYPE_OPTIONS, KinshipType } from "../types/relationship.type";
import { listUsersService } from "../services/relationship.service";
import { useRequestRelationship } from "../hooks/useRequestRelationship";
import Spinner from "@/ui/animations/Spinner";

interface RequestRelationshipModalProps {
  isOpen: boolean;
  solicitanteId: number;
  onClose: () => void;
  onSuccess: () => void;
}

export function RequestRelationshipModal({
  isOpen,
  solicitanteId,
  onClose,
  onSuccess,
}: RequestRelationshipModalProps) {
  const [users, setUsers] = useState<UserByIdResponse[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | "">("");
  const [selectedKinship, setSelectedKinship] = useState<KinshipType | "">("");
  const [searchQuery, setSearchQuery] = useState("");

  const { isSubmitting, error, success, requestRelationship, reset } =
    useRequestRelationship();

  const firstFocusRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    reset();
    setSelectedUserId("");
    setSelectedKinship("");
    setSearchQuery("");

    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const data = await listUsersService();
        setUsers(data.filter((u) => u.id !== solicitanteId));
      } catch {
        setUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    };

    void fetchUsers();
  }, [isOpen, solicitanteId, reset]);

  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => {
      onSuccess();
      onClose();
    }, 1500);
    return () => clearTimeout(timer);
  }, [success, onSuccess, onClose]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => firstFocusRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  const filteredUsers = users.filter((u) => {
    const full = `${u.nombre} ${u.apellido} ${u.documento}`.toLowerCase();
    return full.includes(searchQuery.toLowerCase());
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !selectedKinship) return;
    await requestRelationship(solicitanteId, Number(selectedUserId), selectedKinship);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg rounded-2xl bg-bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2
            id="modal-title"
            className="text-lg font-bold text-primary"
          >
            Solicitar parentesco
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-gray-100 hover:text-text"
            aria-label="Cerrar modal"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {/* Search user */}
          <div className="space-y-1.5">
            <label
              htmlFor="search-user"
              className="block text-sm font-medium text-text"
            >
              Buscar usuario
            </label>
            <input
              id="search-user"
              ref={firstFocusRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedUserId("");
              }}
              placeholder="Nombre, apellido o documento..."
              className="w-full rounded-xl border border-gray-200 bg-bg px-4 py-2.5 text-sm text-text placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* User list */}
          <div className="space-y-1.5">
            <label
              htmlFor="select-user"
              className="block text-sm font-medium text-text"
            >
              Seleccionar usuario destinatario
            </label>

            {loadingUsers ? (
              <div className="flex items-center justify-center py-6">
                <Spinner size="sm" />
              </div>
            ) : (
              <div className="max-h-44 overflow-y-auto rounded-xl border border-gray-200 bg-bg">
                {filteredUsers.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-text-muted">
                    No se encontraron usuarios.
                  </p>
                ) : (
                  filteredUsers.map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => setSelectedUserId(u.id)}
                      className={`w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-primary/5 ${selectedUserId === u.id
                          ? "bg-primary/10 font-medium text-primary"
                          : "text-text"
                        }`}
                    >
                      {u.nombre} {u.apellido}
                      <span className="ml-2 text-xs text-text-muted">
                        {u.documento}
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Kinship type */}
          <div className="space-y-1.5">
            <label
              htmlFor="kinship-type"
              className="block text-sm font-medium text-text"
            >
              Tipo de parentesco
            </label>
            <select
              id="kinship-type"
              value={selectedKinship}
              onChange={(e) => setSelectedKinship(e.target.value as KinshipType)}
              className="w-full rounded-xl border border-gray-200 bg-bg px-4 py-2.5 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Selecciona un tipo...</option>
              {KINSHIP_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3">
              <p className="text-sm text-danger">{error}</p>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="rounded-xl border border-accent-green/30 bg-accent-green/10 px-4 py-3">
              <p className="text-sm text-accent-green">
                ¡Solicitud enviada exitosamente!
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-sm text-text-muted transition-colors hover:bg-gray-100 hover:text-text"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!selectedUserId || !selectedKinship || isSubmitting || success}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <Spinner size="sm" />
              ) : (
                <PaperAirplaneIcon className="h-4 w-4" />
              )}
              Enviar solicitud
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
