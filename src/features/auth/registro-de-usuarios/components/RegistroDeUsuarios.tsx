'use client'

import { useState, FormEvent } from 'react';
import { useRegisterUser, useDocumentValidation } from '../hooks';
import type { RegistrationData } from '../types/registro.types';
import LocationModal, { LocationData } from './LocationModal';

export default function AuthRegistroDeUsuarios() {
    const { registerUser, loading, error, success } = useRegisterUser();
    const { validate: validateDocument, validating, validationError } = useDocumentValidation();

    const [formData, setFormData] = useState<RegistrationData>({
        us_codigo: '',
        us_tipo_doc: 'CC',
        us_documento: '',
        us_celular: '',
        us_nombre: '',
        us_apellido: '',
        us_genero: '',
        us_fecha_nacimiento: '',
        us_pais: '',
        us_departamento: '',
        us_ciudad: '',
        email: '',
        confirmEmail: '',
        password: '',
        confirmPassword: '',
    });

    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Limpiar error del campo cuando el usuario empieza a escribir
        if (fieldErrors[name]) {
            setFieldErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleBlur = (fieldName: string) => {
        setTouched(prev => ({ ...prev, [fieldName]: true }));
        validateField(fieldName);
    };

    const validateField = (fieldName: string) => {
        const value = formData[fieldName as keyof RegistrationData];

        if (!value || (typeof value === 'string' && value.trim() === '')) {
            setFieldErrors(prev => ({ ...prev, [fieldName]: 'Este campo es obligatorio' }));
            return false;
        }

        return true;
    };

    const validateAllFields = () => {
        const errors: Record<string, string> = {};
        const requiredFields = [
            'us_nombre', 'us_apellido', 'us_documento', 'us_fecha_nacimiento',
            'us_celular', 'us_ciudad', 'email', 'confirmEmail', 'password', 'confirmPassword'
        ];

        requiredFields.forEach(field => {
            const value = formData[field as keyof RegistrationData];
            if (!value || (typeof value === 'string' && value.trim() === '')) {
                errors[field] = 'Este campo es obligatorio';
            }
        });

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleDocumentBlur = async () => {
        if (formData.us_documento && formData.us_tipo_doc) {
            await validateDocument(formData.us_tipo_doc, formData.us_documento);
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validar todos los campos
        if (!validateAllFields()) {
            return;
        }

        // Validar emails coincidan
        if (formData.email !== formData.confirmEmail) {
            setFieldErrors(prev => ({
                ...prev,
                confirmEmail: 'Los correos electrónicos no coinciden'
            }));
            return;
        }

        // Validar contraseñas coincidan
        if (formData.password !== formData.confirmPassword) {
            setFieldErrors(prev => ({
                ...prev,
                confirmPassword: 'Las contraseñas no coinciden'
            }));
            return;
        }

        // Validar documento antes de enviar
        const documentoValido = await validateDocument(formData.us_tipo_doc, formData.us_documento);
        if (!documentoValido) {
            return;
        }

        await registerUser(formData);
    };

    const handleLocationSave = (locationData: LocationData) => {
        setFormData(prev => ({
            ...prev,
            us_pais: locationData.pais,
            us_departamento: locationData.departamento,
            us_ciudad: locationData.municipio
        }));
        setIsLocationModalOpen(false);

        // Limpiar errores de ubicación si existen
        if (fieldErrors.us_ciudad) {
            setFieldErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.us_ciudad;
                return newErrors;
            });
        }
    };

    const handleLocationModalOpen = () => {
        setIsLocationModalOpen(true);
    };

    const handleLocationModalClose = () => {
        setIsLocationModalOpen(false);
    };

    const getLocationDisplay = () => {
        if (formData.us_pais === 'Colombia') {
            if (formData.us_departamento && formData.us_ciudad) {
                return `${formData.us_pais}, ${formData.us_departamento}, ${formData.us_ciudad}`;
            } else if (formData.us_departamento) {
                return `${formData.us_pais}, ${formData.us_departamento}`;
            }
        }

        // Si solo hay país o cualquier otro caso
        if (formData.us_pais) {
            return formData.us_pais;
        }
        return 'Seleccionar ubicación';
    };

    return (
        <div className="min-h-screen bg-white p-8">
            <div className="max-w-7xl mx-auto">
                {/* Título */}
                <h1 className="page-title">
                    Registro de usuario
                </h1>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8">
                        {/* Columna Izquierda - Datos Personales */}
                        <div>
                            <h2 className="section-title">
                                Datos personales
                            </h2>

                            <div className="space-y-6">
                                {/* Nombres y Apellidos */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="label-base">
                                            Nombres
                                        </label>
                                        <input
                                            type="text"
                                            name="us_nombre"
                                            value={formData.us_nombre}
                                            onChange={handleChange}
                                            onBlur={() => handleBlur('us_nombre')}
                                            placeholder="Jhon"
                                            className={`input-base ${fieldErrors.us_nombre ? 'input-error' : ''}`}
                                        />
                                        {fieldErrors.us_nombre && (
                                            <p className="validation-message validation-error">{fieldErrors.us_nombre}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="label-base">
                                            Apellidos
                                        </label>
                                        <input
                                            type="text"
                                            name="us_apellido"
                                            value={formData.us_apellido}
                                            onChange={handleChange}
                                            onBlur={() => handleBlur('us_apellido')}
                                            placeholder="Doe"
                                            className={`input-base ${fieldErrors.us_apellido ? 'input-error' : ''}`}
                                        />
                                        {fieldErrors.us_apellido && (
                                            <p className="validation-message validation-error">{fieldErrors.us_apellido}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Identificación y Fecha de Nacimiento */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="label-base">
                                            Identificación
                                        </label>
                                        <div className="flex gap-2">
                                            <select
                                                name="us_tipo_doc"
                                                value={formData.us_tipo_doc}
                                                onChange={handleChange}
                                                className="select-base"
                                            >
                                                <option value="CC">CC</option>
                                                <option value="CE">CE</option>
                                                <option value="PA">PA</option>
                                            </select>
                                            <input
                                                type="text"
                                                name="us_documento"
                                                value={formData.us_documento}
                                                onChange={handleChange}
                                                onBlur={() => {
                                                    handleBlur('us_documento');
                                                    handleDocumentBlur();
                                                }}
                                                placeholder="1234567890"
                                                className={`input-base flex-1 ${fieldErrors.us_documento ? 'input-error' : ''}`}
                                            />
                                        </div>
                                        {validating && (
                                            <p className="validation-message validation-info">Validando...</p>
                                        )}
                                        {validationError && !fieldErrors.us_documento && (
                                            <p className="validation-message validation-error">{validationError}</p>
                                        )}
                                        {fieldErrors.us_documento && (
                                            <p className="validation-message validation-error">{fieldErrors.us_documento}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="label-base">
                                            Fecha de nacimiento
                                        </label>
                                        <input
                                            type="date"
                                            name="us_fecha_nacimiento"
                                            value={formData.us_fecha_nacimiento}
                                            onChange={handleChange}
                                            onBlur={() => handleBlur('us_fecha_nacimiento')}
                                            placeholder="04/08/1999"
                                            className={`input-base ${fieldErrors.us_fecha_nacimiento ? 'input-error' : ''}`}
                                        />
                                        {fieldErrors.us_fecha_nacimiento && (
                                            <p className="validation-message validation-error">{fieldErrors.us_fecha_nacimiento}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Teléfono y Lugar de Residencia */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="label-base">
                                            Teléfono
                                        </label>
                                        <input
                                            type="tel"
                                            name="us_celular"
                                            value={formData.us_celular}
                                            onChange={handleChange}
                                            onBlur={() => handleBlur('us_celular')}
                                            placeholder="1234567890"
                                            className={`input-base ${fieldErrors.us_celular ? 'input-error' : ''}`}
                                        />
                                        {fieldErrors.us_celular && (
                                            <p className="validation-message validation-error">{fieldErrors.us_celular}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="label-base">
                                            Lugar de residencia
                                        </label>
                                        <button
                                            type="button"
                                            onClick={handleLocationModalOpen}
                                            className={`input-base text-left flex items-center justify-between ${fieldErrors.us_ciudad ? 'input-error' : ''}`}
                                        >
                                            <span>{getLocationDisplay()}</span>
                                            <svg 
                                                className="w-5 h-5 text-gray-400" 
                                                fill="none" 
                                                stroke="currentColor" 
                                                viewBox="0 0 24 24"
                                            >
                                                <path 
                                                    strokeLinecap="round" 
                                                    strokeLinejoin="round" 
                                                    strokeWidth={2} 
                                                    d="M19 9l-7 7-7-7" 
                                                />
                                            </svg>
                                        </button>
                                        {fieldErrors.us_ciudad && (
                                            <p className="validation-message validation-error">{fieldErrors.us_ciudad}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Barra de Colores Vertical */}
                        <div className="colombia-bar">
                            <div className="colombia-bar-blue"></div>
                            <div className="colombia-bar-yellow"></div>
                            <div className="colombia-bar-red"></div>
                        </div>

                        {/* Columna Derecha - Datos de Inicio de Sesión */}
                        <div>
                            <h2 className="section-title">
                                Datos de inicio de sesion
                            </h2>

                            <div className="space-y-6">
                                {/* Correo Electrónico */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="label-base">
                                            Correo Electronico
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            onBlur={() => handleBlur('email')}
                                            placeholder="example@gmail.com"
                                            className={`input-base ${fieldErrors.email ? 'input-error' : ''}`}
                                        />
                                        {fieldErrors.email && (
                                            <p className="validation-message validation-error">{fieldErrors.email}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="label-primary">
                                            Ingrese nuevamente el correo electronico
                                        </label>
                                        <input
                                            type="email"
                                            name="confirmEmail"
                                            value={formData.confirmEmail}
                                            onChange={handleChange}
                                            onBlur={() => handleBlur('confirmEmail')}
                                            placeholder="example@gmail.com"
                                            className={`input-base ${fieldErrors.confirmEmail ? 'input-error' : ''}`}
                                        />
                                        {fieldErrors.confirmEmail && (
                                            <p className="validation-message validation-error">{fieldErrors.confirmEmail}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Contraseña */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="label-base">
                                            Contraseña
                                        </label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            onBlur={() => handleBlur('password')}
                                            placeholder="**********"
                                            className={`input-base ${fieldErrors.password ? 'input-error' : ''}`}
                                        />
                                        {fieldErrors.password && (
                                            <p className="validation-message validation-error">{fieldErrors.password}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="label-primary">
                                            Ingrese nuevamente la contraseña
                                        </label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            onBlur={() => handleBlur('confirmPassword')}
                                            placeholder="**********"
                                            className={`input-base ${fieldErrors.confirmPassword ? 'input-error' : ''}`}
                                        />
                                        {fieldErrors.confirmPassword && (
                                            <p className="validation-message validation-error">{fieldErrors.confirmPassword}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mensajes de Error y Éxito */}
                    {error && (
                        <div className="alert-error">
                            <p className="alert-error-text">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="alert-success">
                            <p className="alert-success-text">
                                ¡Registro exitoso! Redirigiendo al login...
                            </p>
                        </div>
                    )}

                    {/* Botón de Envío */}
                    <div className="mt-8 flex justify-center">
                        <button
                            type="submit"
                            disabled={loading || validating}
                            className="btn-primary"
                        >
                            {loading ? 'Registrando...' : 'Registrarse'}
                        </button>
                    </div>
                </form>

                {/* Modal de ubicación */}
                <LocationModal
                    isOpen={isLocationModalOpen}
                    onClose={handleLocationModalClose}
                    onSave={handleLocationSave}
                    initialData={{
                        pais: formData.us_pais,
                        departamento: formData.us_departamento || '',
                        municipio: formData.us_ciudad
                    }}
                />
            </div>
        </div>
    )
}
