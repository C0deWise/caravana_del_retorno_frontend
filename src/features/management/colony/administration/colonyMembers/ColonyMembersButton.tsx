"use client";

import { useState } from "react";
import { UsersIcon } from "@heroicons/react/24/solid";
import { AnimatedModal } from "@/components/feedback/AnimatedModal";
import type { ColonyData } from "@/types/colony.types";
import { ColonyMembersModal } from "./ColonyMembersModal";

interface ColonyMembersButtonProps {
  readonly colony: ColonyData;
}

export function ColonyMembersButton({ colony }: ColonyMembersButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="flex w-[165px] items-center justify-center gap-2 px-4 py-2 bg-accent-yellow text-text-inverse hover:opacity-90 rounded-xl text-sm font-semibold transition-all shadow-md active:scale-95 cursor-pointer"
        title="Ver miembros"
      >
        <UsersIcon className="w-5 h-5" />
        <span>Miembros</span>
      </button>

      <AnimatedModal isOpen={isOpen} onBackdropClick={closeModal}>
        <div className="w-full max-w-md mx-auto">
          <ColonyMembersModal colony={colony} onClose={closeModal} />
        </div>
      </AnimatedModal>
    </>
  );
}
