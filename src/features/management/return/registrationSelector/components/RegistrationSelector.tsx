"use client";

import Spinner from "@/components/feedback/Spinner";
import { useRegistrationSelector } from "../hooks/useRegistrationSelector.hook";
import { RequireAuth } from "@/auth/components/RequireAuth";
import { UserIcon, UserGroupIcon } from "@heroicons/react/24/outline";

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
        <div className="flex flex-col h-full w-full items-center justify-center px-4 bg-bg">
            <div className="w-full max-w-lg rounded-3xl bg-bg border border-bg-border p-8 shadow-xl text-center">
                <h1 className="page-title">Registro al Retorno</h1>
                <p className="text-text text-lg font-medium mt-4">No tienes colonia asignada.</p>
                <p className="text-text-muted mt-2">Para registrarte debes hacer parte de una colonia.</p>
            </div>
        </div>
    );

    if (noActiveReturn) return (
        <div className="flex flex-col h-full w-full items-center justify-center px-4 bg-bg">
            <div className="w-full max-w-lg rounded-3xl bg-bg border border-bg-border p-8 shadow-xl text-center">
                <h1 className="page-title">Registro al Retorno</h1>
                <p className="text-text text-lg font-medium mt-4">No hay un retorno activo habilitado.</p>
                <p className="text-text-muted mt-2">Cuando un retorno sea habilitado podrás completar tu registro.</p>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-full w-full items-center justify-center px-4 bg-bg">
            <div className="w-full max-w-2xl rounded-3xl border border-bg-border bg-bg p-8 shadow-xl">
                <h1 className="page-title mb-1 text-center">Registro al Retorno</h1>
                <h2 className="section-title mb-8 text-center">Selecciona cómo deseas registrar tu asistencia</h2>

                {(error ?? createError) && (
                    <div className="alert-error mb-6">
                        <p className="alert-error-text">{error ?? createError}</p>
                    </div>
                )}

                <div className="grid gap-6 sm:grid-cols-2">
                    <button
                        type="button"
                        className="group flex flex-col items-start rounded-3xl border border-bg-border bg-white p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                        onClick={selectIndividual}
                        disabled={isCreating}
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary group-hover:text-white transition-colors duration-300 text-primary mb-4">
                            <UserIcon className="w-6 h-6" />
                        </div>
                        <span className="text-xl font-black text-primary leading-tight group-hover:text-secondary transition-colors mb-2">Individual</span>
                        <span className="text-text-muted text-sm leading-relaxed">Registra tu asistencia de forma personal</span>
                    </button>

                    <button
                        type="button"
                        className="group flex flex-col items-start rounded-3xl border border-bg-border bg-white p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                        onClick={selectGrupal}
                        disabled={isCreating}
                    >
                        {isCreating ? (
                            <div className="flex h-full w-full items-center justify-center py-8">
                                <Spinner size="md" />
                            </div>
                        ) : (
                            <>
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary group-hover:text-white transition-colors duration-300 text-primary mb-4">
                                    <UserGroupIcon className="w-6 h-6" />
                                </div>
                                <span className="text-xl font-black text-primary leading-tight group-hover:text-secondary transition-colors mb-2">Grupal</span>
                                <span className="text-text-muted text-sm leading-relaxed">Crea un grupo y coordina el viaje con tu familia y amigos</span>
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