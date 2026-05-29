"use client";

import { useState } from "react";

interface UseRemoveMemberReturn {
  removeMember: (usuarioId: number, grupoId: number) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function useRemoveMember(): UseRemoveMemberReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const removeMember = async (_usuarioId: number, _grupoId: number): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: conectar cuando el endpoint esté disponible
      // await grupalReturnRegistrationService.removeMember(_usuarioId, _grupoId);
      await Promise.resolve();
    } catch {
      setError("Error al eliminar el miembro del grupo.");
    } finally {
      setIsLoading(false);
    }
  };

  return { removeMember, isLoading, error };
}