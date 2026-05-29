"use client";

import Spinner from "@/components/feedback/Spinner";
import { useRegistrationSelector } from "../hooks/useRegistrationSelector.hook";
import { RequireAuth } from "@/auth/components/RequireAuth";

function RegistrationSelectorContent() {
    const {
        isLoading, isCreating, error, createError,
        noColony, noActiveReturn,
        selectIndividual, selectGrupal,
    } = useRegistrationSelector();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Spinner size="lg" />
            </div>
        );
    }

    if (noColony) return (
        <div className="flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-xl rounded-2xl bg-bg-card p-8 shadow-md text-center">
                <h1 className="page-title">Registro al Retorno</h1>
                <p className="text-text text-lg font-medium mt-4">No tienes colonia asignada.</p>
                <p className="text-text-muted mt-2">Para registrarte debes hacer parte de una colonia.</p>
            </div>
        </div>
    );

    if (noActiveReturn) return (
        <div className="flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-xl rounded-2xl bg-bg-card p-8 shadow-md text-center">
                <h1 className="page-title">Registro al Retorno</h1>
                <p className="text-text text-lg font-medium mt-4">No hay un retorno activo habilitado.</p>
                <p className="text-text-muted mt-2">Cuando un retorno sea habilitado podrás completar tu registro.</p>
            </div>
        </div>
    );

    return (
        <div className="flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-xl rounded 2xl bg-bg-card p-8 shadow-md">
                <h1 className="page-title mb-1">Registro al Retorno</h1>
                <h2 className="section-title mb-2">Selecciona cómo desesas registrar tu asistencia</h2>

                {(error ?? createError) && (
                    <div className="alert-error mb-6">
                        <p className="alert-error-text">{error ?? createError}</p>
                    </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                    <button
                        type="button"
                        className="btn-secondary group flex flex-col items-start gap-2 rounded-xl p-6 text-left"
                        onClick={selectIndividual}
                        disabled={isCreating}
                    >
                        <span className="text-2xl font-bold mb-6 text-gray-500 group-hover:text-white">Individual</span>
                        <span className="text text-muted text-sm">Registra tu asistencia de forma personal</span>
                    </button>

                    <button
                        type="button"
                        className="btn-secondary group flex flex-col items-start gap-2 rounded-xl p-6 text-left"
                        onClick={selectGrupal}
                        disabled={isCreating}
                    >
                        {isCreating ? (
                            <Spinner size="sm" />
                        ) : (
                            <>
                                <span className="text-2xl font-bold mb-6 text-gray-500 group-hover:text-white">Grupal</span>
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