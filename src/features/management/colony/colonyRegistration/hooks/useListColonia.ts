import { useCallback, useState } from 'react';
import type { ColonyData, ColonyResponse } from '@/types/colony.types';
//import { coloniaService } from '../services/colonia.service';

// ─── Toggle: cambia a false para usar el servicio real ───────────────────────
const USE_MOCK = true;
// ─────────────────────────────────────────────────────────────────────────────

// Simula latencia de red (ms)
const MOCK_DELAY = 800;

// Simula un error de red. Cambia a true para probar el estado de error.
const MOCK_ERROR = false;

const MOCK_COLONIAS: ColonyData[] = [
    // Colombia → con departamento y ciudad
    { id: 1, country: 'Colombia', department: 'Antioquia', city: 'Medellín' },
    { id: 2, country: 'Colombia', department: 'Cundinamarca', city: 'Bogotá' },
    { id: 3, country: 'Colombia', department: 'Valle', city: 'Cali' },
    { id: 4, country: 'Colombia', department: 'Atlántico', city: 'Barranquilla' },
    { id: 5, country: 'Colombia', department: 'Santander', city: 'Bucaramanga' },
    // Extranjeros → solo país (sin departamento ni ciudad)
    { id: 6, country: 'México', department: null, city: null },
    { id: 7, country: 'Argentina', department: null, city: null },
    { id: 8, country: 'Chile', department: null, city: null },
    { id: 9, country: 'Perú', department: null, city: null },
    { id: 10, country: 'España', department: null, city: null },
];

// ── Mock service ─────────────────────────────────────────────────────────────
const mockListColonia = async (): Promise<ColonyResponse<ColonyData[]>> => {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));

    if (MOCK_ERROR) {
        throw new Error('Error simulado de red');
    }

    return {
        success: true,
        data: MOCK_COLONIAS,
        message: 'Colonias cargadas correctamente (mock)',
    };
};

// ── Real service (importado condicionalmente) ─────────────────────────────────

const realListColonia = async (): Promise<ColonyResponse<ColonyData[]>> => {
    // return await coloniaService.getColonias();
    throw new Error('Servicio real no configurado. Conecta coloniaService.');
};

// ── Hook ──────────────────────────────────────────────────────────────────────
interface UseListColoniaReturn {
    listColonia: () => Promise<ColonyResponse<ColonyData[]> | null>;
    loading: boolean;
    error: string | null;
}

export const useListColonia = (): UseListColoniaReturn => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const listColonia = useCallback(async (): Promise<ColonyResponse<ColonyData[]> | null> => {
        setLoading(true);
        setError(null);

        try {
            const response = await (USE_MOCK ? mockListColonia() : realListColonia());

            if (!response.success) {
                setError(response.message || 'Error al listar las colonias');
                return null;
            }

            return response;
        } catch (err) {
            const mensaje = err instanceof Error ? err.message : 'Error al listar las colonias';
            setError(mensaje);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return { listColonia, loading, error };
};