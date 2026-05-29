"use client";

import { useRef, useState } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";
import { AnimatedModal } from "@/components/feedback/AnimatedModal";
import { CreateRetornoModalForm } from "./CreateRetornoModalForm";

interface CreateRetornoButtonProps {
  readonly onRefresh?: () => void;
}

export function CreateRetornoButton({ onRefresh }: CreateRetornoButtonProps) {
  const formRef = useRef<{ reset: () => void }>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    formRef.current?.reset();
  };

  const handleSuccess = () => {
    closeModal();
    onRefresh?.();
  };

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="flex items-center gap-2 px-4 py-2 bg-accent-green text-text-inverse hover:opacity-90 rounded-xl font-semibold transition-all shadow-md active:scale-95 cursor-pointer"
        title="Nuevo Retorno"
      >
        <PlusIcon className="w-7 h-7" />
        <span>Nuevo Retorno</span>
      </button>

      <AnimatedModal isOpen={isOpen} onBackdropClick={closeModal}>
        <div className="w-full bg-bg rounded-2xl shadow-2xl border border-bg-border">
          <div className="p-1">
            <CreateRetornoModalForm
              ref={formRef}
              onSuccess={handleSuccess}
              onCancel={closeModal}
            />
          </div>
        </div>
      </AnimatedModal>
    </>
  );
}
