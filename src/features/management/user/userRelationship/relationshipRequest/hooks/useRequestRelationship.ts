"use client";

import { useCallback, useState } from "react";
import { ApiError } from "@/services/api.services";
import { requestRelationshipService } from "../services/requestRelationship.service";
import type { KinshipType } from "../../types/relationship.type";

interface UseRequestRelationshipReturn {
  isSubmitting: boolean;
  error: string | null;
  success: boolean;
  requestRelationship: (
    solicitanteId: number,
    destinatarioId: number,
    tipoParentesco: KinshipType,
    targetName?: string,
  ) => Promise<{ success: boolean; errorMsg?: string }>;
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
      targetName?: string,
    ): Promise<{ success: boolean; errorMsg?: string }> => {
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
        return { success: true };
      } catch (err) {
        const apiError = err as ApiError;
        let errMsg = "";
        switch (apiError.status) {
          case 422:
            errMsg = "Datos inválidos. Revisa el destinatario y tipo de parentesco.";
            break;
          case 400:
            errMsg = targetName
              ? `Ya tienes una relación de parentesco o solicitud pendiente con ${targetName}`
              : "Ya existe una relación de parentesco con este usuario.";
            break;
          case 404:
            errMsg = "No se encontró el usuario destinatario.";
            break;
          default:
            errMsg = apiError.message || "Error al enviar la solicitud.";
        }
        setError(errMsg);
        return { success: false, errorMsg: errMsg };
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
