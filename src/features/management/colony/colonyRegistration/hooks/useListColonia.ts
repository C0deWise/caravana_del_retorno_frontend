import { useCallback, useState } from 'react';
import type { ColoniaItem, ColoniaResponse } from '../types/colonia.types';
import { coloniaService } from '../services/colonia.service';

// ─── Toggle: cambia a false para usar el servicio real ───────────────────────
const USE_MOCK = true;
// ─────────────────────────────────────────────────────────────────────────────

// Simula latencia de red (ms)
const MOCK_DELAY = 800;

// Simula un error de red. Cambia a true para probar el estado de error.
const MOCK_ERROR = false;

const MOCK_COLONIAS: ColoniaItem[] = [
    // Colombia → con departamento y ciudad
    { codigo: '001', pais: 'Colombia', departamento: 'Antioquia',    ciudad: 'Medellín'     },
    { codigo: '002', pais: 'Colombia', departamento: 'Cundinamarca', ciudad: 'Bogotá'       },
    { codigo: '003', pais: 'Colombia', departamento: 'Valle',        ciudad: 'Cali'         },
    { codigo: '004', pais: 'Colombia', departamento: 'Atlántico',    ciudad: 'Barranquilla' },
    { codigo: '005', pais: 'Colombia', departamento: 'Santander',    ciudad: 'Bucaramanga'  },
    // Extranjeros → solo país (sin departamento ni ciudad)
    { codigo: '006', pais: 'México', departamento: null, ciudad: null },
    { codigo: '007', pais: 'Argentina', departamento: null, ciudad: null },
    { codigo: '008', pais: 'Chile', departamento: null, ciudad: null },
    { codigo: '009', pais: 'Perú', departamento: null, ciudad: null },
    { codigo: '010', pais: 'España', departamento: null, ciudad: null },
];

// ── Mock service ─────────────────────────────────────────────────────────────
const mockListColonia = async (): Promise<ColoniaResponse<ColoniaItem[]>> => {
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

const realListColonia = async (): Promise<ColoniaResponse<ColoniaItem[]>> => {
    // return await coloniaService.getColonias();
    throw new Error('Servicio real no configurado. Conecta coloniaService.');
};

// ── Hook ──────────────────────────────────────────────────────────────────────
interface UseListColoniaReturn {
    listColonia: () => Promise<ColoniaResponse<ColoniaItem[]> | null>;
    loading: boolean;
    error: string | null;
}

export const useListColonia = (): UseListColoniaReturn => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const listColonia = useCallback(async (): Promise<ColoniaResponse<ColoniaItem[]> | null> => {
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