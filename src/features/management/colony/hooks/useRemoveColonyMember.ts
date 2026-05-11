import { useCallback, useState } from "react";
import { removeColonyMember } from "../services/colony-members.service";
import { ApiError } from "@/services/api.services";

export function useRemoveColonyMember() {
  const [isRemoving, setIsRemoving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const removeMember = useCallback(
    async (colonyId: number, memberId: number): Promise<void> => {
      setIsRemoving(true);
      setError(null);

      try {
        await removeColonyMember(colonyId, memberId);
      } catch (err) {
        const apiError = err as ApiError;
        switch (apiError.status) { // TODO: Cambiar a las respuestas reales de la API cuando esten disponibles
          case 404:
            setError("El miembro no fue encontrado en esta colonia.");
            break;
          case 403:
            setError("No tienes permisos para eliminar este miembro.");
            break;
          default:
            setError(apiError.message || "Error al eliminar el miembro.");
        }
        throw err;
      } finally {
        setIsRemoving(false);
      }
    },
    [],
  );

  const reset = useCallback(() => setError(null), []);

  return { removeMember, isRemoving, error, reset };
}
