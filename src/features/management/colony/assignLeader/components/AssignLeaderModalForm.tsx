"use client";

import { useState, useCallback } from "react";
import { useAssignLeaderToColony } from "../hooks/UseAssignLeaderToColony";
import { useSearchLeader } from "../hooks/useSearchLeader";
import type { UserSearchResult, SearchMode } from "../types/leader.types";
import type { ColonyItem } from "@/types/colony.types";
import { ConfirmModal } from "@/components/confirmModal";
import { Autocomplete } from "@/components/Autocomplete";

interface AssignLeaderModalFormProps {
  readonly colony: ColonyItem;
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
    success,
  } = useAssignLeaderToColony();

  const {
    searchUsers,
    results,
    loading: searchLoading,
  } = useSearchLeader();

  const [searchType, setSearchType] = useState<SearchMode>("nombre");
  const [selectedUser, setSelectedUser] = useState<UserSearchResult | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleSearch = useCallback((query: string) => {
    searchUsers(searchType, query);
  }, [searchType, searchUsers]);

  const handleSelectUser = (user: UserSearchResult) => {
    setSelectedUser(user);
  };

  const handleModalConfirm = async () => {
    if (!selectedUser) return;
    const ok = await assignLeader(colony.codigo, selectedUser.id);
    if (ok) {
      onSuccess?.();
    }
    setShowConfirmModal(false);
  };

  const error = assignError;

  return (
    <div className="p-6 bg-bg">
      <h2 className="text-xl font-bold text-primary mb-1">Asignar Líder</h2>
      <p className="text-sm text-text-muted mb-6">
        Selecciona el usuario para la colonia:{" "}
        <span className="font-semibold text-text">
          {colony.ciudad || colony.pais}
        </span>
      </p>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-accent-red/10 border border-accent-red/20 text-accent-red text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 rounded-lg bg-accent-green/10 border border-accent-green/20 text-accent-green text-sm font-medium">
          Líder asignado exitosamente
        </div>
      )}

      <div className="space-y-6">
        {/* Selector de tipo de búsqueda con animación sliding */}
        <div className="relative flex bg-bg-card p-1 rounded-xl border border-bg-border overflow-hidden">
          {/* Fondo deslizante */}
          <div
            className="absolute top-1 bottom-1 transition-all duration-300 ease-out bg-bg rounded-lg shadow-sm"
            style={{
              width: "calc(50% - 4px)",
              left: searchType === "nombre" ? "4px" : "calc(50%)"
            }}
          />

          {(["nombre", "documento"] as SearchMode[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => {
                setSearchType(type);
                setSelectedUser(null);
              }}
              className={`relative z-10 flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors duration-300 ${searchType === type
                ? "text-primary"
                : "text-text-muted hover:text-text"
                }`}
            >
              {type === "documento" ? "Por Documento" : "Por Nombre"}
            </button>
          ))}
        </div>

        {/* Buscador Generalizado */}
        <Autocomplete<UserSearchResult>
          key={searchType}
          placeholder={searchType === "documento" ? "Ej: 123456..." : "Ej: Juan Pérez..."}
          onSearch={handleSearch}
          results={results}
          loading={searchLoading}
          onSelect={handleSelectUser}
          getDisplayValue={(user) => searchType === "documento" ? user.documento : `${user.nombre} ${user.apellido}`}
          renderItem={(user, isHighlighted) => (
            <div className="px-4 py-2.5">
              <p className={`text-sm font-semibold ${isHighlighted ? "text-primary" : "text-text"}`}>
                {user.nombre} {user.apellido}
              </p>
              <p className="text-xs text-text-muted">{user.documento}</p>
            </div>
          )}
        />

        {selectedUser && (
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 animate-in zoom-in-95 duration-200">
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Confirmar Selección</p>
            <p className="text-sm font-bold text-text">
              {selectedUser.nombre} {selectedUser.apellido}
            </p>
            <p className="text-xs text-text-muted">{selectedUser.documento}</p>
          </div>
        )}

        <div className="flex gap-3 pt-2">
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
        title="¿Confirmar Asignación?"
        details={[
          <span key="1">Asignar a <strong>{selectedUser?.nombre} {selectedUser?.apellido}</strong> como líder de la colonia <strong>{colony.ciudad || colony.pais}</strong>.</span>
        ]}
        onConfirm={handleModalConfirm}
        onCancel={() => setShowConfirmModal(false)}
        loading={assignLoading}
      />
    </div>
  );
}
