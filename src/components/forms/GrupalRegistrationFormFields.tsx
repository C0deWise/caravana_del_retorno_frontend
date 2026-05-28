import { StepperField } from "@/components/forms/StepperField";
import { AnotacionField } from "@/components/forms/AnotationField";

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

interface RegistrationFormFieldsProps {
    readonly formData: FormFields;
    readonly fieldErrors: FormErrors;
    readonly memberCount: number;
    readonly maxParqueadero: number;
    readonly maxLength: number;
    readonly onNumberChange: (
        field: "hospedaje" | "transporte" | "parqueadero_carro" | "parqueadero_moto",
        value: string,
    ) => void;
    readonly onAnotacionChange: (value: string) => void;
}

export function RegistrationFormFields({
    formData,
    fieldErrors,
    memberCount,
    maxParqueadero,
    maxLength,
    onNumberChange,
    onAnotacionChange,
}: RegistrationFormFieldsProps) {
    return (
        <>
            <StepperField
                legend="¿El grupo necesita hospedaje?"
                value={formData.hospedaje}
                max={memberCount}
                onDecrement={() => onNumberChange("hospedaje", String(formData.hospedaje - 1))}
                onIncrement={() => onNumberChange("hospedaje", String(formData.hospedaje + 1))}
                error={fieldErrors.hospedaje}
            />
            <StepperField
                legend="¿El grupo necesita transporte?"
                value={formData.transporte}
                max={memberCount}
                onDecrement={() => onNumberChange("transporte", String(formData.transporte - 1))}
                onIncrement={() => onNumberChange("transporte", String(formData.transporte + 1))}
                error={fieldErrors.transporte}
            />

            {formData.transporte < memberCount && (
                <>
                    <StepperField
                        legend="¿El grupo necesita parqueadero para carro?"
                        value={formData.parqueadero_carro}
                        max={maxParqueadero}
                        onDecrement={() => onNumberChange("parqueadero_carro", String(formData.parqueadero_carro - 1))}
                        onIncrement={() => onNumberChange("parqueadero_carro", String(formData.parqueadero_carro + 1))}
                        error={fieldErrors.parqueadero_carro}
                    />
                    <StepperField
                        legend="¿El grupo necesita parqueadero para moto?"
                        value={formData.parqueadero_moto}
                        max={maxParqueadero}
                        onDecrement={() => onNumberChange("parqueadero_moto", String(formData.parqueadero_moto - 1))}
                        onIncrement={() => onNumberChange("parqueadero_moto", String(formData.parqueadero_moto + 1))}
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
                onChange={onAnotacionChange}
            />
        </>
    );
}