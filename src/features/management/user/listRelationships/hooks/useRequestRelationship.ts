"use client";

import { useCallback, useState } from "react";
import { ApiError } from "@/services/api.services";
import { requestRelationshipService } from "../services/relationship.service";
import type { KinshipType } from "../types/relationship.type";

interface UseRequestRelationshipReturn {
  isSubmitting: boolean;
  error: string | null;
  success: boolean;
  requestRelationship: (
    solicitanteId: number,
    destinatarioId: number,
    tipoParentesco: KinshipType,
  ) => Promise<boolean>;
  reset: () => void;
}

export function useRequestRelationship(): UseRequestRelationshipReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const requestRelationship = useCallback(
    async (
      solicitanteId: number,
      destinatarioId: number,
      tipoParentesco: KinshipType,
    ): Promise<boolean> => {
      setIsSubmitting(true);
      setError(null);
      setSuccess(false);

      try {
        await requestRelationshipService({
          codigo_solicitante: solicitanteId,
          codigo_destinatario: destinatarioId,
          tipo_parentesco: tipoParentesco,
        });
        setSuccess(true);
        return true;
      } catch (err) {
        const apiError = err as ApiError;
        switch (apiError.status) {
          case 422:
            setError("Datos inválidos. Revisa el destinatario y tipo de parentesco.");
            break;
          case 409:
            setError("Ya existe una solicitud de parentesco con este usuario.");
            break;
          case 404:
            setError("No se encontró el usuario destinatario.");
            break;
          default:
            setError(apiError.message || "Error al enviar la solicitud.");
        }
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setError(null);
    setSuccess(false);
  }, []);

  return { isSubmitting, error, success, requestRelationship, reset };
}
