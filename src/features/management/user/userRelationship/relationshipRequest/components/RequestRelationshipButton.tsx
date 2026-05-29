"use client";

import { useState, useCallback } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { RequestRelationshipModal } from "./RequestRelationshipModal";

interface RequestRelationshipButtonProps {
  readonly solicitanteId: number;
  readonly onSuccess?: () => void;
}

export function RequestRelationshipButton({
  solicitanteId,
  onSuccess,
}: RequestRelationshipButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpen = useCallback(() => setIsModalOpen(true), []);
  const handleClose = useCallback(() => setIsModalOpen(false), []);

  const handleSuccess = useCallback(() => {
    handleClose();
    onSuccess?.();
  }, [handleClose, onSuccess]);

  return (
    <>
      <button
        type="button"
        id="btn-solicitar-parentesco"
        onClick={handleOpen}
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-semibold text-text-inverse transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] shadow-md"
      >
        <PlusIcon className="h-5 w-5" />
        Solicitar parentesco
      </button>

      <RequestRelationshipModal
        isOpen={isModalOpen}
        solicitanteId={solicitanteId}
        onClose={handleClose}
        onSuccess={handleSuccess}
      />
    </>
  );
}
