"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRegisterUser } from "../hooks/useUserRegistration";
import { useDocumentValidation } from "../hooks/useDocumentValidation";
import type { RegistrationData } from "../types/registro.types";
import {
  validateDocumentByType,
  validateRegistrationData,
  validateRegistrationField,
} from "../utils/registrationValidation";
import LocationModal, { LocationData } from "./LocationModal";

export default function AuthUserRegistration() {
  const { registerUser, loading, error, success } = useRegisterUser();
  const {
    validate: validateDocument,
    validating,
    validationError,
  } = useDocumentValidation();

  const [formData, setFormData] = useState<RegistrationData>({
    codigo: "",
    tipo_doc: "CC",
    documento: "",
    celular: "",
    nombre: "",
    apellido: "",
    genero: "",
    fecha_nacimiento: "",
    pais: "",
    departamento: "",
    ciudad: "",
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [hasSubmitAttempted, setHasSubmitAttempted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const todayLocalDate = new Date(
    Date.now() - new Date().getTimezoneOffset() * 60000,
  )
    .toISOString()
    .split("T")[0];

  const sanitizeDocumentInput = (
    documentType: string,
    rawValue: string,
  ): string => {
    const valueWithoutSpaces = rawValue.replace(/\s+/g, "");

    if (documentType === "PA") {
      return valueWithoutSpaces
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .slice(0, 20);
    }

    const maxLength = documentType === "CE" ? 12 : 10;
    return valueWithoutSpaces.replace(/\D/g, "").slice(0, maxLength);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "tipo_doc") {
      setFormData((prev) => ({
        ...prev,
        tipo_doc: value,
        documento: sanitizeDocumentInput(value, prev.documento),
      }));
    } else if (name === "documento") {
      setFormData((prev) => ({
        ...prev,
        documento: sanitizeDocumentInput(prev.tipo_doc, value),
      }));
    } else if (name === "celular") {
      setFormData((prev) => ({
        ...prev,
        celular: value.replace(/\D/g, "").slice(0, 10),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Limpiar error del campo cuando el usuario empieza a escribir
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        if (name === "tipo_doc") {
          delete newErrors.documento;
        }
        return newErrors;
      });
    }
  };

  const handleBlur = (fieldName: string) => {
    const key = fieldName as keyof RegistrationData;
    const fieldError = validateRegistrationField(key, formData);

    setFieldErrors((prev) => {
      const next = { ...prev };
      if (fieldError) {
        next[fieldName] = fieldError;
      } else {
        delete next[fieldName];
      }
      return next;
    });
  };

  const buildRegistrationDataFromForm = (
    submittedFormData: FormData,
  ): RegistrationData => {
    const getValue = (field: keyof RegistrationData) => {
      const value = submittedFormData.get(field);
      return typeof value === "string" ? value : "";
    };

    return {
      codigo: getValue("codigo"),
      tipo_doc: getValue("tipo_doc"),
      documento: getValue("documento"),
      celular: getValue("celular"),
      nombre: getValue("nombre"),
      apellido: getValue("apellido"),
      genero: getValue("genero"),
      fecha_nacimiento: getValue("fecha_nacimiento"),
      pais: getValue("pais"),
      departamento: getValue("departamento"),
      ciudad: getValue("ciudad"),
      email: getValue("email"),
      confirmEmail: getValue("confirmEmail"),
      password: getValue("password"),
      confirmPassword: getValue("confirmPassword"),
    };
  };

  const handleFormAction = async (submittedFormData: FormData) => {
    setHasSubmitAttempted(true);
    const submissionData = buildRegistrationDataFromForm(submittedFormData);

    const formErrors = validateRegistrationData(submissionData);
    setFieldErrors(formErrors);

    if (Object.keys(formErrors).length > 0) {
      return;
    }

    // Validar documento antes de enviar
    const documentoValido = await validateDocument(
      submissionData.tipo_doc,
      submissionData.documento,
    );
    if (!documentoValido) {
      return;
    }

    await registerUser(submissionData);
  };

  const handleLocationSave = (locationData: LocationData) => {
    setFormData((prev) => ({
      ...prev,
      pais: locationData.pais,
      departamento: locationData.departamento,
      ciudad: locationData.municipio,
    }));
    setIsLocationModalOpen(false);

    // Limpiar errores de ubicación si existen
    if (fieldErrors.ciudad) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.ciudad;
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
    if (formData.pais === "Colombia") {
      if (formData.departamento && formData.ciudad) {
        return `${formData.pais}, ${formData.departamento}, ${formData.ciudad}`;
      } else if (formData.departamento) {
        return `${formData.pais}, ${formData.departamento}`;
      }
    }

    // Si solo hay país o cualquier otro caso
    if (formData.pais) {
      return formData.pais;
    }
    return "Seleccionar ubicación";
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Título */}
        <h1 className="page-title">Registro de usuario</h1>

        <form action={handleFormAction}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8">
            {/* Columna Izquierda - Datos Personales */}
            <div>
              <h2 className="section-title">Datos personales</h2>

              <div className="space-y-6">
                {/* Nombres y Apellidos */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-base">Nombres</label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      onBlur={() => handleBlur("nombre")}
                      placeholder="Jhon"
                      className={`input-base ${fieldErrors.nombre ? "input-error" : ""}`}
                    />
                    {fieldErrors.nombre && (
                      <p className="validation-message validation-error">
                        {fieldErrors.nombre}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="label-base">Apellidos</label>
                    <input
                      type="text"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleChange}
                      onBlur={() => handleBlur("apellido")}
                      placeholder="Doe"
                      className={`input-base ${fieldErrors.apellido ? "input-error" : ""}`}
                    />
                    {fieldErrors.apellido && (
                      <p className="validation-message validation-error">
                        {fieldErrors.apellido}
                      </p>
                    )}
                  </div>
                </div>

                {/* Identificación */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-base">Identificación</label>
                    <div className="flex gap-2">
                      <select
                        name="tipo_doc"
                        value={formData.tipo_doc}
                        onChange={handleChange}
                        className="select-base"
                      >
                        <option value="CC">CC</option>
                        <option value="CE">CE</option>
                        <option value="PA">PA</option>
                      </select>
                      <input
                        type="text"
                        name="documento"
                        value={formData.documento}
                        inputMode={formData.tipo_doc === "PA" ? "text" : "numeric"}
                        maxLength={formData.tipo_doc === "PA" ? 20 : formData.tipo_doc === "CE" ? 12 : 10}
                        pattern={formData.tipo_doc === "PA" ? "[A-Za-z0-9]*" : "[0-9]*"}
                        onChange={handleChange}
                        onBlur={() => handleBlur("documento")}
                        placeholder="1234567890"
                        className={`input-base flex-1 ${fieldErrors.documento ? "input-error" : ""}`}
                      />
                    </div>
                    {validating && (
                      <p className="validation-message validation-info">
                        Validando...
                      </p>
                    )}
                    {hasSubmitAttempted && validationError && !fieldErrors.documento && (
                      <p className="validation-message validation-error">
                        {validationError}
                      </p>
                    )}
                    {fieldErrors.documento && (
                      <p className="validation-message validation-error">
                        {fieldErrors.documento}
                      </p>
                    )}
                  </div>

                  {/* Fecha de Nacimiento */}
                  <div>
                    <label className="label-base">Fecha de nacimiento</label>
                    <input
                      type="date"
                      name="fecha_nacimiento"
                      value={formData.fecha_nacimiento}
                      max={todayLocalDate}
                      onChange={handleChange}
                      onBlur={() => handleBlur("fecha_nacimiento")}
                      placeholder="04/08/1999"
                      className={`input-base ${fieldErrors.fecha_nacimiento ? "input-error" : ""}`}
                    />
                    {fieldErrors.fecha_nacimiento && (
                      <p className="validation-message validation-error">
                        {fieldErrors.fecha_nacimiento}
                      </p>
                    )}
                  </div>
                </div>

                {/* Teléfono */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-base">Teléfono</label>
                    <input
                      type="tel"
                      name="celular"
                      value={formData.celular}
                      inputMode="numeric"
                      maxLength={10}
                      pattern="[0-9]*"
                      onChange={handleChange}
                      onBlur={() => handleBlur("celular")}
                      placeholder="1234567890"
                      className={`input-base ${fieldErrors.celular ? "input-error" : ""}`}
                    />
                    {fieldErrors.celular && (
                      <p className="validation-message validation-error">
                        {fieldErrors.celular}
                      </p>
                    )}
                  </div>
                  
                  {/* Ubicación */}
                  <div>
                    <label className="label-base">Lugar de residencia</label>
                    <button
                      type="button"
                      onClick={handleLocationModalOpen}
                      className={`input-base text-left flex items-center justify-between ${fieldErrors.ciudad ? "input-error" : ""}`}
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
                    {fieldErrors.ciudad && (
                      <p className="validation-message validation-error">
                        {fieldErrors.ciudad}
                      </p>
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
              <h2 className="section-title">Datos de inicio de sesion</h2>

              <div className="space-y-6">
                {/* Correo Electrónico */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-base">Correo Electronico</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={() => handleBlur("email")}
                      placeholder="example@gmail.com"
                      className={`input-base ${fieldErrors.email ? "input-error" : ""}`}
                    />
                    {fieldErrors.email && (
                      <p className="validation-message validation-error">
                        {fieldErrors.email}
                      </p>
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
                      onBlur={() => handleBlur("confirmEmail")}
                      placeholder="example@gmail.com"
                      className={`input-base ${fieldErrors.confirmEmail ? "input-error" : ""}`}
                    />
                    {fieldErrors.confirmEmail && (
                      <p className="validation-message validation-error">
                        {fieldErrors.confirmEmail}
                      </p>
                    )}
                  </div>
                </div>

                {/* Contraseña */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-base">Contraseña</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        onBlur={() => handleBlur("password")}
                        placeholder="**********"
                        className={`input-base pr-20 ${fieldErrors.password ? "input-error" : ""}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                        className="absolute inset-y-0 right-3 text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {fieldErrors.password && (
                      <p className="validation-message validation-error">
                        {fieldErrors.password}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="label-primary">
                      Ingrese nuevamente la contraseña
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        onBlur={() => handleBlur("confirmPassword")}
                        placeholder="**********"
                        className={`input-base pr-20 ${fieldErrors.confirmPassword ? "input-error" : ""}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                        className="absolute inset-y-0 right-3 text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {fieldErrors.confirmPassword && (
                      <p className="validation-message validation-error">
                        {fieldErrors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <input type="hidden" name="pais" value={formData.pais} />
          <input
            type="hidden"
            name="departamento"
            value={formData.departamento}
          />
          <input type="hidden" name="ciudad" value={formData.ciudad} />

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
              {loading ? "Registrando..." : "Registrarse"}
            </button>
          </div>
        </form>

        {/* Modal de ubicación */}
        {isLocationModalOpen && (
          <LocationModal
            onClose={handleLocationModalClose}
            onSave={handleLocationSave}
            initialData={{
              pais: formData.pais,
              departamento: formData.departamento || "",
              municipio: formData.ciudad,
            }}
          />
        )}
      </div>
    </div>
  );
}
