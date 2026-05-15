import type { PersonaCreateRequest } from "../types/persona.types";

const DIGITS_ONLY_REGEX = /^\d+$/;
const NAME_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface ExternalPersonErrors {
    pe_documento?: string;
    pe_nombre?: string;
    pe_apellido?: string;
    pe_correo?: string;
    pe_fecha_nacimiento?: string;
}

export const hasExternalPersonErrors = (errors: ExternalPersonErrors): boolean =>
    Object.values(errors).some(Boolean);

// ── Field validators ──────────────────────────────────────────────────────────

export const validateDocumento = (value: string): string | undefined => {
    if (!value.trim()) return "Este campo es obligatorio";
    if (!DIGITS_ONLY_REGEX.test(value)) return "Solo se permiten números";
    if (value.length < 5) return "Debe tener al menos 5 dígitos";
    if (value.length > 15) return "No puede tener más de 15 dígitos";
    return undefined;
};

export const validateNombre = (value: string, label = "nombre"): string | undefined => {
    if (!value.trim()) return "Este campo es obligatorio";
    if (value.trim().length < 2) return "Debe tener al menos 2 caracteres";
    if (!NAME_REGEX.test(value.trim()))
        return `El ${label} solo puede contener letras`;
    return undefined;
};

export const validateCorreo = (value: string): string | undefined => {
    if (!value.trim()) return "Este campo es obligatorio";
    if (!EMAIL_REGEX.test(value.trim()))
        return "Ingresa un correo electrónico válido";
    return undefined;
};

export const validateFechaNacimiento = (value: string): string | undefined => {
    if (!value) return "Este campo es obligatorio";
    const today = new Date().toISOString().split("T")[0];
    if (value > today) return "La fecha no puede ser superior a hoy";
    return undefined;
};

// ── Full-form validator ───────────────────────────────────────────────────────

export const validateExternalPersonForm = (
    form: PersonaCreateRequest,
): ExternalPersonErrors => {
    return {
        pe_documento: validateDocumento(form.pe_documento),
        pe_nombre: validateNombre(form.pe_nombre, "nombre"),
        pe_apellido: validateNombre(form.pe_apellido, "apellido"),
        pe_correo: validateCorreo(form.pe_correo ?? ""),
        pe_fecha_nacimiento: validateFechaNacimiento(form.pe_fecha_nacimiento),
    };
};
