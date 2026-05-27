"use client";

import React, { useMemo, useState } from "react";
import { ConfirmModal } from "@/components/feedback/confirmModal";
import Spinner from "@/components/feedback/Spinner";
import type { RegistroGrupoRetorno, RegistroGrupoRetornoRequest } from "../../../shared/types/grupalReturnRegistration";
import { useGrupalMembersList } from "../../../shared/hooks/useGrupalMemberList.hook";
import { useEditGrupalRegistration } from "../hooks/useEditGrupalRegistration";

type FormErrors = {
    hospedaje?: string;
    transporte?: string;
    parqueadero_carro?: string;
    parqueadero_moto?: string;
    parqueadero?: string;
};

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

    const [formData, setFormData] = useState({
        hospedaje: registration.num_hospedaje,
        transporte: registration.num_transporte,
        parqueadero_carro: registration.num_parqueadero_carro,
        parqueadero_moto: registration.num_parqueadero_moto,
        anotacion: registration.anotacion ?? "",
    });

    const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const maxParqueadero = memberCount - formData.transporte;
    const allHaveTransport = formData.transporte === memberCount;

    const validateForm = (): boolean => {
        const next: FormErrors = {};

        if (formData.hospedaje < 0 || formData.hospedaje > memberCount)
            next.hospedaje = `Ingresa un valor entre 0 y ${memberCount}`;
        if (formData.transporte < 0 || formData.transporte > memberCount)
            next.transporte = `Ingresa un valor entre 0 y ${memberCount}`;
        if (formData.parqueadero_carro < 0)
            next.parqueadero_carro = "Ingresa un valor válido";
        if (formData.parqueadero_moto < 0)
            next.parqueadero_moto = "Ingresa un valor válido";

        if ((formData.parqueadero_carro + formData.parqueadero_moto) > maxParqueadero) {
            next.parqueadero = `La suma del parqueadero no puede superar ${maxParqueadero} (personas sin transporte).`;
        }

        setFieldErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleNumberChange = (
        field: "hospedaje" | "transporte" | "parqueadero_carro" | "parqueadero_moto",
        value: string,
    ) => {
        const parsed = Math.min(Math.max(0, Number(value)), memberCount);
        setFormData((prev) => {
            const next = { ...prev, [field]: parsed };
            if (field === "transporte") {
                const newMax = memberCount - parsed;
                next.parqueadero_carro = Math.min(prev.parqueadero_carro, newMax);
                next.parqueadero_moto = Math.min(prev.parqueadero_moto, newMax);
            }
            return next;
        });
        setFieldErrors((prev) => ({
            ...prev,
            [field]: undefined,
            ...(field === "transporte" && parsed === 0 ? { parqueadero: undefined } : {}),
        }));
    };

    const confirmDetails = useMemo(
        () => [
            <span key="hospedaje"><strong>Hospedaje:</strong> {formData.hospedaje} personas</span>,
            <span key="transporte"><strong>Transporte:</strong> {formData.transporte} personas</span>,
            ...(formData.transporte < memberCount
                ? [
                    <span key="p-carro"><strong>Parqueadero carro:</strong> {formData.parqueadero_carro}</span>,
                    <span key="p-moto"><strong>Parqueadero moto:</strong> {formData.parqueadero_moto}</span>,
                ]
                : []),
            ...(formData.anotacion
                ? [<span key="anotacion"><strong>Anotación:</strong> <em>{formData.anotacion}</em></span>]
                : []),
        ],
        [formData, memberCount],
    );

    const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateForm()) return;
        setShowConfirmModal(true);
    };

    const handleConfirm = async () => {
        if (!validateForm()) {
            setShowConfirmModal(false);
            return;
        }

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

        if (response) {
            onSuccess(response);
        }
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
                    <div className="flex justify-center py-6">
                        <Spinner size="lg" />
                    </div>
                )}

                {error && (
                    <div className="alert-error mt-4">
                        <p className="alert-error-text">{error}</p>
                    </div>
                )}

                {!membersLoading && (
                    <form className="mt-6 space-y-6" onSubmit={handleSubmit} noValidate>
                        {/* Hospedaje */}
                        <fieldset>
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <legend className="label-primary mb-0">¿El grupo necesita hospedaje?</legend>
                                <div className="stepper">
                                    <button
                                        type="button"
                                        onClick={() => handleNumberChange("hospedaje", String(formData.hospedaje - 1))}
                                        disabled={formData.hospedaje === 0}
                                        className="stepper-btn"
                                    >
                                        -
                                    </button>
                                    <div className="stepper-display">
                                        <span className="stepper-label">
                                            {formData.hospedaje ? "Necesita" : "No necesita"}
                                        </span>
                                        <span className="stepper-value">
                                            {formData.hospedaje}/{memberCount}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleNumberChange("hospedaje", String(formData.hospedaje + 1))}
                                        disabled={formData.hospedaje === memberCount}
                                        className="stepper-btn"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            {fieldErrors.hospedaje && (
                                <p className="validation-error text-sm mt-1">{fieldErrors.hospedaje}</p>
                            )}
                        </fieldset>

                        {/* Transporte */}
                        <fieldset>
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <legend className="label-primary mb-0">¿El grupo necesita transporte?</legend>
                                <div className="stepper">
                                    <button
                                        type="button"
                                        onClick={() => handleNumberChange("transporte", String(formData.transporte - 1))}
                                        disabled={formData.transporte === 0}
                                        className="stepper-btn"
                                    >
                                        -
                                    </button>
                                    <div className="stepper-display">
                                        <span className="stepper-label">
                                            {formData.transporte ? "Necesita" : "No necesita"}
                                        </span>
                                        <span className="stepper-value">
                                            {formData.transporte}/{memberCount}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleNumberChange("transporte", String(formData.transporte + 1))}
                                        disabled={formData.transporte === memberCount}
                                        className="stepper-btn"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            {fieldErrors.transporte && (
                                <p className="validation-error text-sm mt-1">{fieldErrors.transporte}</p>
                            )}
                        </fieldset>

                        {/* Parqueadero carro */}
                        {formData.transporte < memberCount && (
                            <fieldset>
                                <div className="flex items-center justify-between gap-3">
                                    <legend className="label-primary mb-0">¿El grupo necesita parqueadero para carro?</legend>
                                    <div className="stepper">
                                        <button
                                            type="button"
                                            onClick={() => handleNumberChange("parqueadero_carro", String(formData.parqueadero_carro - 1))}
                                            disabled={formData.parqueadero_carro === 0}
                                            className="stepper-btn"
                                        >
                                            -
                                        </button>
                                        <div className="stepper-display">
                                            <span className="stepper-label">
                                                {formData.parqueadero_carro ? "Necesita" : "No necesita"}
                                            </span>
                                            <span className="stepper-value">
                                                {formData.parqueadero_carro}/{maxParqueadero}
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleNumberChange("parqueadero_carro", String(formData.parqueadero_carro + 1))}
                                            disabled={formData.parqueadero_carro + formData.parqueadero_moto >= maxParqueadero}
                                            className="stepper-btn"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                {fieldErrors.parqueadero_carro && (
                                    <p className="validation-error text-sm mt-1">{fieldErrors.parqueadero_carro}</p>
                                )}
                            </fieldset>
                        )}

                        {/* Parqueadero moto */}
                        {formData.transporte < memberCount && (
                            <fieldset>
                                <div className="flex items-center justify-between gap-3">
                                    <legend className="label-primary mb-0">¿El grupo necesita parqueadero para moto?</legend>
                                    <div className="stepper">
                                        <button
                                            type="button"
                                            onClick={() => handleNumberChange("parqueadero_moto", String(formData.parqueadero_moto - 1))}
                                            disabled={formData.parqueadero_moto === 0}
                                            className="stepper-btn"
                                        >
                                            -
                                        </button>
                                        <div className="stepper-display">
                                            <span className="stepper-label">
                                                {formData.parqueadero_moto ? "Necesita" : "No necesita"}
                                            </span>
                                            <span className="stepper-value">
                                                {formData.parqueadero_moto}/{maxParqueadero}
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleNumberChange("parqueadero_moto", String(formData.parqueadero_moto + 1))}
                                            disabled={formData.parqueadero_carro + formData.parqueadero_moto >= maxParqueadero}
                                            className="stepper-btn"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                {fieldErrors.parqueadero_moto && (
                                    <p className="validation-error text-sm mt-1">{fieldErrors.parqueadero_moto}</p>
                                )}
                            </fieldset>
                        )}

                        {fieldErrors.parqueadero && (
                            <div className="alert-error mt-0">
                                <p className="alert-error-text">{fieldErrors.parqueadero}</p>
                            </div>
                        )}

                        {/* Anotación */}
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
                                onChange={(e) => setFormData((prev) => ({ ...prev, anotacion: e.target.value }))}
                                placeholder={`Escribe aquí cualquier información relevante para tu grupo (máximo ${maxLength} caracteres)...`}
                            />
                            <p className="validation-message validation-info mt-1 text-right">
                                {formData.anotacion.length}/{maxLength}
                            </p>
                        </div>

                        <div className="flex justify-center gap-4 pt-1">
                            <button
                                type="button"
                                className="btn-primary min-w-36 inline-flex items-center justify-center"
                                onClick={onCancel}
                                disabled={isLoading}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="btn-primary bg-secondary min-w-36 inline-flex items-center justify-center gap-2"
                                disabled={isLoading}
                            >
                                {isLoading ? <Spinner size="sm" /> : "Guardar cambios"}
                            </button>
                        </div>
                    </form>
                )}
            </div>

            <ConfirmModal
                isOpen={showConfirmModal}
                title="¿Confirmas los cambios en el registro del grupo?"
                details={confirmDetails}
                onConfirm={handleConfirm}
                onCancel={() => setShowConfirmModal(false)}
                loading={isLoading}
                confirmLabel="Confirmar"
                cancelLabel="Cancelar"
            />
        </div>
    );
}
