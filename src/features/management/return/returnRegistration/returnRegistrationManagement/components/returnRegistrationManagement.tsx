"use client";

import Spinner from "@/components/feedback/Spinner";
import { ConfirmModal } from "@/components/feedback/confirmModal";
import { useState } from "react";
import { useLoadReturnRegistration } from "../../editReturnRegistration/hooks/useLoadReturnRegistration";
import { useSendReturnUnregistration } from "../../returnUnregistration/hook/useSendReturnUnregistration.hook";
import { useReturnRegistrationManagement } from "../hooks/useReturnRegistrationManagement.hook";
import { EditReturnRegistrationForm } from "../../editReturnRegistration/components/EditReturnRegistrationForm";
import type { ReturnRegistrationApi } from "../../types/returnRegistration.types";

type Props = {
    readonly userId: number;
    readonly activeReturnCode: number;
    readonly activeReturnYear: number | null;
    readonly onUnregistered: () => void;
};

type SendUnregistration = ReturnType<typeof useSendReturnUnregistration>["sendReturnUnregistration"];

function parkingLabel(car: number, bike: number): string {
    if (car === 1) return "Sí, para carro";
    if (bike === 1) return "Sí, para moto";
    return "No";
}

function RegistrationSummary({
    registration,
}: {
    readonly registration: ReturnRegistrationApi;
}) {
    return (
        <div className="w-full max-w-2xl rounded-2xl bg-bg-card p-8 shadow-md">
            <p className="text-text-muted mb-2">Tu registro actual:</p>
            <ul className="mt-4 list-disc pl-6 text-text space-y-1">
                <li><strong>Tiene hospedaje: </strong>{registration.num_hospedaje === 0 ? "Sí" : "No"}</li>
                <li><strong>Tiene transporte: </strong>{registration.num_transporte === 0 ? "Sí" : "No"}</li>
                {registration.num_transporte === 0 && (
                    <li>
                        <strong>Parqueadero:</strong>{" "}
                        {parkingLabel(registration.num_parqueadero_carro, registration.num_parqueadero_moto)}
                    </li>
                )}
                {registration.anotacion && (
                    <li><strong>Nota: </strong>{registration.anotacion}</li>
                )}
            </ul>
        </div>
    );
}

function ActionsView({
    registration,
    activeReturnYear,
    unregistrationLoading,
    unregistrationError,
    onEdit,
    onRequestUnregister,
}: {
    readonly registration: ReturnRegistrationApi;
    readonly activeReturnYear: number | null;
    readonly unregistrationLoading: boolean;
    readonly unregistrationError: string | null;
    readonly onEdit: () => void;
    readonly onRequestUnregister: () => void;
}) {
    return (
        <div className="bg-white px-4 py-6 flex items-center justify-center">
            <div className="w-full max-w-2xl rounded-2xl bg-bg-card p-8 shadow-md">
                <h1 className="page-title">Registro de Asistencia al Retorno</h1>
                <h2 className="section-title mb-2">
                    {activeReturnYear
                        ? `Ya estás registrado en El Retorno ${activeReturnYear}`
                        : `Ya estás registrado en El Retorno #${registration.retorno}`}
                </h2>

                <RegistrationSummary registration={registration} />

                {unregistrationError && (
                    <div className="alert-error mt-4">
                        <p className="alert-error-text">{unregistrationError}</p>
                    </div>
                )}

                <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                    <button
                        type="button"
                        className="btn-secondary min-w-40"
                        onClick={onRequestUnregister}
                        disabled={unregistrationLoading}
                    >
                        Cancelar inscripción
                    </button>
                    <button
                        type="button"
                        className="btn-primary min-w-40"
                        onClick={onEdit}
                        disabled={unregistrationLoading}
                    >
                        Editar registro
                    </button>
                </div>
            </div>
        </div>
    );
}

function UnregisteredView({ onDone }: { readonly onDone: () => void }) {
    return (
        <div className="bg-white px-4 py-6 flex items-center justify-center">
            <div className="w-full max-w-xl rounded-2xl bg-bg-card p-8 shadow-md text-center">
                <h1 className="page-title">Registro de Asistencia al Retorno</h1>
                <div className="alert-success mt-4">
                    <p className="alert-success-text">Tu inscripción fue cancelada correctamente.</p>
                </div>
                <div className="mt-8 flex justify-center">
                    <button type="button" className="btn-primary" onClick={onDone}>
                        Aceptar
                    </button>
                </div>
            </div>
        </div>
    );
}

// Componente interno: solo se monta cuando registration ya está garantizado como no-null
type ReadyProps = {
    readonly registration: ReturnRegistrationApi;
    readonly activeReturnCode: number;
    readonly activeReturnYear: number | null;
    readonly onUnregistered: () => void;
    readonly sendReturnUnregistration: SendUnregistration;
    readonly unregistrationLoading: boolean;
    readonly unregistrationError: string | null;
    readonly showConfirmUnregister: boolean;
    readonly setShowConfirmUnregister: (v: boolean) => void;
};

function ReturnRegistrationManagementReady({
    registration,
    activeReturnCode,
    activeReturnYear,
    onUnregistered,
    sendReturnUnregistration,
    unregistrationLoading,
    unregistrationError,
    showConfirmUnregister,
    setShowConfirmUnregister,
}: ReadyProps) {
    const { view, currentRegistration, goToEdit, goToActions, handleUnregistered } =
        useReturnRegistrationManagement(registration);

    const handleConfirmUnregister = async () => {
        const response = await sendReturnUnregistration({
            usuario: registration.usuario,
            retorno: activeReturnCode,
        });
        setShowConfirmUnregister(false);
        if (response) {
            handleUnregistered();
        }
    };

    if (view === "unregistered") {
        return <UnregisteredView onDone={onUnregistered} />;
    }

    if (view === "edit") {
        return (
            <EditReturnRegistrationForm
                registration={currentRegistration}
                activeReturnYear={activeReturnYear}
                onSuccess={goToActions}
                onCancel={() => goToActions(currentRegistration)}
            />
        );
    }

    return (
        <>
            <ActionsView
                registration={currentRegistration}
                activeReturnYear={activeReturnYear}
                unregistrationLoading={unregistrationLoading}
                unregistrationError={unregistrationError}
                onEdit={goToEdit}
                onRequestUnregister={() => setShowConfirmUnregister(true)}
            />
            <ConfirmModal
                isOpen={showConfirmUnregister}
                title="¿Confirmas que deseas cancelar tu inscripción?"
                details={["Esta acción eliminará tu registro de asistencia al retorno."]}
                onConfirm={handleConfirmUnregister}
                onCancel={() => setShowConfirmUnregister(false)}
                loading={unregistrationLoading}
                confirmLabel="Sí, cancelar inscripción"
                cancelLabel="Volver"
            />
        </>
    );
}

export function ReturnRegistrationManagement({
    userId,
    activeReturnCode,
    activeReturnYear,
    onUnregistered,
}: Props) {
    const { registration, loading, error } = useLoadReturnRegistration(userId, activeReturnCode);
    const { sendReturnUnregistration, loading: unregistrationLoading, error: unregistrationError } =
        useSendReturnUnregistration();
    const [showConfirmUnregister, setShowConfirmUnregister] = useState(false);

    if (loading) {
        return (
            <div className="bg-white px-4 py-6 flex items-center justify-center">
                <div className="text-center">
                    <Spinner size="lg" className="mx-auto" />
                    <p className="mt-4 text-text-muted">Cargando tu registro...</p>
                </div>
            </div>
        );
    }

    if (error || !registration) {
        return (
            <div className="bg-white px-4 py-6 flex items-center justify-center">
                <div className="w-full max-w-xl rounded-2xl bg-bg-card p-8 shadow-md text-center">
                    <h1 className="page-title">Registro de Asistencia al Retorno</h1>
                    <div className="alert-error">
                        <p className="alert-error-text">
                            {error ?? "No fue posible cargar tu registro. Intenta nuevamente."}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // A partir de aquí, registration está garantizado como no-null
    return (
        <ReturnRegistrationManagementReady
            registration={registration}
            activeReturnCode={activeReturnCode}
            activeReturnYear={activeReturnYear}
            onUnregistered={onUnregistered}
            sendReturnUnregistration={sendReturnUnregistration}
            unregistrationLoading={unregistrationLoading}
            unregistrationError={unregistrationError}
            showConfirmUnregister={showConfirmUnregister}
            setShowConfirmUnregister={setShowConfirmUnregister}
        />
    );
}