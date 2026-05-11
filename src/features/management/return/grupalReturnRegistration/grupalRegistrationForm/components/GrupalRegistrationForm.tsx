"use client";

import { useState, useMemo } from "react";
import { ConfirmModal } from "@/components/feedback/confirmModal";
import type { RegistroGrupoRetorno, RegistroGrupoRetornoRequest } from "../../types/grupalReturnRegistration";
import Spinner from "@/components/feedback/Spinner";
import { useSendGrupalRegistration } from "../hooks/useSendGrupalRegistration";

type Answer = 0 | 1;

type FormErrors = {
    hospedaje?: string;
    transporte?: string;
    parqueadero?: string;
};

const initialForm: {
    hospedaje: Answer | "";
    transporte: Answer | "";
    parqueadero: Answer | "";
    anotacion: string;
} = {
    hospedaje: "",
    transporte: "",
    parqueadero: "",
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

    const validateForm = (): boolean => {
        const next: FormErrors = {};

        if (formData.hospedaje === "") next.hospedaje = "Selecciona si el grupo necesita hospedaje.";
        if (formData.transporte === "") next.transporte = "Selecciona si el grupo necesita transporte.";
        if (formData.transporte === 1 && formData.parqueadero === "")
            next.parqueadero = "Selecciona si el grupo necesita parqueadero.";

        setFieldErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleRadioChange = (
        field: "hospedaje" | "transporte" | "parqueadero",
        value: Answer,
    ) => {
        setFormData((prev) => {
            const next = { ...prev, [field]: value };
            if (field === "transporte" && value === 0) next.parqueadero = "";
            return next;
        });
        setFieldErrors((prev) => {
            const next = { ...prev, [field]: undefined };
            if (field === "transporte" && value === 0) next.parqueadero = undefined;
            return next;
        });
    };

    const confirmDetails = useMemo(
        () => [
            `Necesita hospedaje: ${formData.hospedaje === 1 ? "Sí" : "No"}`,
            `Necesita transporte: ${formData.transporte === 1 ? "Sí" : "No"}`,
            ...(formData.transporte === 1
                ? [`Necesita parqueadero: ${formData.parqueadero === 1 ? "Sí" : "No"}`]
                : []),
            ...(formData.anotacion ? [`Anotación: ${formData.anotacion}`] : []),
        ],
        [formData],
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
            grupoId,
            num_hospedaje: formData.hospedaje as Answer,
            num_transporte: formData.transporte as Answer,
            num_parqueadero: formData.transporte === 0 ? 0 : (formData.parqueadero as Answer),
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
                        <li key={detail}>{detail}</li>
                    ))}
                </ul>
            </div>
        );
    }

    return (
        <>
            <div className="w-full max-w-2xl rounded-2xl bg-bg p-6 shadow-md sm:p-8">
                <h2 className="section-title">
                    Necesidades del grupo
                    {retornoAnio ? ` — Retorno ${retornoAnio}` : ""}
                </h2>

                {error && (
                    <div className="alert-error mt-4">
                        <p className="alert-error-text">{error}</p>
                    </div>
                )}

                <form className="mt-6 space-y-6" onSubmit={handleSubmit} noValidate>
                    {/* Hospedaje */}
                    <fieldset>
                        <legend className="text-text font-medium mb-3">
                            ¿El grupo necesita hospedaje? <span className="text-error">*</span>
                        </legend>
                        <div className="flex gap-4">
                            {([1, 0] as Answer[]).map((val) => (
                                <label key={val} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="hospedaje"
                                        checked={formData.hospedaje === val}
                                        onChange={() => handleRadioChange("hospedaje", val)}
                                    />
                                    <span className="text-text">{val === 1 ? "Sí" : "No"}</span>
                                </label>
                            ))}
                        </div>
                        {fieldErrors.hospedaje && (
                            <p className="text-error text-sm mt-1">{fieldErrors.hospedaje}</p>
                        )}
                    </fieldset>

                    {/* Transporte */}
                    <fieldset>
                        <legend className="text-text font-medium mb-3">
                            ¿El grupo necesita transporte? <span className="text-error">*</span>
                        </legend>
                        <div className="flex gap-4">
                            {([1, 0] as Answer[]).map((val) => (
                                <label key={val} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="transporte"
                                        checked={formData.transporte === val}
                                        onChange={() => handleRadioChange("transporte", val)}
                                    />
                                    <span className="text-text">{val === 1 ? "Sí" : "No"}</span>
                                </label>
                            ))}
                        </div>
                        {fieldErrors.transporte && (
                            <p className="text-error text-sm mt-1">{fieldErrors.transporte}</p>
                        )}
                    </fieldset>

                    {/* Parqueadero — solo si necesita transporte */}
                    {formData.transporte === 1 && (
                        <fieldset>
                            <legend className="text-text font-medium mb-3">
                                ¿El grupo necesita parqueadero? <span className="text-error">*</span>
                            </legend>
                            <div className="flex gap-4">
                                {([1, 0] as Answer[]).map((val) => (
                                    <label key={val} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="parqueadero"
                                            checked={formData.parqueadero === val}
                                            onChange={() => handleRadioChange("parqueadero", val)}
                                        />
                                        <span className="text-text">{val === 1 ? "Sí" : "No"}</span>
                                    </label>
                                ))}
                            </div>
                            {fieldErrors.parqueadero && (
                                <p className="text-error text-sm mt-1">{fieldErrors.parqueadero}</p>
                            )}
                        </fieldset>
                    )}

                    {/* Anotación */}
                    <div>
                        <label htmlFor="anotacion" className="block text-text font-medium mb-2">
                            Anotación <span className="text-text-muted text-sm">(opcional)</span>
                        </label>
                        <textarea
                            id="anotacion"
                            className="input w-full resize-none"
                            rows={3}
                            maxLength={maxLength}
                            value={formData.anotacion}
                            onChange={(e) => setFormData((prev) => ({ ...prev, anotacion: e.target.value }))}
                            placeholder="Indica cualquier observación relevante para el grupo..."
                        />
                        <p className="text-text-muted text-xs text-right mt-1">
                            {formData.anotacion.length}/{maxLength}
                        </p>
                    </div>

                    <div className="flex justify-end">
                        <button type="submit" className="btn-primary" disabled={isLoading}>
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
        </>
    );
}