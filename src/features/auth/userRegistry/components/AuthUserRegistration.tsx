"use client";

import { useState } from "react";
import { useRegisterUser } from "../hooks/useUserRegistration";
import { useDocumentValidation } from "../hooks/useDocumentValidation";
import type { RegistrationData } from "../types/registro.types";
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Limpiar error del campo cuando el usuario empieza a escribir
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleBlur = (fieldName: string) => {
    validateField(fieldName);
  };

  const validateField = (fieldName: string) => {
    const value = formData[fieldName as keyof RegistrationData];

    if (!value || (typeof value === "string" && value.trim() === "")) {
      setFieldErrors((prev) => ({
        ...prev,
        [fieldName]: "Este campo es obligatorio",
      }));
      return false;
    }

    return true;
  };

  const validateAllFields = (data: RegistrationData) => {
    const errors: Record<string, string> = {};
    const requiredFields = [
      "nombre",
      "apellido",
      "documento",
      "fecha_nacimiento",
      "celular",
      "ciudad",
      "email",
      "confirmEmail",
      "password",
      "confirmPassword",
    ];

    requiredFields.forEach((field) => {
      const value = data[field as keyof RegistrationData];
      if (!value || (typeof value === "string" && value.trim() === "")) {
        errors[field] = "Este campo es obligatorio";
      }
    });

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleDocumentBlur = async () => {
    if (formData.documento && formData.tipo_doc) {
      await validateDocument(formData.tipo_doc, formData.documento);
    }
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
    const submissionData = buildRegistrationDataFromForm(submittedFormData);

    // Validar todos los campos
    if (!validateAllFields(submissionData)) {
      return;
    }

    // Validar emails coincidan
    if (submissionData.email !== submissionData.confirmEmail) {
      setFieldErrors((prev) => ({
        ...prev,
        confirmEmail: "Los correos electrónicos no coinciden",
      }));
      return;
    }

    // Validar contraseñas coincidan
    if (submissionData.password !== submissionData.confirmPassword) {
      setFieldErrors((prev) => ({
        ...prev,
        confirmPassword: "Las contraseñas no coinciden",
      }));
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

                {/* Identificación y Fecha de Nacimiento */}
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
                        onChange={handleChange}
                        onBlur={() => {
                          handleBlur("documento");
                          handleDocumentBlur();
                        }}
                        placeholder="1234567890"
                        className={`input-base flex-1 ${fieldErrors.documento ? "input-error" : ""}`}
                      />
                    </div>
                    {validating && (
                      <p className="validation-message validation-info">
                        Validando...
                      </p>
                    )}
                    {validationError && !fieldErrors.documento && (
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
                  <div>
                    <label className="label-base">Fecha de nacimiento</label>
                    <input
                      type="date"
                      name="fecha_nacimiento"
                      value={formData.fecha_nacimiento}
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

                {/* Teléfono y Lugar de Residencia */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-base">Teléfono</label>
                    <input
                      type="tel"
                      name="celular"
                      value={formData.celular}
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
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={() => handleBlur("password")}
                      placeholder="**********"
                      className={`input-base ${fieldErrors.password ? "input-error" : ""}`}
                    />
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
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onBlur={() => handleBlur("confirmPassword")}
                      placeholder="**********"
                      className={`input-base ${fieldErrors.confirmPassword ? "input-error" : ""}`}
                    />
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
