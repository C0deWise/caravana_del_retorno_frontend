"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRegisterUser } from "../hooks/useUserRegistration";
import type { RegistrationFormData } from "../types/registro.types";
import {
  validateRegistrationData,
  validateRegistrationField,
} from "../utils/registrationValidation";
import LocationModal, { LocationData } from "./LocationModal";
import { UserGender } from "@/types/user.types";

const TODAY_LOCAL_DATE = (() => {
  const now = new Date();
  const timezoneOffsetMs = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - timezoneOffsetMs).toISOString().split("T")[0];
})();

export default function AuthUserRegistration() {
  const { registerUser, loading, error, success } = useRegisterUser();

  const [formData, setFormData] = useState<RegistrationFormData>({
    tipo_doc: "CC",
    documento: "",
    celular: "",
    nombre: "",
    apellido: "",
    genero: "F" as UserGender,
    fecha_nacimiento: "",
    pais: "",
    departamento: null,
    ciudad: null,
    correo: "",
    contrasenia: "",
    confirmEmail: "",
    confirmPassword: "",
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        if (name === "tipo_doc") delete newErrors.documento;
        return newErrors;
      });
    }
  };

  const handleBlur = (fieldName: keyof RegistrationFormData) => {
    const fieldError = validateRegistrationField(fieldName, formData);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formErrors = validateRegistrationData(formData);
    setFieldErrors(formErrors);

    if (Object.keys(formErrors).length > 0) return;

    const { ...registrationData } = formData;
    await registerUser(registrationData);
  };

  const handleLocationSave = (locationData: LocationData) => {
    setFormData((prev) => ({
      ...prev,
      pais: locationData.pais,
      departamento: locationData.departamento || null,
      ciudad: locationData.municipio || null,
    }));
    setIsLocationModalOpen(false);

    if (fieldErrors.ciudad) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.ciudad;
        return newErrors;
      });
    }
  };

  const getLocationDisplay = () => {
    if (formData.pais === "Colombia") {
      if (formData.departamento && formData.ciudad) {
        return `${formData.pais}, ${formData.departamento}, ${formData.ciudad}`;
      } else if (formData.departamento) {
        return `${formData.pais}, ${formData.departamento}`;
      }
    }
    return formData.pais || "Seleccionar ubicación";
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="page-title">Registro de usuario</h1>

        <form onSubmit={handleSubmit}>
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
                        inputMode={
                          formData.tipo_doc === "PA" ? "text" : "numeric"
                        }
                        maxLength={
                          formData.tipo_doc === "PA"
                            ? 20
                            : formData.tipo_doc === "CE"
                              ? 12
                              : 10
                        }
                        onChange={handleChange}
                        onBlur={() => handleBlur("documento")}
                        placeholder="1234567890"
                        className={`input-base flex-1 ${fieldErrors.documento ? "input-error" : ""}`}
                      />
                    </div>
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
                      max={TODAY_LOCAL_DATE}
                      onChange={handleChange}
                      onBlur={() => handleBlur("fecha_nacimiento")}
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

                  {/* Género */}
                  <div>
                    <label className="label-base">Género</label>
                    <select
                      name="genero"
                      value={formData.genero}
                      onChange={handleChange}
                      onBlur={() => handleBlur("genero")}
                      className="input-base pr-8"
                    >
                      <option value="femenino">Femenino</option>
                      <option value="masculino">Masculino</option>
                      <option value="otro">Prefiero no decirlo</option>
                    </select>
                    
                  </div>                  
                </div>

                {/* Lugar de Residencia */}
                <div>
                  <label className="label-base">Lugar de residencia</label>
                  <button
                    type="button"
                    onClick={() => setIsLocationModalOpen(true)}
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
                    <label className="label-base">Correo electrónico</label>
                    <input
                      type="email"
                      name="correo"
                      value={formData.correo}
                      onChange={handleChange}
                      onBlur={() => handleBlur("correo")}
                      placeholder="example@gmail.com"
                      className={`input-base ${fieldErrors.correo ? "input-error" : ""}`}
                    />
                    {fieldErrors.correo && (
                      <p className="validation-message validation-error">
                        {fieldErrors.correo}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="label-primary">
                      Confirmar correo electrónico
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
                        name="contrasenia"
                        value={formData.contrasenia}
                        onChange={handleChange}
                        onBlur={() => handleBlur("contrasenia")}
                        placeholder="**********"
                        className={`input-base pr-10 ${fieldErrors.contrasenia ? "input-error" : ""}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={
                          showPassword
                            ? "Ocultar contraseña"
                            : "Mostrar contraseña"
                        }
                        className="absolute inset-y-0 right-3 text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {fieldErrors.contrasenia && (
                      <p className="validation-message validation-error">
                        {fieldErrors.contrasenia}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="label-primary">
                      Confirmar contraseña
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        onBlur={() => handleBlur("confirmPassword")}
                        placeholder="**********"
                        className={`input-base pr-10 ${fieldErrors.confirmPassword ? "input-error" : ""}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        aria-label={
                          showConfirmPassword
                            ? "Ocultar contraseña"
                            : "Mostrar contraseña"
                        }
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

          {/* Mensajes de Error y Éxito */}
          {error && (
            <div className="alert-error">
              <p className="alert-error-text">{error}</p>
            </div>
          )}

          {success && (
            <div className="alert-success">
              <p className="alert-success-text">
                ¡Registro exitoso! Redirigiendo...
              </p>
            </div>
          )}

          {/* Botón de Envío */}
          <div className="mt-8 flex justify-center">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Registrando..." : "Registrarse"}
            </button>
          </div>
        </form>

        {isLocationModalOpen && (
          <LocationModal
            onClose={() => setIsLocationModalOpen(false)}
            onSave={handleLocationSave}
            initialData={{
              pais: formData.pais,
              departamento: formData.departamento ?? "",
              municipio: formData.ciudad ?? "",
            }}
          />
        )}
      </div>
    </div>
  );
}
