"use client"

import { useState } from "react";
import { Genero, PersonaCreateRequest, TipoDoc } from "../types/persona.types"
import { useExternedPerson } from "../hooks/useExternalPerson.hook";
import { AnimatedModal } from "@/components/feedback/AnimatedModal";
import { SearchInput } from "@/components/forms/SearchInput";
import Spinner from "@/components/feedback/Spinner";
import {
    ExternalPersonErrors,
    hasExternalPersonErrors,
    validateDocumento,
    validateExternalPersonForm,
} from "../utils/externalPersonValidation";

const TIPO_DOC_OPTIONS: TipoDoc[] = ["CC", "CE", "TI"];
const GENERO_OPTIONS: { value: Genero; label: string }[] = [
    { value: "M", label: "Masculino" },
    { value: "F", label: "Femenino" },
];

const initialForm: PersonaCreateRequest = {
    pe_tipo_doc: "CC",
    pe_documento: "",
    pe_nombre: "",
    pe_apellido: "",
    pe_correo: "",
    pe_fecha_nacimiento: "",
    pe_genero: "M",
};

interface ExternalPersonModalProps {
    readonly isOpen: boolean;
    readonly onClose: () => void;
    readonly grupoId: number;
    readonly onPersonaAdded: () => void;
}

export function ExternalPersonModal({
    isOpen,
    onClose,
    grupoId,
    onPersonaAdded,
}: ExternalPersonModalProps) {
    const [documento, setDocumento] = useState("");
    const [documentoError, setDocumentoError] = useState<string | undefined>();
    const [form, setForm] = useState<PersonaCreateRequest>(initialForm);
    const [formErrors, setFormErrors] = useState<ExternalPersonErrors>({});
    const {
        step,
        foundPersona,
        isLoading,
        error,
        searchByDocumento,
        addFoundPersona,
        createAndAdd,
        reset,
    } = useExternedPerson();

    const handleClose = () => {
        setDocumento("");
        setDocumentoError(undefined);
        setForm(initialForm);
        setFormErrors({});
        reset();
        onClose();
    };

    const handleSearch = () => {
        const error = validateDocumento(documento.trim());
        setDocumentoError(error);
        if (!error) {
            handleFieldChange("pe_documento", documento.trim());
            void searchByDocumento(documento.trim());
        }
    };

    const handleAddFound = async () => {
        await addFoundPersona(grupoId);
        onPersonaAdded();
    };

    const handleCreateAndAdd = async () => {
        const errors = validateExternalPersonForm(form);
        setFormErrors(errors);
        if (hasExternalPersonErrors(errors)) return;
        await createAndAdd(form, grupoId);
        onPersonaAdded();
    };

    const handleFieldChange = (field: keyof PersonaCreateRequest, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        // Clear the error for the edited field
        if (field in formErrors) {
            setFormErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    return (
        <AnimatedModal
            isOpen={isOpen}
            onBackdropClick={handleClose}
            maxWidth="max-w-lg"
        >
            <div className="rounded-2xl bg-bg-card p-6 shadow-xl w-full max-h-[90vh] overflow-y-auto">
                <h2 className="section-title mb-4">Añadir persona externa</h2>

                {(step === "search" || step === "found" || step === "not_found") && (
                    <div className="mb-4">
                        <SearchInput
                            label="Número de documento"
                            placeholder="Ingresa el documento"
                            onSearch={handleSearch}
                            loading={isLoading && step === "search"}
                            minLength={5}
                            onChange={(val) => {
                                const digits = val.replace(/\D/g, "").slice(0, 15);
                                setDocumento(digits);
                                handleFieldChange("pe_documento", digits);
                                setDocumentoError(undefined);
                            }}
                        />
                        {documentoError && (
                            <p className="validation-error text-xs mt-1">{documentoError}</p>
                        )}
                    </div>
                )}

                {step === "found" && foundPersona && (
                    <div className="rounded-cl border border-bg-border bg-bg p-4 mb-4">
                        <p className="text-text font-medium">{foundPersona.pe_nombre} {foundPersona.pe_apellido}</p>
                        <p className="text-text-muted text-sm">{foundPersona.pe_tipo_doc} {foundPersona.pe_documento}</p>
                        {foundPersona.pe_correo && (
                            <p className="text-text-muted text-sm">Correo {foundPersona.pe_correo}</p>
                        )}
                    </div>
                )}

                {step === "not_found" && (
                    <div className="space-y-3 mb-4">
                        <p className="text-text-muted text-sm">
                            No se encontró la persona. Completa los datos para registrarla.
                        </p>

                        <div className="flex gap-2">
                            {TIPO_DOC_OPTIONS.map((tipo) => (
                                <button
                                    key={tipo}
                                    type="button"
                                    onClick={() => handleFieldChange("pe_tipo_doc", tipo)}
                                    className={`flex-1 rounded-lg border py-2 text-sm font-medium transition-colors ${form.pe_tipo_doc === tipo
                                        ? "border-primary bg-primary text-white"
                                        : "border-bg-border text-text-muted hover:text-text"
                                        }`}
                                >
                                    {tipo}
                                </button>
                            ))}
                        </div>

                        <div>
                            <label htmlFor="nombre" className="block text-sm text-text-muted mb-1 capitalize">
                                nombre <span className="validation-error ml-1">*</span>
                            </label>
                            <input
                                id="nombre"
                                type="text"
                                value={form.pe_nombre ?? ""}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]/g, "");
                                    handleFieldChange("pe_nombre", val);
                                }}
                                className="input-base w-full"
                            />
                            {formErrors.pe_nombre && (
                                <p className="validation-error text-xs mt-1">{formErrors.pe_nombre}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="apellido" className="block text-sm text-text-muted mb-1 capitalize">
                                apellido <span className="validation-error ml-1">*</span>
                            </label>
                            <input
                                id="apellido"
                                type="text"
                                value={form.pe_apellido ?? ""}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]/g, "");
                                    handleFieldChange("pe_apellido", val);
                                }}
                                className="input-base w-full"
                            />
                            {formErrors.pe_apellido && (
                                <p className="validation-error text-xs mt-1">{formErrors.pe_apellido}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="correo" className="block text-sm text-text-muted mb-1 capitalize">
                                correo <span className="validation-error ml-1">*</span>
                            </label>
                            <input
                                id="corro"
                                type="email"
                                value={form.pe_correo ?? ""}
                                onChange={(e) => handleFieldChange("pe_correo", e.target.value)}
                                className="input-base w-full"
                            />
                            {formErrors.pe_correo && (
                                <p className="validation-error text-xs mt-1">{formErrors.pe_correo}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="fecha-nacimiento" className="block text-sm text-text-muted mb-1 capitalize">
                                Fecha de nacimiento <span className="validation-error ml-1">*</span>
                            </label>
                            <input
                                id="fecha-nacimiento"
                                type="date"
                                value={form.pe_fecha_nacimiento ?? ""}
                                onChange={(e) => handleFieldChange("pe_fecha_nacimiento", e.target.value)}
                                className="input-base w-full"
                            />
                            {formErrors.pe_fecha_nacimiento && (
                                <p className="validation-error text-xs mt-1">{formErrors.pe_fecha_nacimiento}</p>
                            )}
                        </div>

                        <div>
                            <p className="block text-sm text-text-muted mb-1">
                                Género <span className="validation-error ml-1">*</span>
                            </p>
                            <div className="flex gap-2">
                                {GENERO_OPTIONS.map(({ value, label }) => (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() => handleFieldChange("pe_genero", value)}
                                        className={`flex-1 rounded-lg border py-2 text-sm font-medium transition-colors ${form.pe_genero === value
                                            ? "border-primary bg-primary text-white"
                                            : "border-bg-border text-text-muted hover:text-text"
                                            }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {step === "success" && (
                    <div className="alert-success mb-4">
                        <p className="alert-success-text">Persona añadida al grupo correctamente</p>
                    </div>
                )}

                {error && (
                    <div className="alert-error mb-4">
                        <p className="alert-error-text">{error}</p>
                    </div>
                )}

                <div className="flex justify-center gap-3 mt-2">
                    <button type="button" className="btn-secondary" onClick={handleClose}>
                        {step === "success" ? "Cerrar" : "Cancelar"}
                    </button>

                    {step === "found" && (
                        <button
                            type="button"
                            className="btn-primary"
                            onClick={handleAddFound}
                            disabled={isLoading}
                        >
                            {isLoading ? <Spinner size="sm" /> : "Añadir al grupo"}
                        </button>
                    )}

                    {step === "not_found" && (
                        <button
                            type="button"
                            className="btn-primary"
                            onClick={handleCreateAndAdd}
                            disabled={isLoading}
                        >
                            {isLoading ? <Spinner size="sm" /> : "Registrar y añadir"}
                        </button>
                    )}

                </div>
            </div>
        </AnimatedModal>
    )

}
