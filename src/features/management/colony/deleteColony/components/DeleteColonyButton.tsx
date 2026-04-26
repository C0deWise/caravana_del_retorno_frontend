"use client";

import { useState } from "react";
import { TrashIcon } from "@heroicons/react/24/solid";
import { ConfirmModal } from "@/components/confirmModal";
import { useDeleteColony } from "../hooks/useDeleteColony";

interface DeleteColonyButtonProps {
  readonly colonyId: number;
  readonly colonyName: string;
  readonly onSuccess?: () => void;
}

export function DeleteColonyButton({
  colonyId,
  colonyName,
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
        className="p-2 text-danger hover:bg-danger/10 rounded-lg transition-colors group"
        title={`Eliminar colonia ${colonyName}`}
      >
        <TrashIcon className="w-5 h-5 transition-transform group-hover:scale-110" />
      </button>

      <ConfirmModal
        isOpen={isModalOpen}
        title=""
        details={[
          <span key="confirm-delete">
            ¿Está seguro de eliminar la colonia <strong>{colonyName}</strong>?
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
