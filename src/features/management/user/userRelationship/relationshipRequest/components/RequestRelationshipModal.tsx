"use client";

import { useState } from "react";
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
import { useToast } from "@/components/feedback/Toast";

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
  const { showToast } = useToast();

  const { isSubmitting, requestRelationship, reset } =
    useRequestRelationship();

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      reset();
      setSelectedUserId("");
      setSelectedUser(null);
      setSelectedKinship("");
    }, 300);
  };

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
    if (!selectedUserId || !selectedKinship || !selectedUser) return;

    const fullName = `${selectedUser.nombre} ${selectedUser.apellido}`.trim();
    const result = await requestRelationship(solicitanteId, Number(selectedUserId), selectedKinship, fullName);

    if (result.success) {
      showToast(`La solicitud a ${selectedUser.nombre} ${selectedUser.apellido} se ha enviado con éxito`, "success");
      onSuccess();
    } else {
      showToast(result.errorMsg || "Error al enviar la solicitud", "error");
    }
    handleClose();
  };

  return (
    <AnimatedModal isOpen={isOpen} onBackdropClick={handleClose}>
      <div className="rounded-2xl bg-bg-card shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 id="modal-title" className="text-lg font-bold text-primary">
            Solicitar parentesco
          </h2>
          <button
            type="button"
            onClick={handleClose}
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

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-xl px-4 py-2 text-sm text-text-muted transition-colors hover:bg-gray-100 hover:text-text"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!selectedUserId || !selectedKinship || isSubmitting}
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

