"use client"

import { useState } from "react";
import { Genero, PersonaCreateRequest, TipoDoc } from "../types/persona.types"
import { useExternedPerson } from "../hooks/useExternalPerson.hook";
import { AnimatedModal } from "@/components/feedback/AnimatedModal";
import { SearchInput } from "@/components/forms/SearchInput";
import Spinner from "@/components/feedback/Spinner";

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
    const [form, setForm] = useState<PersonaCreateRequest>(initialForm);
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
        setForm(initialForm);
        reset();
        onClose();
    };

    const handleSearch = (query: string) => {
        if (query.trim().length >= 5) void searchByDocumento(query.trim());
    };

    const handleAddFound = async () => {
        await addFoundPersona(grupoId);
        onPersonaAdded();
    };

    const handleCreateAndAdd = async () => {
        await createAndAdd({ ...form, pe_documento: documento }, grupoId);
        onPersonaAdded();
    };

    const handleFieldChange = (field: keyof PersonaCreateRequest, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
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
                            onChange={setDocumento}
                        />
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

                        {(["pe_nombre", "pe_apellido", "pe_correo", "pe_fecha_nacimiento"] as const).map((field) => (
                            <div key={field}>
                                <label className="block text-sm text-text-muted mb-1 capitalize">
                                    {field === "pe_fecha_nacimiento" ? "Fecha de nacimiento" : field.replace("pe_", "")}
                                    {field !== "pe_correo" && <span className="text-error ml-1">*</span>}
                                </label>
                                <input
                                    type={field === "pe_fecha_nacimiento" ? "date" : field === "pe_correo" ? "email" : "text"}
                                    value={form[field] ?? ""}
                                    onChange={(e) => handleFieldChange(field, e.target.value)}
                                    className="input-base w-full"
                                />
                            </div>
                        ))}

                        <div>
                            <p className="block text-sm text-text-muted mb-1">
                                Género <span className="text-error ml-1">*</span>
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

                <div className="flex justify-end gap-3 mt-2">
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
