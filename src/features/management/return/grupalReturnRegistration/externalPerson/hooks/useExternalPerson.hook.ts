"use client"

import { useCallback, useState } from "react";
import { Persona, PersonaCreateRequest } from "../types/persona.types";
import { personaService } from "../services/persona.service";
import { ApiError } from "@/services/api.services";

type ExternalPersonStep = "search" | "found" | "not_found" | "success";

interface UseExternalPersonReturn {
    step: ExternalPersonStep;
    foundPersona: Persona | null;
    isLoading: boolean;
    error: string | null;
    searchByDocumento: (documento: string) => Promise<void>;
    addFoundPersona: (grupoId: number) => Promise<void>;
    createAndAdd: (data: PersonaCreateRequest, grupoId: number) => Promise<void>;
    reset: () => void;
}

// ── MOCK ──────────────────────────────────────────────────────────────────────
const USE_MOCK = true;
// ─────────────────────────────────────────────────────────────────────────────

export function useExternedPerson(): UseExternalPersonReturn {
    const [step, setStep] = useState<ExternalPersonStep>("search");
    const [foundPersona, setFoundPersona] = useState<Persona | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const reset = useCallback(() => {
        setStep("search");
        setFoundPersona(null);
        setError(null);
    }, []);

    const searchByDocumento = useCallback(async (documento: string) => {
        setIsLoading(true);
        setError(null);

        try {

            if (USE_MOCK) {
                await new Promise((r) => setTimeout(r, 600));
                // Simular persona encontrada con documento "12345678", no encontrada para el resto
                if (documento === "12345678") {
                    setFoundPersona({
                        pe_codigo: 99,
                        pe_tipo_doc: "CC",
                        pe_documento: "12345678",
                        pe_nombre: "María",
                        pe_apellido: "López",
                        pe_correo: "maria@example.com",
                        pe_fecha_nacimiento: "1990-05-15",
                        pe_genero: "F",
                    });
                    setStep("found");
                } else {
                    setFoundPersona(null);
                    setStep("not_found");
                }
                return;
            }

            const persona = await personaService.getByDocumento(documento);

            if (persona) {
                setFoundPersona(persona);
                setStep("found");
            } else {
                setFoundPersona(null);
                setStep("not_found")
            }
        } catch (err) {
            setError(err instanceof ApiError ? err.message : "Error al buscar a la persona")
        } finally {
            setIsLoading(false);
        }
    }, []);


    // Asociar directamente
    const addFoundPersona = useCallback(async (grupoId: number) => {
        if (!foundPersona) return;

        setIsLoading(true);
        setError(null);

        try {
            await personaService.asociarGrupo({ pe_codigo: foundPersona.pe_codigo, gr_codigo: grupoId });
            setStep("success");
        } catch (err) {
            setError(err instanceof ApiError ? err.message : "Error al buscar a la persona")
        } finally {
            setIsLoading(false);
        }
    }, [foundPersona]);

    const createAndAdd = useCallback(async (data: PersonaCreateRequest, grupoId: number) => {
        setIsLoading(true);
        setError(null);

        try {            
            console.log("Creando persona con data:", data);
            const nueva = await personaService.create(data);
            console.log("Creando persona con data:", data);
            await personaService.asociarGrupo({ pe_codigo: nueva.pe_codigo, gr_codigo: grupoId });
            setStep("success");
        } catch (err) {
            setError(err instanceof ApiError ? err.message : "Error al buscar a la persona")
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        step,
        foundPersona,
        isLoading,
        error,
        searchByDocumento,
        addFoundPersona,
        createAndAdd,
        reset,
    }

}