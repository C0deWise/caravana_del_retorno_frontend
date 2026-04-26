import { useEffect, useState } from "react";
import { returnRegistrationService } from "../../returnRegistrationForm/services/returnRegistration.service";
import type { Retorno } from "../../types/retorno.types";

interface UseActiveReturnResult {
  activeReturn: Retorno | null;
  loading: boolean;
  error: string | null;
}

export function useActiveReturn(): UseActiveReturnResult {
  const [activeReturn, setActiveReturn] = useState<Retorno | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchActiveReturn = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await returnRegistrationService.getActiveReturn();
        if (!isMounted) return;
        setActiveReturn(result);
      } catch {
        if (!isMounted) return;
        setError("No fue posible verificar el retorno activo. Intenta nuevamente.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void fetchActiveReturn();

    return () => {
      isMounted = false;
    };
  }, []);

  return { activeReturn, loading, error };
}
