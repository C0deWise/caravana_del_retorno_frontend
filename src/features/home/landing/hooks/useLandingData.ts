"use client";

import { useEffect, useState } from "react";
import { landingService } from "../services/landing.service";
import type { LandingData } from "../types/landing.types";

/** Estado "finalizado" de un retorno (ver `RetornoEstado` en el backend). */
const FINISHED_RETURN_STATE = "finalizado";

interface UseLandingDataReturn extends LandingData {
  loading: boolean;
}

/**
 * Carga, en paralelo, los datos reales que muestra "¿Quiénes somos?":
 * colonias activas, retornos realizados y total de publicaciones.
 *
 * Cada fuente se resuelve de forma independiente: si una falla, su valor
 * queda en `null` y la UI simplemente la omite, sin afectar a las demás.
 * Deliberadamente NO se consulta el número de retornantes.
 */
export const useLandingData = (): UseLandingDataReturn => {
  const [data, setData] = useState<LandingData>({
    colonies: null,
    finishedReturns: null,
    publications: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Evita actualizar estado si el componente se desmonta antes de responder.
    let cancelled = false;

    const loadColonies = landingService
      .getActiveColonies()
      .catch(() => null);

    const loadReturnsAndPublications = landingService
      .getReturns()
      .then(async (returns) => {
        const finishedReturns = returns.filter(
          (retorno) => retorno.estado === FINISHED_RETURN_STATE,
        ).length;
        const publications = await landingService
          .countPublications(returns)
          .catch(() => null);
        return { finishedReturns, publications };
      })
      .catch(() => ({ finishedReturns: null, publications: null }));

    Promise.all([loadColonies, loadReturnsAndPublications]).then(
      ([colonies, { finishedReturns, publications }]) => {
        if (cancelled) return;
        setData({ colonies, finishedReturns, publications });
        setLoading(false);
      },
    );

    return () => {
      cancelled = true;
    };
  }, []);

  return { ...data, loading };
};
