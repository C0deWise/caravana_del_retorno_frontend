import type { RegistrationFormData } from "../types/registro.types";

// ✅ Sin backtracking — caracteres explícitos y disjuntos por segmento
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const DIGITS_ONLY_REGEX = /^\d+$/;
const PASSPORT_REGEX = /^[A-Za-z0-9]+$/;
const ALLOWED_NAME_CHARS = new Set(
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz" +
  "ÁÉÍÓÚáéíóúÑñÜü '-"
);

const DOCUMENT_RULES: Record <
  string,
  { min: number; max: number; allowsLetters: boolean }
> = {
  CC: { min: 6, max: 10, allowsLetters: false },
  CE: { min: 6, max: 12, allowsLetters: false },
  PA: { min: 5, max: 20, allowsLetters: true },
};

const REQUIRED_FIELDS: Array<keyof RegistrationFormData> = [
  "nombre", "apellido", "documento", "fecha_nacimiento",
  "celular", "correo", "confirmEmail", "contrasenia", "confirmPassword",
];

// ── Helpers ───────────────────────────────────────────────────────────────────

export const getTrimmedValue = (value: string | null | undefined): string =>
  (value ?? "").trim();

const isValidNameChar = (ch: string): boolean => ALLOWED_NAME_CHARS.has(ch);

const getTodayLocalDate = (): string => {
  const now = new Date();
  const timezoneOffsetMs = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - timezoneOffsetMs).toISOString().split("T")[0];
};

// ── Validadores atómicos ──────────────────────────────────────────────────────

export const validateDocumentByType = (
  documentType: string,
  documentNumber: string,
): string | null => {
  const rule = DOCUMENT_RULES[documentType];
  const trimmed = getTrimmedValue(documentNumber);

  if (!trimmed) return "Este campo es obligatorio";
  if (!rule) return "Tipo de documento no válido";
  if (trimmed.length < rule.min || trimmed.length > rule.max)
    return `El documento debe tener entre ${rule.min} y ${rule.max} caracteres`;
  if (!rule.allowsLetters && !DIGITS_ONLY_REGEX.test(trimmed))
    return "Este tipo de documento solo permite números";
  if (rule.allowsLetters && !PASSPORT_REGEX.test(trimmed))
    return "El pasaporte solo permite letras y números";

  return null;
};

const validateNombreField = (value: string): string | null => {
  if (value.length < 3) return "Debe tener al menos 3 caracteres";
  if (![...value].every(isValidNameChar)) return "Solo se permiten letras";
  return null;
};

// ✅ Parámetro "data" eliminado — no se usaba (evita S1172)
const validateCorreoField = (value: string): string | null => {
  if (!EMAIL_REGEX.test(value)) return "Ingresa un correo electrónico válido";
  return null;
};

const validateConfirmEmail = (value: string, data: RegistrationFormData): string | null => {
  if (value !== getTrimmedValue(data.correo)) return "Los correos electrónicos no coinciden";
  return null;
};

const validateContrasenia = (value: string): string | null => {
  if (value.length < 8) return "La contraseña debe tener al menos 8 caracteres";
  return null;
};

const validateConfirmPassword = (data: RegistrationFormData): string | null => {
  if (data.confirmPassword !== data.contrasenia) return "Las contraseñas no coinciden";
  return null;
};

const validateFechaNacimiento = (value: string): string | null => {
  const today = getTodayLocalDate();
  if (value > today) return "La fecha de nacimiento no puede ser superior a la fecha de hoy";

  const birthDate = new Date(value);
  const minDate = new Date(today);
  minDate.setFullYear(minDate.getFullYear() - 18);
  if (birthDate > minDate) return "Debes tener al menos 18 años para registrarte";

  return null;
};

const validateCelular = (value: string): string | null => {
  if (!DIGITS_ONLY_REGEX.test(value)) return "El teléfono solo debe contener números";
  if (value.length > 10) return "El teléfono no puede tener más de 10 dígitos";
  return null;
};

// ── Mapa de validadores por campo ─────────────────────────────────────────────

type FieldValidator = (value: string, data: RegistrationFormData) => string | null;

const FIELD_VALIDATORS: Partial<Record<keyof RegistrationFormData, FieldValidator>> = {
  nombre:           (v) => validateNombreField(v),
  apellido:         (v) => validateNombreField(v),
  correo:           (v) => validateCorreoField(v), 
  confirmEmail:     (v, d) => validateConfirmEmail(v, d),
  contrasenia:      (v) => validateContrasenia(v),
  confirmPassword:  (_, d) => validateConfirmPassword(d),
  fecha_nacimiento: (v) => validateFechaNacimiento(v),
  celular:          (v) => validateCelular(v),
  documento:        (_, d) => validateDocumentByType(d.tipo_doc, d.documento),
};

// ── Validador principal ───────────────────────────────────────────────────────

export const validateRegistrationField = (
  fieldName: keyof RegistrationFormData,
  data: RegistrationFormData,
): string | null => {
  const value = getTrimmedValue(data[fieldName]);

  if (REQUIRED_FIELDS.includes(fieldName) && !value) {
    return "Este campo es obligatorio";
  }

  const validator = FIELD_VALIDATORS[fieldName];
  return validator ? validator(value, data) : null;
};

// ── Normalización y validación completa ──────────────────────────────────────

export const normalizeFormData = (
  data: RegistrationFormData,
): RegistrationFormData => ({
  ...data,
  nombre:       getTrimmedValue(data.nombre),
  apellido:     getTrimmedValue(data.apellido),
  celular:      getTrimmedValue(data.celular),
  documento:    getTrimmedValue(data.documento),
  correo:       getTrimmedValue(data.correo),
  confirmEmail: getTrimmedValue(data.confirmEmail),
});

export const validateRegistrationData = (
  data: RegistrationFormData,
): Record<string, string> => {
  const errors: Record<string, string> = {};

  REQUIRED_FIELDS.forEach((field) => {
    const error = validateRegistrationField(field, data);
    if (error) errors[field] = error;
  });

  if (!errors.documento) {
    const documentError = validateDocumentByType(data.tipo_doc, data.documento);
    if (documentError) errors.documento = documentError;
  }

  const country = getTrimmedValue(data.pais);
  const city = getTrimmedValue(data.ciudad);

  if (!country) {
    errors.ciudad = "Selecciona un país";
  } else if (country === "Colombia" && !city) {
    errors.ciudad = "Para Colombia debes seleccionar municipio";
  }

  return errors;
};