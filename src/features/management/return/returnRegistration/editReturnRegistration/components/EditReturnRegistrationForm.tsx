"use client";

import { useMemo, useState } from "react";
import { ReturnRegistrationAnswer, ReturnRegistrationApi } from "../../types/returnRegistration.types";
import { useReturnRegistrationEdit } from "../hooks/useEditReturnRegistration";
import Spinner from "@/components/feedback/Spinner";
import { ConfirmModal } from "@/components/feedback/confirmModal";

type ParkingOption = "none" | "car" | "bike";

type FormErrors = {
    accomodation?: string;
    transport?: string;
    parking?: string;
};

function parkingOptionLabel(parking: ParkingOption | ""): string {
    if (parking === "car") return "Sí, para carro";
    if (parking === "bike") return "Sí, para moto";
    return "No";
}

function deriveParking(car: number, bike: number): ParkingOption | "" {
    if (car === 1) return "car";
    if (bike === 1) return "bike";
    return "none";
}

type Props = {
    readonly registration: ReturnRegistrationApi;
    readonly activeReturnYear: number | null;
    readonly onSuccess: (updated: ReturnRegistrationApi) => void;
    readonly onCancel: () => void;
};

export function EditReturnRegistrationForm({
    registration,
    activeReturnYear,
    onSuccess,
    onCancel,
}: Props) {

    const { editReturnRegistration, loading, error } = useReturnRegistrationEdit();

    const [formData, setFormData] = useState({
        accomodation: (registration.num_hospedaje === 0 ? 1 : 0),
        transport: (registration.num_transporte === 0 ? 1 : 0),
        parking: deriveParking(registration.num_parqueadero_carro, registration.num_parqueadero_moto),
        note: registration.anotacion ?? "",
    });

    const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const maxLength = 150;

    const confirmDetails = useMemo(
        () => [
            <span key="accomodation"><strong>Tiene hospedaje: </strong>{formData.accomodation === 1 ? "Sí" : "No"}</span>,
            <span key="transport"><strong>Tiene transporte: </strong>{formData.transport === 1 ? "Sí" : "No"}</span>,
            ...(formData.transport === 1
                ? [<span key="parking"><strong>Parqueadero: </strong>{parkingOptionLabel(formData.parking)}</span>,]
                : []),
            ...(formData.note
                ? [<span key="note"><strong>Nota: </strong> <em>{formData.note}</em></span>,]
                : []),
        ], [formData]
    );

    const validateForm = (): boolean => {
        const nextErrors: FormErrors = {};

        if (formData.accomodation === undefined) {
            nextErrors.accomodation = "Selecciona si cuentas con hospedaje";
        }
        if (formData.transport === undefined) {
            nextErrors.transport = "Selecciona si cuentas con transporte";
        }
        if (formData.transport === 1 && formData.parking === "") {
            nextErrors.parking = "Selecciona si necesitas parqueadero y de qué tipo";
        }

        setFieldErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleRadioChange = (
        field: "accomodation" | "transport",
        value: ReturnRegistrationAnswer,
    ) => {
        setFormData((prev) => {
            const next = { ...prev, [field]: value };
            if (field === "transport" && value === 0) next.parking = "";
            return next;
        });
        setFieldErrors((prev) => {
            const next = { ...prev, [field]: undefined };
            if (field === "transport" && value === 0) next.parking = undefined;
            return next;
        });
    };

    const handleParkingChange = (value: ParkingOption | "") => {
        setFormData((prev) => ({ ...prev, parking: value }));
        setFieldErrors((prev) => ({ ...prev, parking: undefined }));
    };

    const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!validateForm()) return
        setShowConfirmModal(true);
    };

    const handleConfirmSubmit = async () => {

        const payload = {
            usuario: registration.usuario,
            retorno: registration.retorno,
            num_hospedaje: formData.accomodation === 1 ? 0 : 1,
            num_transporte: formData.transport === 1 ? 0 : 1,
            num_parqueadero_carro: formData.transport === 1 ? Number(formData.parking === "car") : 0,
            num_parqueadero_moto: formData.transport === 1 ? Number(formData.parking === "bike") : 0,
            note: formData.note || undefined,
        };

        const response = await editReturnRegistration(payload, registration.codigo);
        setShowConfirmModal(false);

        if (response) {
            onSuccess(response);
        }
    };

    return (
        <div className="bg-white px-4 py-6">
            <div className="mx-auto w-full max-w-2xl rounded-2xl bg-bg p-6 shadow-md sm:p-8">
                <h1 className="page-title">
                    {activeReturnYear
                        ? `Editar Registro - El Retorno ${activeReturnYear}`
                        : `Editar Registro - El Retorno #${registration.retorno}`
                    }
                </h1>
                <h2 className="section-title">Actualiza tu disponibilidad de viaje</h2>

                {error && (
                    <div className="alert-error mt-4">
                        <p className="alert-error-text">{error}</p>
                    </div>
                )}

                <form className="mt-6 space-y-6" onSubmit={handleSubmit} noValidate>
                    <fieldset>
                        <div className="flex flex-col gap-3 px-6 py-1 sm:flex-row sm:items-center sm:justify-between">
                            <legend className="label-primary mb-0">¿Tiene hospedaje?</legend>
                            <div
                                className={`inline-flex items-center gap-5 rounded-lg px-3 py-2 ${fieldErrors.accomodation ? "border border-danger" : "border border-transparent"}`}
                            >
                                <label className="inline-flex intems-center gap-2 text-text">
                                    <input
                                        type='radio'
                                        name='accomodation'
                                        value='si'
                                        checked={formData.accomodation === 1}
                                        onChange={() => handleRadioChange("accomodation", 1)}
                                    />Sí
                                </label>
                                <label className="inline-flex intems-center gap-2 text-text">
                                    <input
                                        type='radio'
                                        name='accomodation'
                                        value='no'
                                        checked={formData.accomodation === 0}
                                        onChange={() => handleRadioChange("accomodation", 0)}
                                    />No
                                </label>
                            </div>
                        </div>
                        {fieldErrors.accomodation && (
                            <p className="validation-message validation-error">{fieldErrors.accomodation}</p>
                        )}
                    </fieldset>

                    <fieldset>
                        <div className="flex flex-col gap-3 px-6 py-1 sm:flex-row sm:items-center sm:justify-between">
                            <legend className="label-primary mb-0">¿Tiene transporte?</legend>
                            <div
                                className={`inline-flex items-center gap-5 rounded-lg px-3 py-2 ${fieldErrors.transport ? "border border-danger" : "border border-transparent"}`}
                            >
                                <label className="inline-flex intems-center gap-2 text-text">
                                    <input
                                        type='radio'
                                        name='transport'
                                        value='si'
                                        checked={formData.transport === 1}
                                        onChange={() => handleRadioChange("transport", 1)}
                                    />Sí
                                </label>
                                <label className="inline-flex intems-center gap-2 text-text">
                                    <input
                                        type='radio'
                                        name='transport'
                                        value='no'
                                        checked={formData.transport === 0}
                                        onChange={() => handleRadioChange("transport", 0)}
                                    />No
                                </label>
                            </div>
                        </div>
                        {fieldErrors.transport && (
                            <p className="validation-message validation-error">{fieldErrors.transport}</p>
                        )}
                    </fieldset>

                    {formData.transport === 1 && (
                        <div className="flex flex-col gap-3 mr-6 sm:flex-row sm:items-center sm:justify-between">
                            <label htmlFor="parking" className="label-primary mb-0 ml-6">
                                ¿Necesita parqueadero?
                            </label>
                            <select
                                id="parking"
                                name="parking"
                                className={`select-base w-auto self-start sm:self-auto${fieldErrors.parking ? " border-danger" : ""}`}
                                value={formData.parking}
                                onChange={(e) => handleParkingChange(e.target.value as ParkingOption | "")}
                            >
                                <option value="" disabled>Selecciona</option>
                                <option value="none">No</option>
                                <option value="car">Sí, para carro</option>
                                <option value="bike">Sí, para moto</option>
                            </select>
                            {fieldErrors.parking && (
                                <p className="validation-message validation-error">{fieldErrors.parking}</p>
                            )}
                        </div>
                    )}

                    <div>
                        <label htmlFor="note" className="label-primary mb-0">
                            Notas adicionales
                        </label>
                        <p className="validation-message validation-info mt-1">
                            Opcional. Puedes indicar información adicional relevante para tu asistencia.
                        </p>
                        <textarea
                            id="note"
                            name="note"
                            className="textarea-base mt-2"
                            rows={3}
                            maxLength={maxLength}
                            placeholder={`Escribe aquí cualquier información adicional (máximo ${maxLength} caracteres)...`}
                            value={formData.note}
                            onChange={(e) => setFormData((prev) => ({ ...prev, note: e.target.value }))}
                        />
                        <p className="validation-message validation-info mt-1 text-right">
                            {formData.note.length} / {maxLength} caracteres
                        </p>
                    </div>

                    <div className="flex justify-center gap-4 pt-1">
                        <button
                            type="button"
                            className="btn-secondary min-w-32"
                            onClick={onCancel}
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="btn-primary bg-secondary min-w-48 inline-flex items-center justify-center gap-2 hover:opacity-90"
                            disabled={loading}
                        >
                            {loading && <Spinner size="sm" />}
                            {loading ? "Guardando..." : "Guardar cambios"}
                        </button>
                    </div>
                </form>
            </div>

            <ConfirmModal
                isOpen={showConfirmModal}
                title="¿Confirmas los cambios en tu registro?"
                details={confirmDetails}
                onConfirm={handleConfirmSubmit}
                onCancel={() => setShowConfirmModal(false)}
                loading={loading}
                confirmLabel="Confirmar"
                cancelLabel="Cancelar"
            />
        </div>
    )
}