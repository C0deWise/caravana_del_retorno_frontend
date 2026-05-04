"use client";

import { useEffect, useMemo, useState } from "react";
import { RequireAuth } from "@/auth/components/RequireAuth";
import { useAuth } from "@/auth/context/AuthContext";
import { ConfirmModal } from "@/components/feedback/confirmModal";
import Spinner from "@/components/feedback/Spinner";
import { useSendReturnRegistration } from "../hooks/useSendReturnRegistration";
import { returnRegistrationService } from "../services/returnRegistration.service";
import ReturnUnregistrationForm from "../../returnUnregistration/components/ReturnUnregistrationForm";
import type {
  ReturnRegistrationAnswer,
  ReturnRegistrationApi,
  ReturnRegistrationCreateRequest,
} from "../types/returnRegistration.types";

type FormErrors = {
  accomodation?: string;
  transport?: string;
  parking?: string;
  people_in_charge?: string;
};

const initialForm: {
  accomodation: ReturnRegistrationAnswer | "";
  transport: ReturnRegistrationAnswer | "";
  parking: ReturnRegistrationAnswer | "";
  people_in_charge: string;
} = {
  accomodation: "",
  transport: "",
  parking: "",
  people_in_charge: "0",
};

function ReturnRegistrationFormContent() {
  const { user } = useAuth();
  const { sendReturnRegistration, loading, error } =
    useSendReturnRegistration();

  const [formData, setFormData] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [submittedRecord, setSubmittedRecord] =
    useState<ReturnRegistrationApi | null>(null);
  const [eligibilityLoading, setEligibilityLoading] = useState(true);
  const [eligibilityError, setEligibilityError] = useState<string | null>(null);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [activeReturnCode, setActiveReturnCode] = useState<number | null>(null);
  const [activeReturnYear, setActiveReturnYear] = useState<number | null>(null);

  useEffect(() => {
    if (!user || !user.codigo_colonia) {
      setEligibilityLoading(false);
      setEligibilityError(null);
      setAlreadyRegistered(false);
      setActiveReturnCode(null);
      return;
    }

    let isMounted = true;

    const resolveActiveReturn = async () => {
      setEligibilityLoading(true);
      setEligibilityError(null);
      setAlreadyRegistered(false);

      try {
        const activeReturn = await returnRegistrationService.getActiveReturn();
        if (!isMounted) return;

        const parsedCode = Number(activeReturn?.codigo);
        const normalizedCode =
          Number.isInteger(parsedCode) && parsedCode > 0 ? parsedCode : null;

        setActiveReturnCode(normalizedCode);
        setActiveReturnYear(activeReturn?.anio ?? null);

        if (!normalizedCode) {
          setAlreadyRegistered(false);
          return;
        }

        const hasRegistration =
          await returnRegistrationService.hasUserRegistrationInReturn(
            user.id,
            normalizedCode,
          );

        if (!isMounted) return;
        setAlreadyRegistered(hasRegistration);
      } catch {
        if (!isMounted) return;
        setEligibilityError(
          "No fue posible validar si existe un retorno activo. Intenta nuevamente.",
        );
      } finally {
        if (!isMounted) return;
        setEligibilityLoading(false);
      }
    };

    void resolveActiveReturn();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const confirmDetails = useMemo(
    () => [
      `Tiene hospedaje: ${formData.accomodation === 1 ? "Sí" : "No"}`,
      `Tiene transporte: ${formData.transport === 1 ? "Sí" : "No"}`,
      ...(formData.transport === 1
        ? [`Necesita parqueadero: ${formData.parking === 1 ? "Sí" : "No"}`]
        : []),
    ],
    [formData.accomodation, formData.transport, formData.parking],
  );

  const validateForm = (): boolean => {
    const nextErrors: FormErrors = {};

    if (formData.accomodation === "") {
      nextErrors.accomodation = "Selecciona si cuentas con hospedaje.";
    }

    if (formData.transport === "") {
      nextErrors.transport = "Selecciona si cuentas con transporte.";
    }

    if (formData.transport === 1 && formData.parking === "") {
      nextErrors.parking = "Selecciona si necesitas parqueadero.";
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleRadioChange = (
    field: "accomodation" | "transport" | "parking",
    value: ReturnRegistrationAnswer,
  ) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "transport" && value === 0) {
        next.parking = "";
      }
      return next;
    });
    setFieldErrors((prev) => {
      const next = { ...prev, [field]: undefined };
      if (field === "transport" && value === 0) {
        next.parking = undefined;
      }
      return next;
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) return;

    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = async () => {
    if (!validateForm()) {
      setShowConfirmModal(false);
      return;
    }

    if (!user) {
      setShowConfirmModal(false);
      return;
    }

    if (!activeReturnCode) {
      setShowConfirmModal(false);
      return;
    }

    try {
      const hasRegistration =
        await returnRegistrationService.hasUserRegistrationInReturn(
          user.id,
          activeReturnCode,
        );

      if (hasRegistration) {
        setAlreadyRegistered(true);
        setShowConfirmModal(false);
        return;
      }
    } catch {
      setEligibilityError(
        "No fue posible validar tu inscripción actual. Intenta nuevamente.",
      );
      setShowConfirmModal(false);
      return;
    }

    const payload: ReturnRegistrationCreateRequest = {
      usuario: user.id,
      retorno: activeReturnCode,
      num_hospedaje: formData.accomodation === 1 ? 0 : 1,
      num_transporte: formData.transport === 1 ? 0 : 1,
      num_parqueadero: formData.transport === 0 ? 0 : (formData.parking as ReturnRegistrationAnswer),
    };

    const response = await sendReturnRegistration(payload);
    setShowConfirmModal(false);

    if (response) {
      setAlreadyRegistered(true);
      setSubmittedRecord(response);
    }
  };

  const resetForm = () => {
    setSubmittedRecord(null);
    setFormData(initialForm);
    setFieldErrors({});
  };

  if (!user || !user.codigo_colonia) {
    return (
      <div className="bg-white px-4 py-6 flex items-center justify-center">
        <div className="w-full max-w-xl rounded-2xl bg-bg-card p-8 shadow-md text-center">
          <h1 className="page-title mb-4">Registro de asistencia al retorno</h1>
          <p className="text-text text-lg font-medium">
            No tienes colonia asignada.
          </p>
          <p className="text-text-muted mt-2">
            Para registrarte a un retorno debes solicitar acceso y hacer parte
            de una colonia.
          </p>
        </div>
      </div>
    );
  }

  if (eligibilityLoading) {
    return (
      <div className="bg-white px-4 py-6 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto" />
          <p className="mt-4 text-text-muted">
            Cargando información de inscripción...
          </p>
        </div>
      </div>
    );
  }

  if (eligibilityError) {
    return (
      <div className="bg-white px-4 py-6 flex items-center justify-center">
        <div className="w-full max-w-xl rounded-2xl bg-bg-card p-8 shadow-md text-center">
          <h1 className="page-title mb-4">Registro de asistencia al retorno</h1>
          <div className="alert-error mb-0">
            <p className="alert-error-text">{eligibilityError}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!activeReturnCode) {
    return (
      <div className="bg-white px-4 py-6 flex items-center justify-center">
        <div className="w-full max-w-xl rounded-2xl bg-bg-card p-8 shadow-md text-center">
          <h1 className="page-title mb-4">Registro de asistencia al retorno</h1>
          <h2 className="section-title mb-4">
            No hay un retorno activo habilitado
          </h2>
          <p className="text-text-muted mt-2">
            Cuando un retorno sea habilitado, podras completar este formulario.
          </p>
        </div>
      </div>
    );
  }

  if (alreadyRegistered) {
    return <ReturnUnregistrationForm />;
  }

  if (submittedRecord) {
    return (
      <div className="bg-white px-4 py-6 flex items-center justify-center">
        <div className="w-full max-w-2xl rounded-2xl bg-bg-card p-8 shadow-md">
          <h1 className="page-title">Registro de asistencia al retorno</h1>
          <h2 className="section-title">Inscripción exitosa</h2>

          <div className="alert-success mt-0">
            <p className="alert-success-text">
              Tu asistencia fue registrada correctamente.
            </p>
          </div>

          <ul className="mt-4 list-disc pl-6 text-text space-y-1">
            <li>
              Tiene hospedaje: {submittedRecord.num_hospedaje === 0 ? "Sí" : "No"}
            </li>
            <li>Tiene transporte: {submittedRecord.num_transporte === 0 ? "Sí" : "No"}</li>
            {submittedRecord.num_transporte === 0 && (
              <li>
                Necesita parqueadero: {submittedRecord.num_parqueadero === 1 ? "Sí" : "No"}
              </li>
            )}
          </ul>

          <div className="mt-8 flex justify-center">
            <button type="button" className="btn-primary" onClick={resetForm}>
              Confirmar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white px-4 py-6">
      <div className="mx-auto w-full max-w-2xl rounded-2xl bg-bg p-6 shadow-md sm:p-8">
        <h1 className="page-title">Registro de Asistencia al Retorno</h1>
        <h2 className="section-title">
          Confirma tu disponibilidad de viaje
          {activeReturnYear
            ? ` — Retorno ${activeReturnYear}`
            : ` — Retorno #${activeReturnCode}`}
        </h2>

        {error && (
          <div className="alert-error">
            <p className="alert-error-text">{error}</p>
          </div>
        )}

        <form className="mt-6 space-y-6" onSubmit={handleSubmit} noValidate>
          <fieldset>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <legend className="label-primary mb-0">¿Tiene hospedaje?</legend>
              <div
                className={`inline-flex items-center gap-5 rounded-lg px-3 py-2 ${fieldErrors.accomodation ? "border border-danger" : "border border-transparent"}`}
              >
                <label className="inline-flex items-center gap-2 text-text">
                  <input
                    type="radio"
                    name="accomodation"
                    value="si"
                    checked={formData.accomodation === 1}
                    onChange={() => handleRadioChange("accomodation", 1)}
                  />
                  Sí
                </label>
                <label className="inline-flex items-center gap-2 text-text">
                  <input
                    type="radio"
                    name="accomodation"
                    value="no"
                    checked={formData.accomodation === 0}
                    onChange={() => handleRadioChange("accomodation", 0)}
                  />
                  No
                </label>
              </div>
            </div>
            {fieldErrors.accomodation && (
              <p className="validation-message validation-error">
                {fieldErrors.accomodation}
              </p>
            )}
          </fieldset>

          <fieldset>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <legend className="label-primary mb-0">¿Tiene transporte?</legend>
              <div
                className={`inline-flex items-center gap-5 rounded-lg px-3 py-2 ${fieldErrors.transport ? "border border-danger" : "border border-transparent"}`}
              >
                <label className="inline-flex items-center gap-2 text-text">
                  <input
                    type="radio"
                    name="transport"
                    value="si"
                    checked={formData.transport === 1}
                    onChange={() => handleRadioChange("transport", 1)}
                  />
                  Sí
                </label>
                <label className="inline-flex items-center gap-2 text-text">
                  <input
                    type="radio"
                    name="transport"
                    value="no"
                    checked={formData.transport === 0}
                    onChange={() => handleRadioChange("transport", 0)}
                  />
                  No
                </label>
              </div>
            </div>
            {fieldErrors.transport && (
              <p className="validation-message validation-error">
                {fieldErrors.transport}
              </p>
            )}
          </fieldset>

          {formData.transport === 1 && (
          <fieldset>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <legend className="label-primary mb-0">
                ¿Necesita parqueadero?
              </legend>
              <div
                className={`inline-flex items-center gap-5 rounded-lg px-3 py-2 ${fieldErrors.parking ? "border border-danger" : "border border-transparent"}`}
              >
                <label className="inline-flex items-center gap-2 text-text">
                  <input
                    type="radio"
                    name="parking"
                    value="si"
                    checked={formData.parking === 1}
                    onChange={() => handleRadioChange("parking", 1)}
                  />
                  Sí
                </label>
                <label className="inline-flex items-center gap-2 text-text">
                  <input
                    type="radio"
                    name="parking"
                    value="no"
                    checked={formData.parking === 0}
                    onChange={() => handleRadioChange("parking", 0)}
                  />
                  No
                </label>
              </div>
            </div>
            {fieldErrors.parking && (
              <p className="validation-message validation-error">
                {fieldErrors.parking}
              </p>
            )}
          </fieldset>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <label htmlFor="people-in-charge" className="label-primary mb-0">
                ¿Personas a cargo o visitantes?
              </label>
              <p className="validation-message validation-info mt-1">
                Realiza una inscripción grupal con los menores, personas con
                discapacidad o visitantes que requieran asistencia a través del
                siguiente botón.
              </p>
            </div>
            <button
              type="button"
              className="btn-secondary"
              onClick={() =>
                alert(
                  "Funcionalidad en desarrollo. Pronto podrás registrar personas a cargo o visitantes.",
                )
              }
            >
              Registrar
            </button>
          </div>

          <div className="flex justify-center pt-1">
            <button
              type="submit"
              className="btn-primary bg-secondary min-w-48 inline-flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading && <Spinner size="sm" />}
              {loading ? "Enviando..." : "Registrar asistencia"}
            </button>
          </div>
        </form>
      </div>

      <ConfirmModal
        isOpen={showConfirmModal}
        title="¿Confirmas tu registro de asistencia?"
        details={confirmDetails}
        onConfirm={handleConfirmSubmit}
        onCancel={() => setShowConfirmModal(false)}
        loading={loading}
        confirmLabel="Confirmar"
        cancelLabel="Cancelar"
      />
    </div>
  );
}

export default function ReturnRegistrationForm() {
  return (
    <RequireAuth>
      <ReturnRegistrationFormContent />
    </RequireAuth>
  );
}

