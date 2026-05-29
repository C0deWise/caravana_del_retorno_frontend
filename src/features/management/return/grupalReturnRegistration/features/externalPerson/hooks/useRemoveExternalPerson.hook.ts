"use client";

import { useState } from "react";
import { personaService } from "../services/persona.service";
import { PersonaRequest } from "../types/persona.types";

interface UseRemoveExternalPersonReturn {
  removeExternalPerson: (data: PersonaRequest) => Promise<boolean | null>;
  isLoading: boolean;
  error: string | null;
}

export function useRemoveExternalPerson(): UseRemoveExternalPersonReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const removeExternalPerson = async (data: PersonaRequest): Promise<boolean | null> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Removiendo persona", data);
      const response = await personaService.removerPersona(data);
      if (!response) return null;
      return response;
    } catch {
      setError("Error al eliminar la persona externa del grupo.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { removeExternalPerson, isLoading, error };
}