"use client";

import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";
import { CreatePublicationModal } from "./CreatePublicationModal";
import { RequireAuth } from "@/auth/components/RequireAuth";

interface CreatePublicationButtonProps {
  readonly onRefresh?: () => void;
}

export function CreatePublicationButton({ onRefresh }: CreatePublicationButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <RequireAuth>
      <>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-accent-green text-text-inverse hover:opacity-90 rounded-xl font-semibold transition-all shadow-md active:scale-95 cursor-pointer"
          title="Nueva Publicación"
        >
          <PlusIcon className="w-7 h-7" />
          <span>Nueva Publicación</span>
        </button>

        <CreatePublicationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onRefresh={onRefresh}
        />
      </>
    </RequireAuth>
  );
}
