"use client";

import { useRef, useEffect } from "react";
import { UserPlusIcon } from "@heroicons/react/24/solid";
import { AssignLeaderModalForm } from "./AssignLeaderModalForm";
import type { ColonyItem } from "@/types/colony.types";

interface AssignLeaderButtonProps {
  readonly colony: ColonyItem;
  readonly onRefresh?: () => void;
}

export function AssignLeaderButton({
  colony,
  onRefresh,
}: AssignLeaderButtonProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const openModal = () => dialogRef.current?.showModal();
  const closeModal = () => dialogRef.current?.close();

  const handleSuccess = () => {
    closeModal();
    onRefresh?.();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dialogRef.current?.open &&
        contentRef.current &&
        !contentRef.current.contains(event.target as Node)
      ) {
        closeModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-full text-xs font-bold transition-colors"
        title="Asignar Líder"
      >
        <UserPlusIcon className="w-3.5 h-3.5" />
        Asignar Líder
      </button>

      <dialog
        ref={dialogRef}
        className="bg-transparent border-none p-4 backdrop:bg-black/40 backdrop:backdrop-blur-sm open:flex open:items-center open:justify-center w-full h-full max-w-none max-h-none outline-none overflow-visible"
      >
        <div
          ref={contentRef}
          className="w-full max-w-lg bg-bg rounded-2xl shadow-2xl border border-bg-border animate-in fade-in zoom-in duration-200"
        >
          <div className="p-1">
            <AssignLeaderModalForm
              colony={colony}
              onSuccess={handleSuccess}
              onCancel={closeModal}
            />
          </div>
        </div>
      </dialog>
    </>
  );
}
