"use client";

import Spinner from "@/components/feedback/Spinner";
import { useRegistrationSelector } from "../hooks/useRegistrationSelector.hook";
import { RequireAuth } from "@/auth/components/RequireAuth";

function RegistrationSelectorContent() {
    const {
        isLoading,
        isCreating,
        error,
        createError,
        selectIndividual,
        selectGrupal,
    } = useRegistrationSelector();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-xl rounded 2xl bg-bg-card p-8 shadow-md">
                <h1 className="page-title mb-2">Registro al retorno</h1>
                <h2 className="text-text-muted mb-8">Selecciona cómo desesas registrar tu asistencia</h2>

                {(error ?? createError) && (
                    <div className="alert-error mb-6">
                        <p className="alert-error-text">{error ?? createError}</p>
                    </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                    <button
                        type="button"
                        className="btn-secondary flex flex-col items-start gap-2 rounded-xl p-6 text-left"
                        onClick={selectIndividual}
                        disabled={isCreating}
                    >
                        <span className="section-title">Individual</span>
                        <span className="text text-muted text-sm">Registra tu asistencia de forma personal</span>
                    </button>

                    <button
                        type="button"
                        className="btn-secondary flex flex-col items-start gap-2 rounded-xl p-6 text-left"
                        onClick={selectGrupal}
                        disabled={isCreating}
                    >
                        {isCreating ? (
                            <Spinner size="sm" />
                        ) : (
                            <>
                                <span className="section-title">Grupal</span>
                                <span className="text text-muted text-sm">Crea un grupo y coordina el viaje con tu familia y amigos</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function RegistrationSelector() {
    return (
        <RequireAuth roles={["usuario", "lider_colonia"]}>
            <RegistrationSelectorContent />
        </RequireAuth>
    )
}