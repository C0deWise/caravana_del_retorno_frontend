"use client";

import React, { useState, useMemo } from "react";
import { ConfirmModal } from "@/components/feedback/confirmModal";
import type { RegistroGrupoRetorno, RegistroGrupoRetornoRequest } from "../../types/grupalReturnRegistration";
import Spinner from "@/components/feedback/Spinner";
import { useSendGrupalRegistration } from "../hooks/useSendGrupalRegistration";
import { useGrupalMembersList } from "../../hooks/useGrupalMemberList.hook";

type Answer = 0 | 1;

type FormErrors = {
    hospedaje?: string;
    transporte?: string;
    parqueadero_carro?: string;
    parqueadero_moto?: string;
    parqueadero?: string;
};

const initialForm: {
    hospedaje: number | "";
    transporte: number | "";
    parqueadero_carro: number | "";
    parqueadero_moto: number | "";
    anotacion: string;
} = {
    hospedaje: 0,
    transporte: 0,
    parqueadero_carro: 0,
    parqueadero_moto: 0,
    anotacion: "",
};

interface GrupalRegistrationFormProps {
    readonly retornoId: number;
    readonly grupoId: number;
    readonly retornoAnio?: number;
    readonly onSuccess?: (record: RegistroGrupoRetorno) => void;
}

export function GrupalRegistrationForm({
    retornoId,
    grupoId,
    retornoAnio,
    onSuccess,
}: GrupalRegistrationFormProps) {
    const [formData, setFormData] = useState(initialForm);
    const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [submittedRecord, setSubmittedRecord] = useState<RegistroGrupoRetorno | null>(null);
    const { sendGrupalRegistration, isLoading, error } = useSendGrupalRegistration();
    const maxLength = 150;
    const { members } = useGrupalMembersList(grupoId);
    const memberCount = members.length + 1; // +1 por el líder
    const maxParqueadero = memberCount - (formData.transporte as number);

    const validateForm = (): boolean => {
        const next: FormErrors = {};

        if (formData.hospedaje === "" || formData.hospedaje < 0 || formData.hospedaje > memberCount)
            next.hospedaje = `Ingresa un valor entre 0 y ${memberCount}`;
        if (formData.transporte === "" || formData.transporte < 0 || formData.transporte > memberCount)
            next.transporte = `Ingresa un valor entre 0 y ${memberCount}`;
        if (formData.parqueadero_carro === "" || formData.parqueadero_carro < 0)
            next.parqueadero_carro = "Ingresa un valor válido";
        if (formData.parqueadero_moto === "" || formData.parqueadero_moto < 0)
            next.parqueadero_moto = "Ingresa un valor válido";

        if (formData.parqueadero_carro !== "" &&
            formData.parqueadero_moto !== "" &&
            (formData.parqueadero_carro + formData.parqueadero_moto) > maxParqueadero
        ) {
            next.parqueadero = `La suma del parqueadero no puede superar ${maxParqueadero} (personas con transporte).`;
        }

        setFieldErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleNumberChange = (
        field: "hospedaje" | "transporte" | "parqueadero_carro" | "parqueadero_moto",
        value: string,
    ) => {
        const parsed = value === "" ? "" : Math.min(Math.max(0, Number(value)), memberCount);
        setFormData((prev) => {
            const next = { ...prev, [field]: parsed };
            if (field === "transporte") {
                const newMax = memberCount - (parsed as number);
                next.parqueadero_carro = Math.min(prev.parqueadero_carro as number, newMax);
                next.parqueadero_moto = Math.min(prev.parqueadero_moto as number, newMax);
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
            ...((formData.transporte as number) < memberCount
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
            retorno: retornoId,
            cod_grupo: grupoId,
            num_hospedaje: formData.hospedaje as Answer,
            num_transporte: formData.transporte as Answer,
            num_parqueadero_carro: formData.transporte === 0 ? 0 : (formData.parqueadero_carro as Answer),
            num_parqueadero_moto: formData.transporte === 0 ? 0 : (formData.parqueadero_moto as Answer),
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
                    {confirmDetails.map((detail) => (
                        <li key={(detail as React.ReactElement).key}>{detail}</li>
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
                        ? ` Registro de Asistencia para El Retorno ${retornoAnio}`
                        : ` El Retorno #${retornoId}`}
                </h1>
                <h2 className="section-title">Confirma las necesidades de tu grupo</h2>

                {error && (
                    <div className="alert-error mt-4">
                        <p className="alert-error-text">{error}</p>
                    </div>
                )}

                <form className="mt-6 space-y-6" onSubmit={handleSubmit} noValidate>
                    {/* Hospedaje */}
                    <fieldset>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <legend className="label-primary mb-0">¿El grupo necesita hospedaje?</legend>
                            <div className="stepper">
                                <button
                                    type="button"
                                    onClick={() => handleNumberChange("hospedaje", String((formData.hospedaje as number) - 1))}
                                    disabled={!formData.hospedaje}
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
                                    onClick={() => handleNumberChange("hospedaje", String((formData.hospedaje as number || 0) + 1))}
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
                                    onClick={() => handleNumberChange("transporte", String((formData.transporte as number) - 1))}
                                    disabled={!formData.transporte}
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
                                    onClick={() => handleNumberChange("transporte", String((formData.transporte as number || 0) + 1))}
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

                    {(formData.transporte as number) < memberCount && (
                        <fieldset>
                            <div className="flex items-center justify-between gap-3">
                                <legend className="label-primary mb-0">¿El grupo necesita parqueadero para carro?</legend>
                                <div className="stepper">
                                    <button
                                        type="button"
                                        onClick={() => handleNumberChange("parqueadero_carro", String((formData.parqueadero_carro as number) - 1))}
                                        disabled={!formData.parqueadero_carro}
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
                                        onClick={() => handleNumberChange("parqueadero_carro", String((formData.parqueadero_carro as number || 0) + 1))}
                                        disabled={(formData.parqueadero_carro as number) + (formData.parqueadero_moto as number) >= maxParqueadero}
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

                    {(formData.transporte as number) < memberCount && (
                        <fieldset>
                            <div className="flex items-center justify-between gap-3">
                                <legend className="label-primary mb-0">¿El grupo necesita parqueadero para moto?</legend>
                                <div className="stepper">
                                    <button
                                        type="button"
                                        onClick={() => handleNumberChange("parqueadero_moto", String((formData.parqueadero_moto as number) - 1))}
                                        disabled={!formData.parqueadero_moto}
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
                                        onClick={() => handleNumberChange("parqueadero_moto", String((formData.parqueadero_moto as number || 0) + 1))}
                                        disabled={(formData.parqueadero_carro as number) + (formData.parqueadero_moto as number) >= maxParqueadero}
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
                            Notas adicionales <span className="validation-message validation-info mt-1">(Opcional)</span>
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