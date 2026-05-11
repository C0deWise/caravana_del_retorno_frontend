"use client";

import { useCallback, useState } from "react";
import { removeColonyMember } from "../services/colony-members.service";
import { ApiError } from "@/services/api.services";

export function useRemoveColonyMember() {
  const [isRemoving, setIsRemoving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const removeMember = useCallback(
    async (colonyCodigo: number, memberId: number): Promise<void> => {
      setIsRemoving(true);
      setError(null);

      try {
        await removeColonyMember(colonyCodigo, memberId);
      } catch (err) {
        const apiError = err as ApiError;
        let message = apiError.message || "Error al eliminar el miembro.";

        switch (apiError.status) {
          case 404:
            message = "Colonia o usuario no encontrado.";
            break;
          case 409:
            message = "Conflicto de negocio - No se puede remover al usuario.";
            break;
          case 422:
            message = "Body inválido o campos faltantes.";
            break;
          case 403:
            message = "No tienes permisos para eliminar este miembro.";
            break;
        }

        setError(message);
        throw new Error(message);
      } finally {
        setIsRemoving(false);
      }
    },
    [],
  );

  const reset = useCallback(() => setError(null), []);

  return { removeMember, isRemoving, error, reset };
}
