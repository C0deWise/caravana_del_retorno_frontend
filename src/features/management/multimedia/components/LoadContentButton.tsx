"use client";

import { useState } from "react";
import { AnimatedModal } from "@/components/feedback/AnimatedModal";
import LoadContentModalForm from "./LoadContentModalForm";

export default function LoadContentButton() {
  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-3.5 rounded-xl bg-primary text-white font-bold hover:opacity-90 transition-opacity"
      >
        Añadir archivos
      </button>

      <AnimatedModal isOpen={isOpen} onBackdropClick={() => setIsOpen(false)}>
        <div className="w-full max-w-2xl bg-bg rounded-2xl shadow-2xl border border-bg-border">
          <div className="p-1">
            <LoadContentModalForm
              onSuccess={handleSuccess}
              onCancel={() => setIsOpen(false)}
            />
          </div>
        </div>
      </AnimatedModal>
    </>
  );
}
