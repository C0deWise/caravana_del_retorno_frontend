"use client";

import { useEffect, useState } from "react";
import { XMarkIcon, UserPlusIcon, UserIcon } from "@heroicons/react/24/outline";
import {
  KINSHIP_TYPE_OPTIONS,
  KinshipType,
} from "../../types/relationship.type";
import type { UserSearchResult } from "@/types/user.types";
import { useRequestRelationship } from "../hooks/useRequestRelationship";
import Spinner from "@/components/feedback/Spinner";
import { UserSearchField } from "@/components/forms/UserSearchField";
import { AnimatedModal } from "@/components/feedback/AnimatedModal";
import { SelectField } from "@/components/forms/SelectField";

interface RequestRelationshipModalProps {
  readonly isOpen: boolean;
  readonly solicitanteId: number;
  readonly onClose: () => void;
  readonly onSuccess: () => void;
}

export function RequestRelationshipModal({
  isOpen,
  solicitanteId,
  onClose,
  onSuccess,
}: RequestRelationshipModalProps) {
  const [selectedUserId, setSelectedUserId] = useState<number | "">("");
  const [selectedUser, setSelectedUser] = useState<UserSearchResult | null>(null);
  const [selectedKinship, setSelectedKinship] = useState<KinshipType | "">("");

  const { isSubmitting, error, success, requestRelationship, reset } =
    useRequestRelationship();

  useEffect(() => {
    if (isOpen) {
      reset();
      setSelectedUserId("");
      setSelectedUser(null);
      setSelectedKinship("");
    }
  }, [isOpen, reset]);

  useEffect(() => {
    if (!success) return;

    const timer = setTimeout(() => {
      onSuccess();
      onClose();
    }, 1500);

    return () => clearTimeout(timer);
  }, [success, onSuccess, onClose]);

  const handleSelectUser = (user: UserSearchResult) => {
    setSelectedUserId(user.id);
    setSelectedUser(user);
  };

  const handleClearUser = () => {
    setSelectedUserId("");
    setSelectedUser(null);
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedUserId || !selectedKinship) return;
    await requestRelationship(solicitanteId, Number(selectedUserId), selectedKinship);
  };

  return (
    <AnimatedModal isOpen={isOpen} onBackdropClick={onClose}>
      <div className="rounded-2xl bg-bg-card shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 id="modal-title" className="text-lg font-bold text-primary">
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
        <form onSubmit={handleSubmit} className="space-y-5 px-6 pb-6 pt-2">
          {/* Search user */}
          <div className="space-y-3">
            {selectedUser ? (
              <div className="flex items-center justify-between p-3 rounded-xl border border-primary/20 bg-primary/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <UserIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-primary">
                      {selectedUser.nombre} {selectedUser.apellido}
                    </p>
                    <p className="text-xs text-text-muted">
                      {selectedUser.documento}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleClearUser}
                  className="p-1.5 text-text-muted hover:text-danger transition-colors"
                  title="Cambiar usuario"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <UserSearchField
                label="Buscar usuario destinatario"
                variant="autocomplete"
                onSelect={handleSelectUser}
                excludeIds={[solicitanteId]}
              />
            )}
          </div>

          {/* Kinship type */}
          <SelectField
            label="Tipo de parentesco"
            options={KINSHIP_TYPE_OPTIONS}
            value={KINSHIP_TYPE_OPTIONS.find((opt) => opt.value === selectedKinship)}
            onChange={(option) => setSelectedKinship(option?.value || "")}
            placeholder="Selecciona un tipo..."
          />

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
                <UserPlusIcon className="h-4 w-4" />
              )}
              Enviar solicitud
            </button>
          </div>
        </form>
      </div>
    </AnimatedModal>
  );
}

