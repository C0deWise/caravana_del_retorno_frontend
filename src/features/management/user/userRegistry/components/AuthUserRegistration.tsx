"use client";

import React, { useState, useEffect } from "react";
import { Eye, EyeOff, ChevronRight, ChevronLeft, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MarqueeText } from "@/components/common/MarqueeText";
import { useRegisterUser } from "../hooks/useUserRegistration";
import type { RegistrationFormData } from "../types/registro.types";
import {
  normalizeFormData,
  validateRegistrationData,
  validateRegistrationField,
} from "../utils/registrationValidation";
import LocationModal, { LocationData } from "./LocationModal";
import { UserGender } from "@/types/user.types";
import { InputField } from "@/components/forms/InputField";
import { SelectField } from "@/components/forms/SelectField";
import { DatePickerField } from "@/components/forms/DatePickerField";
import HorizontalSeparator from "@/components/layout/HorizontalSeparator";

const TODAY_LOCAL_DATE = (() => {
  const now = new Date();
  const timezoneOffsetMs = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - timezoneOffsetMs).toISOString().split("T")[0];
})();

const STEPS = [
  { id: 0, title: "Datos Personales" },
  { id: 1, title: "Inicio de Sesión" }
];

export default function AuthUserRegistration() {
  const { registerUser, loading, error, success } = useRegisterUser();
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (success) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [success]);

  const [formData, setFormData] = useState<RegistrationFormData>({
    tipo_doc: "",
    documento: "",
    celular: "",
    nombre: "",
    apellido: "",
    genero: "" as UserGender,
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
  
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    const nextFormData = { ...formData };

    if (name === "tipo_doc") {
      nextFormData.tipo_doc = value;
      nextFormData.documento = sanitizeDocumentInput(value, formData.documento);
    } else if (name === "documento") {
      nextFormData.documento = sanitizeDocumentInput(formData.tipo_doc, value);
    } else if (name === "celular") {
      nextFormData.celular = value.replace(/\D/g, "").slice(0, 10);
    } else {
      (nextFormData as Record<string, unknown>)[name] = value;
    }

    setFormData(nextFormData);

    if (fieldErrors[name] || name === "tipo_doc" || name === "documento" || name === "genero") {
      setFieldErrors((prev) => {
        const next = { ...prev };
        
        const fieldError = validateRegistrationField(name as keyof RegistrationFormData, nextFormData);
        if (fieldError) next[name] = fieldError;
        else delete next[name];

        if (name === "tipo_doc") {
          const docError = validateRegistrationField("documento", nextFormData);
          if (docError) next.documento = docError;
          else delete next.documento;
        } else if (name === "documento") {
          const tipoError = validateRegistrationField("tipo_doc", nextFormData);
          if (tipoError) next.tipo_doc = tipoError;
          else delete next.tipo_doc;
        }

        return next;
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

  const handleNextStep = () => {
    const step1Fields: (keyof RegistrationFormData)[] = [
      "nombre",
      "apellido",
      "tipo_doc",
      "documento",
      "fecha_nacimiento",
      "celular",
      "genero",
    ];

    let hasErrors = false;
    const newErrors = { ...fieldErrors };

    step1Fields.forEach((field) => {
      const err = validateRegistrationField(field, formData);
      if (err) {
        newErrors[field] = err;
        hasErrors = true;
      }
    });

    if (!formData.pais) {
      newErrors.ciudad = "Debe seleccionar un lugar de residencia";
      hasErrors = true;
    }

    setFieldErrors(newErrors);

    if (!hasErrors) {
      setCurrentStep(1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const normalized = normalizeFormData(formData);
    setFormData(normalized);

    const formErrors = validateRegistrationData(normalized);
    setFieldErrors(formErrors);

    if (Object.keys(formErrors).length > 0) return;

    const { confirmEmail: _, confirmPassword: __, ...registrationData } = normalized;
    void _;
    void __;
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
        return `${formData.ciudad}, ${formData.departamento}, ${formData.pais}`;
      } else if (formData.departamento) {
        return `${formData.departamento}, ${formData.pais}`;
      }
    }
    return formData.pais || "Seleccionar ubicación";
  };

  const labelClass = "block text-sm font-medium text-text mb-1.5";

  useEffect(() => {
    if (success) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [success]);

  return (
    <>
      <div className="bg-white/60 backdrop-blur-xl border border-white/50 shadow-2xl rounded-4xl pt-8 pb-2 md:pt-8 md:pb-1 transition-all duration-300">
      {/* Encabezado */}
      <AnimatePresence>
        {!success && (
          <motion.div 
            initial={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0, overflow: "hidden" }}
            className="text-center mb-5"
          >
            <h1 className="text-3xl font-bold text-primary mb-2">Crear una cuenta</h1>
            <p className="text-gray-600">Únete a la Caravana del Retorno</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stepper Indicator */}
      <AnimatePresence>
        {!success && (
          <motion.div 
            initial={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0, overflow: "hidden", marginBottom: 0 }}
            className="flex items-center justify-center mb-5"
          >
            {STEPS.map((step, idx) => (
              <div key={step.id} className="flex items-center">
                <div className="relative flex items-center justify-center">
                  {/* Efecto Ping para el paso actual */}
                  {currentStep === step.id && (
                    <div className="absolute inset-0 rounded-full bg-primary/40 animate-ping"></div>
                  )}
                  
                  <div
                    className={`relative flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm transition-colors duration-300 z-10 ${
                      currentStep > step.id
                        ? "bg-accent-green text-white shadow-md"
                        : currentStep === step.id
                        ? "bg-primary text-white shadow-lg ring-4 ring-primary/20"
                        : "bg-white/80 text-gray-400 border border-white"
                    }`}
                  >
                    {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id + 1}
                  </div>
                </div>
                
                {idx < STEPS.length - 1 && (
                  <div
                    className={`w-12 sm:w-16 md:w-24 h-1 mx-2 rounded-full transition-colors duration-300 ${
                      currentStep > step.id ? "bg-accent-green" : "bg-white/50"
                    }`}
                  />
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        animate={{ 
          height: success 
            ? (isMobile ? 380 : 340)
            : currentStep === 0 
              ? (isMobile ? 830 : 530) 
              : (isMobile ? 580 : 340) 
        }}
        transition={{ delay: 0.15, duration: 0.15, ease: "easeInOut" }}
        className="relative overflow-hidden w-full px-5 md:px-8 lg:px-12"
      >
        <div className="w-full">
          <form onSubmit={handleSubmit} className="w-full">
            <AnimatePresence mode="wait" initial={false}>
              {!success && currentStep === 0 && (
                <motion.div
                  key="step0"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0, transition: { delay: 0.15, duration: 0.15 } }}
                  exit={{ opacity: 0, x: -50, transition: { duration: 0.15 } }}
                  className="space-y-6 w-full"
                >
                <div>
                  <h2 className="text-xl font-semibold text-primary mb-1">
                    Datos Personales
                  </h2>
                  <div className="h-1 w-full rounded-full overflow-hidden">
                    <HorizontalSeparator />
                  </div>
                </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Nombres"
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  onBlur={() => handleBlur("nombre")}
                  placeholder="Ej. Juan"
                  hasError={!!fieldErrors.nombre}
                  errorMessage={fieldErrors.nombre}
                />
                <InputField
                  label="Apellidos"
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  onBlur={() => handleBlur("apellido")}
                  placeholder="Ej. Pérez"
                  hasError={!!fieldErrors.apellido}
                  errorMessage={fieldErrors.apellido}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <label className={labelClass}>Identificación</label>
                  <div className="flex gap-2">
                    <div className="w-26 flex-none">
                      <SelectField
                        name="tipo_doc"
                        value={formData.tipo_doc ? { value: formData.tipo_doc, label: formData.tipo_doc } : null}
                        onChange={(opt: { value: string; label: string } | null) => handleChange({ target: { name: 'tipo_doc', value: opt?.value || '' } } as unknown as React.ChangeEvent<HTMLSelectElement>)}
                        options={[
                          { value: "CC", label: "CC" },
                          { value: "CE", label: "CE" },
                          { value: "PA", label: "PA" },
                          { value: "TI", label: "TI" },
                          { value: "RC", label: "RC" },
                          { value: "PEP", label: "PEP" },
                          { value: "PPT", label: "PPT" },
                        ]}
                        hasError={!!fieldErrors.tipo_doc}
                        placeholder="Tipo"
                      />
                    </div>
                    <div className="flex-1">
                      <InputField
                        type="text"
                        name="documento"
                        value={formData.documento}
                        inputMode={formData.tipo_doc === "PA" ? "text" : "numeric"}
                        maxLength={
                          formData.tipo_doc === "PA"
                            ? 20
                            : formData.tipo_doc === "CE"
                            ? 12
                            : 10
                        }
                        onChange={handleChange}
                        onBlur={() => handleBlur("documento")}
                        placeholder={
                          !formData.tipo_doc
                            ? "Elija un tipo"
                            : formData.tipo_doc === "PA"
                            ? "Ej. AB123456"
                            : "Ej. 123456789"
                        }
                        disabled={!formData.tipo_doc}
                        hasError={!!fieldErrors.documento || !!fieldErrors.tipo_doc}
                      />
                    </div>
                  </div>
                  {(fieldErrors.tipo_doc || fieldErrors.documento) && (
                    <p className="absolute -bottom-5 left-1 text-accent-red text-xs font-medium z-10">
                      {fieldErrors.tipo_doc || fieldErrors.documento}
                    </p>
                  )}
                </div>

                <DatePickerField
                  label="Fecha de nacimiento"
                  name="fecha_nacimiento"
                  selected={formData.fecha_nacimiento ? new Date(`${formData.fecha_nacimiento}T00:00:00`) : null}
                  onChange={(date: Date | null) => {
                    const formattedDate = date ? date.toISOString().split("T")[0] : "";
                    const newFormData = { ...formData, fecha_nacimiento: formattedDate };
                    setFormData(newFormData);
                    
                    const fieldError = validateRegistrationField("fecha_nacimiento", newFormData);
                    setFieldErrors((prev) => {
                      const newErrors = { ...prev };
                      if (fieldError) {
                        newErrors.fecha_nacimiento = fieldError;
                      } else {
                        delete newErrors.fecha_nacimiento;
                      }
                      return newErrors;
                    });
                  }}
                  onBlur={() => handleBlur("fecha_nacimiento")}
                  maxDate={new Date(TODAY_LOCAL_DATE)}
                  hasError={!!fieldErrors.fecha_nacimiento}
                  errorMessage={fieldErrors.fecha_nacimiento}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Teléfono celular"
                  type="tel"
                  name="celular"
                  value={formData.celular}
                  inputMode="numeric"
                  maxLength={10}
                  onChange={handleChange}
                  onBlur={() => handleBlur("celular")}
                  placeholder="Ej. 3001234567"
                  hasError={!!fieldErrors.celular}
                  errorMessage={fieldErrors.celular}
                />

                <SelectField
                  label="Género"
                  name="genero"
                  value={
                    formData.genero
                      ? {
                          value: formData.genero,
                          label: formData.genero === "F" ? "Femenino" : formData.genero === "M" ? "Masculino" : "Prefiero no decirlo"
                        }
                      : null
                  }
                  onChange={(opt: { value: string; label: string } | null) => handleChange({ target: { name: 'genero', value: opt?.value || '' } } as unknown as React.ChangeEvent<HTMLSelectElement>)}
                  options={[
                    { value: "F", label: "Femenino" },
                    { value: "M", label: "Masculino" },
                    { value: "otro", label: "Prefiero no decirlo" },
                  ]}
                  hasError={!!fieldErrors.genero}
                  errorMessage={fieldErrors.genero}
                />
              </div>

              <div className="relative">
                <label className={labelClass}>Lugar de residencia</label>
                <button
                  type="button"
                  onClick={() => setIsLocationModalOpen(true)}
                  className={`w-full px-4 py-3 rounded-xl border bg-white transition-all outline-none focus:ring-2 focus:ring-primary/50 text-left flex items-center justify-between ${
                    formData.pais ? "text-gray-900" : "text-gray-400/60"
                  } ${
                    !!fieldErrors.ciudad ? "border-accent-red focus:border-accent-red" : "border-gray-300 focus:border-primary hover:border-gray-400"
                  }`}
                >
                  <div className="flex-1 w-full overflow-hidden">
                    {getLocationDisplay() ? (
                      <MarqueeText text={getLocationDisplay()} speed={20} className="w-full text-left" />
                    ) : (
                      <span className="text-text-muted">Agregar ubicación</span>
                    )}
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 shrink-0 ml-2" />
                </button>
                {fieldErrors.ciudad && (
                  <p className="absolute -bottom-5 left-1 text-accent-red text-xs font-medium">{fieldErrors.ciudad}</p>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full sm:w-auto flex justify-center items-center gap-2 bg-primary hover:bg-primary/90 text-white font-medium py-3 px-8 rounded-xl transition-all shadow-lg shadow-primary/20"
                >
                  Siguiente paso <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

            {!success && currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0, transition: { delay: 0.15, duration: 0.15 } }}
                exit={{ opacity: 0, x: 50, transition: { duration: 0.15 } }}
                className="space-y-6 w-full h-full flex flex-col justify-center"
              >
              <div>
                <h2 className="text-xl font-semibold text-primary mb-1">
                  Datos de Inicio de Sesión
                </h2>
                <div className="h-1 w-full rounded-full overflow-hidden">
                  <HorizontalSeparator />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Correo electrónico"
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  onBlur={() => handleBlur("correo")}
                  placeholder="tu@email.com"
                  hasError={!!fieldErrors.correo}
                  errorMessage={fieldErrors.correo}
                />
                <InputField
                  label="Confirmar correo"
                  type="email"
                  name="confirmEmail"
                  value={formData.confirmEmail}
                  onChange={handleChange}
                  onBlur={() => handleBlur("confirmEmail")}
                  onPaste={(e) => e.preventDefault()}
                  placeholder="Repite tu correo"
                  hasError={!!fieldErrors.confirmEmail}
                  errorMessage={fieldErrors.confirmEmail}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Contraseña"
                  type={showPassword ? "text" : "password"}
                  name="contrasenia"
                  value={formData.contrasenia}
                  onChange={handleChange}
                  onBlur={() => handleBlur("contrasenia")}
                  placeholder="••••••••"
                  hasError={!!fieldErrors.contrasenia}
                  errorMessage={fieldErrors.contrasenia}
                  rightElement={
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  }
                />
                <InputField
                  label="Confirmar contraseña"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={() => handleBlur("confirmPassword")}
                  onPaste={(e) => e.preventDefault()}
                  placeholder="••••••••"
                  hasError={!!fieldErrors.confirmPassword}
                  errorMessage={fieldErrors.confirmPassword}
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  }
                />
              </div>

              {/* Mensajes */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                  {error}
                </div>
              )}

              <div className="pt-1 flex flex-col-reverse sm:flex-row justify-between items-center gap-3 sm:gap-0">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="w-full sm:w-auto flex justify-center items-center gap-2 text-gray-500 hover:text-gray-800 font-medium py-3 px-6 rounded-xl transition-all hover:bg-white/50"
                >
                  <ChevronLeft className="w-5 h-5" /> Atrás
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto flex justify-center items-center bg-secondary hover:bg-secondary/90 text-white font-medium py-3 px-8 rounded-xl transition-all shadow-lg shadow-secondary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Procesando..." : "Finalizar Registro"}
                </button>
              </div>
              </motion.div>
            )}

            {success && (
              <motion.div
                key="stepSuccess"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1, transition: { duration: 0.4 } }}
                className="flex flex-col items-center justify-center h-full w-full py-10"
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                  className="w-24 h-24 bg-accent-green rounded-full flex items-center justify-center mb-6 shadow-xl shadow-accent-green/20"
                >
                  <Check className="w-12 h-12 text-white" />
                </motion.div>
                
                <h2 className="text-2xl font-bold text-primary mb-2 text-center">
                  ¡Bienvenido a la Caravana!
                </h2>
                <p className="text-gray-600 text-center mb-10 max-w-sm">
                  Tu cuenta ha sido creada exitosamente. Te estamos redirigiendo al panel principal...
                </p>
                
                <div className="w-48 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-accent-green rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 5, ease: "linear" }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
        </div>
      </motion.div>
      </div>

      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onSave={handleLocationSave}
        initialData={{
          pais: formData.pais,
          departamento: formData.departamento ?? "",
          municipio: formData.ciudad ?? "",
        }}
      />
    </>
  );
}
