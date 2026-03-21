import type { RegistrationData } from '../types/registro.types';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DIGITS_ONLY_REGEX = /^\d+$/;
const PASSPORT_REGEX = /^[A-Za-z0-9]+$/;

const DOCUMENT_RULES: Record<string, { min: number; max: number; allowsLetters: boolean }> = {
  CC: { min: 6, max: 10, allowsLetters: false },
  CE: { min: 6, max: 12, allowsLetters: false },
  PA: { min: 5, max: 20, allowsLetters: true },
};

const REQUIRED_FIELDS: Array<keyof RegistrationData> = [
  'nombre',
  'apellido',
  'documento',
  'fecha_nacimiento',
  'celular',
  'email',
  'confirmEmail',
  'password',
  'confirmPassword',
];

export const getTrimmedValue = (value: string | undefined): string => (value ?? '').trim();

const getTodayLocalDate = (): string => {
  const now = new Date();
  const timezoneOffsetMs = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - timezoneOffsetMs).toISOString().split('T')[0];
};

export const validateDocumentByType = (
  documentType: string,
  documentNumber: string,
): string | null => {
  const rule = DOCUMENT_RULES[documentType];
  const trimmedDocument = getTrimmedValue(documentNumber);

  if (!trimmedDocument) {
    return 'Este campo es obligatorio';
  }

  if (!rule) {
    return 'Tipo de documento no válido';
  }

  if (trimmedDocument.length < rule.min || trimmedDocument.length > rule.max) {
    return `El documento debe tener entre ${rule.min} y ${rule.max} caracteres`;
  }

  if (!rule.allowsLetters && !DIGITS_ONLY_REGEX.test(trimmedDocument)) {
    return 'Este tipo de documento solo permite números';
  }

  if (rule.allowsLetters && !PASSPORT_REGEX.test(trimmedDocument)) {
    return 'El pasaporte solo permite letras y números';
  }

  return null;
};

export const validateRegistrationField = (
  fieldName: keyof RegistrationData,
  data: RegistrationData,
): string | null => {
  const value = getTrimmedValue(data[fieldName] as string | undefined);

  if (REQUIRED_FIELDS.includes(fieldName) && !value) {
    return 'Este campo es obligatorio';
  }

  if (fieldName === 'documento') {
    return validateDocumentByType(data.tipo_doc, data.documento);
  }

  if (fieldName === 'email' && value && !EMAIL_REGEX.test(value)) {
    return 'Ingresa un correo electrónico válido';
  }

  if (fieldName === 'confirmEmail' && value && value !== getTrimmedValue(data.email)) {
    return 'Los correos electrónicos no coinciden';
  }

  if (fieldName === 'password' && value && value.length < 8) {
    return 'La contraseña debe tener al menos 8 caracteres';
  }

  if (fieldName === 'fecha_nacimiento' && value) {
    const today = getTodayLocalDate();
    if (value > today) {
      return 'La fecha de nacimiento no puede ser superior a la fecha de hoy';
    }
  }

  if (
    fieldName === 'confirmPassword' &&
    value &&
    value !== getTrimmedValue(data.password)
  ) {
    return 'Las contraseñas no coinciden';
  }

  if (fieldName === 'celular' && value && !DIGITS_ONLY_REGEX.test(value)) {
    return 'El teléfono solo debe contener números';
  }

  if (fieldName === 'celular' && value && value.length > 10) {
    return 'El teléfono no puede tener más de 10 dígitos';
  }

  return null;
};

export const validateRegistrationData = (
  data: RegistrationData,
): Record<string, string> => {
  const errors: Record<string, string> = {};

  REQUIRED_FIELDS.forEach((field) => {
    const error = validateRegistrationField(field, data);
    if (error) {
      errors[field] = error;
    }
  });

  if (!errors.documento) {
    const documentError = validateDocumentByType(data.tipo_doc, data.documento);
    if (documentError) {
      errors.documento = documentError;
    }
  }

  const country = getTrimmedValue(data.pais);
  const city = getTrimmedValue(data.ciudad);

  if (!country) {
    errors.ciudad = 'Selecciona un país';
  } else if (country === 'Colombia' && !city) {
    errors.ciudad = 'Para Colombia debes seleccionar municipio';
  }

  return errors;
};
