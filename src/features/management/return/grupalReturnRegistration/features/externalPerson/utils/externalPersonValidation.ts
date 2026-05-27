import type { PersonaCreateRequest } from "../types/persona.types";

const DIGITS_ONLY_REGEX = /^\d+$/;

const ALLOWED_NAME_CHARS = new Set(
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz" +
    "ÁÉÍÓÚáéíóúÑñÜü '-"
);

const isValidNameChar = (ch: string): boolean =>
    ALLOWED_NAME_CHARS.has(ch);

// Corregida: sin backtracking — partes del email bien delimitadas
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

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
    const trimmed = value.trim();
    if (!trimmed) return "Este campo es obligatorio";
    if (!DIGITS_ONLY_REGEX.test(trimmed)) return "Solo se permiten números";
    if (trimmed.length < 5) return "Debe tener al menos 5 dígitos";
    if (trimmed.length > 15) return "No puede tener más de 15 dígitos";
    return undefined;
};

export const validateNombre = (value: string, label = "nombre"): string | undefined => {
    const trimmed = value.trim();
    if (!trimmed) return "Este campo es obligatorio";
    if (trimmed.length < 2) return "Debe tener al menos 2 caracteres";
    if (![...trimmed].every(isValidNameChar))
        return `El ${label} solo puede contener letras`;
    return undefined;
};

export const validateCorreo = (value: string): string | undefined => {
    const trimmed = value.trim(); // ← evita llamar .trim() dos veces
    if (!trimmed) return "Este campo es obligatorio";
    if (!EMAIL_REGEX.test(trimmed))
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