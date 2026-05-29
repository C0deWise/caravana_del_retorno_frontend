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

            const persona = await personaService.getByDocumento(documento);

            if (persona) {
                setFoundPersona(persona);
                setStep("found");
            } else {
                setFoundPersona(null);
                setStep("not_found")
            }
        } catch (err) {
            if (err instanceof ApiError && err.status === 404) {
                setFoundPersona(null);
                setStep("not_found");
            } else {
                setError(err instanceof ApiError ? err.message : "Error al buscar a la persona");
            }
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
            const nueva = await personaService.create(data);
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