"use client";

import { useState } from "react";

interface UseRemoveExternalPersonReturn {
  removeExternalPerson: (personaId: number, grupoId: number) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function useRemoveExternalPerson(): UseRemoveExternalPersonReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const removeExternalPerson = async (_personaId: number, _grupoId: number): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: conectar cuando el endpoint esté disponible
      // await personaService.desasociarGrupo(_personaId, _grupoId);
      await Promise.resolve();
    } catch {
      setError("Error al eliminar la persona externa del grupo.");
    } finally {
      setIsLoading(false);
    }
  };

  return { removeExternalPerson, isLoading, error };
}