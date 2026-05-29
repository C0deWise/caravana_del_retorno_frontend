"use client";

import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useAssignLeaderToColony } from "../hooks/useAssignLeader";
import { useGetUser } from "@/hooks/useGetUser";
import type { UserSearchResult } from "@/types/user.types";
import type { ColonyData } from "@/types/colony.types";
import { ConfirmModal } from "@/components/feedback/confirmModal";
import { UserSearchField } from "@/components/forms/UserSearchField";
import { ExpandableContent } from "@/components/layout/ExpandableContent";
import { useToast } from "@/components/feedback/Toast";

interface AssignLeaderModalFormProps {
  readonly colony: ColonyData;
  readonly onSuccess?: () => void;
  readonly onCancel?: () => void;
}

export function AssignLeaderModalForm({
  colony,
  onSuccess,
  onCancel,
}: AssignLeaderModalFormProps) {
  const {
    assignLeader,
    loading: assignLoading,
    error: assignError,
  } = useAssignLeaderToColony();

  const {
    getUser,
    user: currentLeader,
    loading: currentLeaderLoading,
  } = useGetUser();

  const { showToast } = useToast();

  const [selectedUser, setSelectedUser] = useState<UserSearchResult | null>(
    null,
  );
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const hasLeader = colony.lider !== null && colony.lider > 0;

  useEffect(() => {
    if (hasLeader && colony.lider !== null) {
      getUser(colony.lider);
    }
  }, [hasLeader, colony.lider, getUser]);

  const handleSelectUser = (user: UserSearchResult) => {
    setSelectedUser(user);
  };

  const fullLocation = colony.departamento
    ? `${colony.ciudad}, ${colony.departamento}, ${colony.pais}`
    : colony.pais;

  const handleModalConfirm = async () => {
    if (!selectedUser) return;
    const ok = await assignLeader({
      coloniaCodigo: colony.codigo,
      liderId: selectedUser.id,
      isChange: hasLeader,
    });
    
    setShowConfirmModal(false);
    
    if (ok) {
      showToast(`¡Líder ${selectedUser.nombre} asignado a ${fullLocation} con éxito!`, "success");
      onSuccess?.();
    }
  };

  useEffect(() => {
    if (assignError) {
      if (selectedUser) {
        showToast(
          `El usuario ${selectedUser.nombre} ${selectedUser.apellido} no se pudo asignar como líder en la colonia de ${fullLocation}.`,
          "error"
        );
      } else {
        showToast(assignError, "error");
      }
      onCancel?.();
    }
  }, [assignError, showToast, selectedUser, fullLocation, onCancel]);


  const getLeaderContent = () => {
    if (currentLeaderLoading) {
      return (
        <p className="text-xs text-text-muted italic animate-pulse">
          Cargando información del líder...
        </p>
      );
    }

    if (currentLeader) {
      return (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold text-sm">
            {currentLeader.nombre.charAt(0)}
            {currentLeader.apellido.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-bold text-text">
              {currentLeader.nombre} {currentLeader.apellido}
            </p>
            <p className="text-xs text-text-muted">
              CC: {currentLeader.documento}
            </p>
          </div>
        </div>
      );
    }

    return (
      <p className="text-xs text-text-muted italic">
        No se pudo cargar la información (ID: {colony.lider})
      </p>
    );
  };

  return (
    <div className="p-6 bg-bg">
      <h2 className="text-xl font-bold text-primary mb-1">
        {hasLeader ? "Cambiar Líder de Colonia" : "Asignar Líder de Colonia"}
      </h2>
      <p className="text-sm text-text-muted mb-4">
        Selecciona el usuario abajo para designar como líder de la colonia{" "}
        <span className="font-semibold text-text">{fullLocation}</span>
      </p>

      {hasLeader && (
        <div className="mb-6 p-4 rounded-xl bg-secondary/5 border border-secondary/20 animate-in fade-in slide-in-from-top-1 duration-300">
          <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-1">
            Líder Actual
          </p>
          {getLeaderContent()}
        </div>
      )}



      <div className="space-y-6">
        <UserSearchField
          variant="autocomplete"
          onSelect={handleSelectUser}
          onModeChange={() => setSelectedUser(null)}
          excludeIds={hasLeader && colony.lider !== null ? [colony.lider] : []}
        />

        <ExpandableContent isOpen={!!selectedUser}>
          <div className="px-4 py-3 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">
                Selección
              </p>
              <p className="text-sm font-bold text-text">
                {selectedUser?.nombre} {selectedUser?.apellido}
              </p>
              <p className="text-xs text-text-muted">
                {selectedUser?.documento}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedUser(null)}
              className="flex items-center justify-center p-2 text-text-inverse bg-accent-red hover:opacity-90 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
              title="Limpiar selección"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </ExpandableContent>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => setShowConfirmModal(true)}
            disabled={!selectedUser || assignLoading}
            className="flex-1 py-3.5 rounded-xl font-bold bg-secondary text-text-inverse hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            {assignLoading ? "Asignando..." : "Confirmar Líder"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3.5 rounded-xl font-bold border border-bg-border text-text hover:bg-bg-card transition-all"
          >
            Cancelar
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirmModal}
        title={hasLeader ? "Cambiar líder" : "Asignar líder"}
        details={[
          <span key="1">
            {hasLeader ? "¿Cambiar" : "¿Asignar"} a{" "}
            <strong>
              {selectedUser?.nombre} {selectedUser?.apellido}
            </strong>{" "}
            como líder de la colonia <strong>{fullLocation}</strong>?
          </span>,
        ]}
        onConfirm={handleModalConfirm}
        onCancel={() => setShowConfirmModal(false)}
        loading={assignLoading}
      />
    </div>
  );
}

