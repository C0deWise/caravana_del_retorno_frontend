import { useState } from "react";

type FormFields = {
    hospedaje: number;
    transporte: number;
    parqueadero_carro: number;
    parqueadero_moto: number;
    anotacion: string;
};

type FormErrors = {
    hospedaje?: string;
    transporte?: string;
    parqueadero_carro?: string;
    parqueadero_moto?: string;
    parqueadero?: string;
};

export type ConfirmDetail = {
    key: string;
    label: string;
    value: string;
};

export function useRegistrationForm(initialValues: FormFields, memberCount: number) {
    const [formData, setFormData] = useState<FormFields>(initialValues);
    const [fieldErrors, setFieldErrors] = useState<FormErrors>({});

    const maxParqueadero = memberCount - formData.transporte;

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
        if ((formData.parqueadero_carro + formData.parqueadero_moto) > maxParqueadero)
            next.parqueadero = `La suma del parqueadero no puede superar ${maxParqueadero} (personas sin transporte).`;

        setFieldErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleNumberChange = (
        field: keyof Omit<FormFields, "anotacion">,
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

    const handleAnotacionChange = (value: string) =>
        setFormData((prev) => ({ ...prev, anotacion: value }));

    const confirmDetails: ConfirmDetail[] = [
        { key: "hospedaje",  label: "Hospedaje",          value: `${formData.hospedaje} personas` },
        { key: "transporte", label: "Transporte",          value: `${formData.transporte} personas` },
        ...(formData.transporte < memberCount
            ? [
                { key: "p-carro", label: "Parqueadero carro", value: String(formData.parqueadero_carro) },
                { key: "p-moto",  label: "Parqueadero moto",  value: String(formData.parqueadero_moto) },
              ]
            : []),
        ...(formData.anotacion
            ? [{ key: "anotacion", label: "Anotación", value: formData.anotacion }]
            : []),
    ];

    return {
        formData,
        fieldErrors,
        maxParqueadero,
        validateForm,
        handleNumberChange,
        handleAnotacionChange,
        confirmDetails,
    };
}