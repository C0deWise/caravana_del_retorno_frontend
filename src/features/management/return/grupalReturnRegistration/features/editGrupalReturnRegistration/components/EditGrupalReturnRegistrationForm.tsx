"use client";

import React, { useState } from "react";
import { ConfirmModal } from "@/components/feedback/confirmModal";
import Spinner from "@/components/feedback/Spinner";
import type { RegistroGrupoRetorno, RegistroGrupoRetornoRequest } from "../../../shared/types/grupalReturnRegistration";
import { useGrupalMembersList } from "../../../shared/hooks/useGrupalMemberList.hook";
import { useEditGrupalRegistration } from "../hooks/useEditGrupalRegistration";
import { useRegistrationForm } from "../../../shared/hooks/useRegistrationForm.hook";
import { StepperField } from "@/components/forms/StepperField";

interface EditGrupalReturnRegistrationFormProps {
    readonly registration: RegistroGrupoRetorno;
    readonly retornoAnio?: number;
    readonly onSuccess: (updated: RegistroGrupoRetorno) => void;
    readonly onCancel: () => void;
}

export function EditGrupalReturnRegistrationForm({
    registration,
    retornoAnio,
    onSuccess,
    onCancel,
}: EditGrupalReturnRegistrationFormProps) {
    const { editRegistration, isLoading, error } = useEditGrupalRegistration();
    const { members, isLoading: membersLoading } = useGrupalMembersList(registration.cod_grupo);
    const memberCount = members.length;
    const maxLength = 150;
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const {
        formData, fieldErrors, maxParqueadero,
        validateForm, handleNumberChange, handleAnotacionChange, confirmDetails,
    } = useRegistrationForm(
        {
            hospedaje: registration.num_hospedaje,
            transporte: registration.num_transporte,
            parqueadero_carro: registration.num_parqueadero_carro,
            parqueadero_moto: registration.num_parqueadero_moto,
            anotacion: registration.anotacion ?? "",
        },
        memberCount,
    );

    const allHaveTransport = formData.transporte === memberCount;

    const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateForm()) return;
        setShowConfirmModal(true);
    };

    const handleConfirm = async () => {
        if (!validateForm()) { setShowConfirmModal(false); return; }

        const payload: RegistroGrupoRetornoRequest = {
            retorno: registration.retorno,
            cod_grupo: registration.cod_grupo,
            num_hospedaje: formData.hospedaje,
            num_transporte: formData.transporte,
            num_parqueadero_carro: allHaveTransport ? 0 : formData.parqueadero_carro,
            num_parqueadero_moto: allHaveTransport ? 0 : formData.parqueadero_moto,
            anotacion: formData.anotacion || undefined,
        };

        const response = await editRegistration(payload, registration.regg_codigo);
        setShowConfirmModal(false);
        if (response) onSuccess(response);
    };

    return (
        <div className="bg-white px-4 py-6 w-full">
            <div className="mx-auto w-full max-w-2xl rounded-2xl bg-bg p-6 shadow-md sm:p-8">
                <h1 className="page-title">
                    {retornoAnio
                        ? `Editar Registro - El Retorno ${retornoAnio}`
                        : `Editar Registro - El Retorno #${registration.retorno}`}
                </h1>
                <h2 className="section-title">Actualiza las necesidades de tu grupo</h2>

                {(isLoading || membersLoading) && (
                    <div className="flex justify-center py-6"><Spinner size="lg" /></div>
                )}
                {error && (
                    <div className="alert-error mt-4"><p className="alert-error-text">{error}</p></div>
                )}

                {!membersLoading && (
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

                        <div>
                            <label htmlFor="anotacion" className="label-primary mb-0">
                                Notas adicionales{" "}
                                <span className="validation-message validation-info mt-1">(Opcional)</span>
                            </label>
                            <textarea
                                id="anotacion"
                                className="textarea-base mt-2"
                                rows={3}
                                maxLength={maxLength}
                                value={formData.anotacion}
                                onChange={(e) => handleAnotacionChange(e.target.value)}
                                placeholder={`Escribe aquí cualquier información relevante para tu grupo (máximo ${maxLength} caracteres)...`}
                            />
                            <p className="validation-message validation-info mt-1 text-right">
                                {formData.anotacion.length}/{maxLength}
                            </p>
                        </div>

                        <div className="flex justify-center gap-4 pt-1">
                            <button type="button" className="btn-primary min-w-36 inline-flex items-center justify-center"
                                onClick={onCancel} disabled={isLoading}>
                                Cancelar
                            </button>
                            <button type="submit" className="btn-primary bg-secondary min-w-36 inline-flex items-center justify-center gap-2"
                                disabled={isLoading}>
                                {isLoading ? <Spinner size="sm" /> : "Guardar cambios"}
                            </button>
                        </div>
                    </form>
                )}
            </div>

            <ConfirmModal
                isOpen={showConfirmModal}
                title="¿Confirmas los cambios en el registro del grupo?"
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