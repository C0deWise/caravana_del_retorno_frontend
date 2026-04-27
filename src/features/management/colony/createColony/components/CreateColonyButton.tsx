"use client";

import { useRef, useEffect } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { CreateColonyModalForm } from "./CreateColonyModalForm";

interface CreateColonyButtonProps {
  readonly onRefresh?: () => void;
}

export function CreateColonyButton({ onRefresh }: CreateColonyButtonProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const openModal = () => dialogRef.current?.showModal();
  const closeModal = () => dialogRef.current?.close();

  const handleSuccess = () => {
    closeModal();
    onRefresh?.();
  };

  useEffect(() => {
    const handleBackdropClick = (event: MouseEvent) => {
      if (event.target === dialogRef.current) {
        closeModal();
      }
    };

    const dialog = dialogRef.current;
    dialog?.addEventListener("click", handleBackdropClick);
    return () => dialog?.removeEventListener("click", handleBackdropClick);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="flex items-center gap-2 px-4 py-2 bg-accent-green text-text-inverse hover:opacity-90 rounded-xl font-bold transition-all shadow-md active:scale-95"
        title="Nueva Colonia"
      >
        <PlusIcon className="w-5 h-5" />
        <span>Nueva Colonia</span>
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
            <CreateColonyModalForm
              onSuccess={handleSuccess}
              onCancel={closeModal}
            />
          </div>
        </div>
      </dialog>
    </>
  );
}
