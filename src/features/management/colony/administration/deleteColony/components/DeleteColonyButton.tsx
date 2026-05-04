"use client";

import { useState } from "react";
import { TrashIcon } from "@heroicons/react/24/solid";
import { ConfirmModal } from "@/components/feedback/confirmModal";
import { useDeleteColony } from "../hooks/useDeleteColony";

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
  const { deleteColony, loading } = useDeleteColony();

  const handleDelete = async () => {
    const success = await deleteColony(colonyId);
    if (success) {
      setIsModalOpen(false);
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

