"use client";

import React, { useState } from "react";
import { ConfirmModal } from "@/components/feedback/confirmModal";
import type { RegistroGrupoRetorno, RegistroGrupoRetornoRequest } from "../../../shared/types/grupalReturnRegistration";
import Spinner from "@/components/feedback/Spinner";
import { useSendGrupalRegistration } from "../hooks/useSendGrupalRegistration";
import { useGrupalMembersList } from "../../../shared/hooks/useGrupalMemberList.hook";
import { useRegistrationForm } from "../../../shared/hooks/useRegistrationForm.hook";
import { StepperField } from "@/components/forms/StepperField";
import { AnotacionField } from "@/components/forms/AnotationField";

interface GrupalRegistrationFormProps {
    readonly retornoId: number;
    readonly grupoId: number;
    readonly retornoAnio?: number;
    readonly onSuccess?: (record: RegistroGrupoRetorno) => void;
}

const INITIAL_FORM = {
    hospedaje: 0,
    transporte: 0,
    parqueadero_carro: 0,
    parqueadero_moto: 0,
    anotacion: "",
};

export function GrupalRegistrationForm({
    retornoId,
    grupoId,
    retornoAnio,
    onSuccess,
}: GrupalRegistrationFormProps) {
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [submittedRecord, setSubmittedRecord] = useState<RegistroGrupoRetorno | null>(null);
    const { sendGrupalRegistration, isLoading, error } = useSendGrupalRegistration();
    const maxLength = 150;
    const { members } = useGrupalMembersList(grupoId);
    const memberCount = members.length + 1; // +1 por el líder

    const {
        formData, fieldErrors, maxParqueadero,
        validateForm, handleNumberChange, handleAnotacionChange, confirmDetails,
    } = useRegistrationForm(INITIAL_FORM, memberCount);

    const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateForm()) return;
        setShowConfirmModal(true);
    };

    const handleConfirm = async () => {
        if (!validateForm()) { setShowConfirmModal(false); return; }

        const payload: RegistroGrupoRetornoRequest = {
            retorno: retornoId,
            cod_grupo: grupoId,
            num_hospedaje: formData.hospedaje,
            num_transporte: formData.transporte,
            num_parqueadero_carro: formData.transporte === 0 ? 0 : formData.parqueadero_carro,
            num_parqueadero_moto: formData.transporte === 0 ? 0 : formData.parqueadero_moto,
            anotacion: formData.anotacion || undefined,
        };

        const response = await sendGrupalRegistration(payload);
        setShowConfirmModal(false);
        if (response) {
            setSubmittedRecord(response);
            onSuccess?.(response);
        }
    };

    if (submittedRecord) {
        return (
            <div className="w-full max-w-2xl rounded-2xl bg-bg-card p-8 shadow-md">
                <h2 className="section-title">Inscripción grupal exitosa</h2>
                <div className="alert-success mt-0">
                    <p className="alert-success-text">El grupo fue inscrito correctamente.</p>
                </div>
                <ul className="mt-4 list-disc pl-6 text-text space-y-1">
                    {confirmDetails.map(({ key, label, value }) => (
                        <li key={key}><strong>{label}:</strong> {value}</li>
                    ))}
                </ul>
            </div>
        );
    }

    return (
        <div className="bg-white px-4 py-6">
            <div className="mx-auto w-full max-w-2xl rounded-2xl bg-bg p-6 shadow-md sm:p-8">
                <h1 className="page-title">
                    {retornoAnio
                        ? `Registro de Asistencia para El Retorno ${retornoAnio}`
                        : `El Retorno #${retornoId}`}
                </h1>
                <h2 className="section-title">Confirma las necesidades de tu grupo</h2>

                {error && (
                    <div className="alert-error mt-4"><p className="alert-error-text">{error}</p></div>
                )}

                <form className="mt-6 space-y-6" onSubmit={handleSubmit} noValidate>
                    <StepperField
                        legend="¿El grupo necesita hospedaje?"
                        value={formData.hospedaje}
                        max={memberCount}
                        onDecrement={() => handleNumberChange("hospedaje", String(formData.hospedaje - 1))}
                        onIncrement={() => handleNumberChange("hospedaje", String(formData.hospedaje + 1))}
                        error={fieldErrors.hospedaje}
                    />
                    <StepperField
                        legend="¿El grupo necesita transporte?"
                        value={formData.transporte}
                        max={memberCount}
                        onDecrement={() => handleNumberChange("transporte", String(formData.transporte - 1))}
                        onIncrement={() => handleNumberChange("transporte", String(formData.transporte + 1))}
                        error={fieldErrors.transporte}
                    />

                    {formData.transporte < memberCount && (
                        <>
                            <StepperField
                                legend="¿El grupo necesita parqueadero para carro?"
                                value={formData.parqueadero_carro}
                                max={maxParqueadero}
                                onDecrement={() => handleNumberChange("parqueadero_carro", String(formData.parqueadero_carro - 1))}
                                onIncrement={() => handleNumberChange("parqueadero_carro", String(formData.parqueadero_carro + 1))}
                                error={fieldErrors.parqueadero_carro}
                            />
                            <StepperField
                                legend="¿El grupo necesita parqueadero para moto?"
                                value={formData.parqueadero_moto}
                                max={maxParqueadero}
                                onDecrement={() => handleNumberChange("parqueadero_moto", String(formData.parqueadero_moto - 1))}
                                onIncrement={() => handleNumberChange("parqueadero_moto", String(formData.parqueadero_moto + 1))}
                                error={fieldErrors.parqueadero_moto}
                            />
                        </>
                    )}

                    {fieldErrors.parqueadero && (
                        <div className="alert-error mt-0">
                            <p className="alert-error-text">{fieldErrors.parqueadero}</p>
                        </div>
                    )}



                    <AnotacionField
                        value={formData.anotacion}
                        maxLength={maxLength}
                        onChange={handleAnotacionChange}
                    />

                    <div className="flex justify-center pt-1">
                        <button
                            type="submit"
                            className="btn-primary bg-secondary min-w-48 inline-flex items-center justify-center gap-2"
                            disabled={isLoading}
                        >
                            {isLoading ? <Spinner size="sm" /> : "Inscribir grupo"}
                        </button>
                    </div>
                </form>
            </div>

            <ConfirmModal
                isOpen={showConfirmModal}
                title="¿Confirmas la inscripción del grupo?"
                details={confirmDetails.map(({ key, label, value }) => (
                    <span key={key}><strong>{label}:</strong> {value}</span>
                ))}
                onConfirm={handleConfirm}
                onCancel={() => setShowConfirmModal(false)}
                loading={isLoading}
                confirmLabel="Confirmar"
                cancelLabel="Cancelar"
            />
        </div>
    );
}