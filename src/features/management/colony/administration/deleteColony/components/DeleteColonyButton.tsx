"use client";

import { useState, useEffect } from "react";
import { TrashIcon } from "@heroicons/react/24/solid";
import { ConfirmModal } from "@/components/feedback/confirmModal";
import { useDeleteColony } from "../hooks/useDeleteColony";
import { useToast } from "@/components/feedback/Toast";

interface DeleteColonyButtonProps {
  readonly colonyId: number;
  readonly fullLocation: string;
  readonly onSuccess?: () => void;
}

export function DeleteColonyButton({
  colonyId,
  fullLocation,
  onSuccess,
}: DeleteColonyButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { deleteColony, loading, error } = useDeleteColony();
  const { showToast } = useToast();

  useEffect(() => {
    if (error) showToast(error, "error");
  }, [error, showToast]);

  const handleDelete = async () => {
    const success = await deleteColony(colonyId);
    setIsModalOpen(false);
    if (success) {
      showToast(`¡La colonia ${fullLocation} fue eliminada correctamente!`, "success");
      onSuccess?.();
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="flex items-center justify-center gap-2 px-4 py-2 bg-danger text-text-inverse hover:opacity-90 rounded-xl text-sm font-semibold transition-all shadow-md active:scale-95 cursor-pointer"
        title={`Eliminar colonia ${fullLocation}`}
      >
        <TrashIcon className="w-5 h-5" />
        <span>Eliminar</span>
      </button>

      <ConfirmModal
        isOpen={isModalOpen}
        title="Eliminar colonia"
        details={[
          <span key="confirm-delete">
            ¿Está seguro de eliminar la colonia{" "}
            <strong>{fullLocation}</strong>?
          </span>,
        ]}
        onConfirm={handleDelete}
        onCancel={() => setIsModalOpen(false)}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        loading={loading}
      />
    </>
  );
}

