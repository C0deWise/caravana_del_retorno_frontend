"use client";

import { useState } from "react";
import { UserPlusIcon, ArrowPathIcon } from "@heroicons/react/24/solid";
import { AnimatedModal } from "@/components/feedback/AnimatedModal";
import { AssignLeaderModalForm } from "./AssignLeaderModalForm";
import type { ColonyData } from "@/types/colony.types";

interface AssignLeaderButtonProps {
  readonly colony: ColonyData;
  readonly onRefresh?: () => void;
}

export function AssignLeaderButton({
  colony,
  onRefresh,
}: AssignLeaderButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleSuccess = () => {
    closeModal();
    onRefresh?.();
  };

  const hasLeader = colony.lider > 0;
  const textButton = hasLeader ? "Cambiar Líder" : "Asignar Líder";

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className={`flex items-center justify-center gap-2 px-4 py-2 text-text-inverse hover:opacity-90 rounded-xl text-sm font-semibold transition-all shadow-md active:scale-95 cursor-pointer ${
          hasLeader ? "bg-secondary" : "bg-primary"
        }`}
        title={textButton}
      >
        {hasLeader ? (
          <ArrowPathIcon className="w-5 h-5" />
        ) : (
          <UserPlusIcon className="w-5 h-5" />
        )}
        <span>{textButton}</span>
      </button>

      <AnimatedModal isOpen={isOpen} onBackdropClick={closeModal}>
        <div className="w-full bg-bg rounded-2xl shadow-2xl border border-bg-border">
          <div className="p-1">
            <AssignLeaderModalForm
              colony={colony}
              onSuccess={handleSuccess}
              onCancel={closeModal}
            />
          </div>
        </div>
      </AnimatedModal>
    </>
  );
}

