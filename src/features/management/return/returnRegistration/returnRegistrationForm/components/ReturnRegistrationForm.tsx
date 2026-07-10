"use client";

import { useEffect, useMemo, useState } from "react";
import { RequireAuth } from "@/auth/components/RequireAuth";
import { useAuth } from "@/auth/context/AuthContext";
import { ConfirmModal } from "@/components/feedback/confirmModal";
import { useToast } from "@/components/feedback/Toast";
import Spinner from "@/components/feedback/Spinner";
import { useSendReturnRegistration } from "../hooks/useSendReturnRegistration";
import type { UserData } from "@/types/user.types";
import type {
  ReturnRegistrationAnswer,
  ReturnRegistrationApi,
  ReturnRegistrationCreateRequest,
} from "../../types/returnRegistration.types";
import { retornoService } from "../../../shared/services/retorno.service";
import { ReturnRegistrationManagement } from "../../returnRegistrationManagement/components/returnRegistrationManagement";
import { useRouter } from "next/navigation";
import { SelectField } from "@/components/forms/SelectField";

type ParkingOption = "none" | "car" | "bike";

type FormErrors = {
  accomodation?: string;
  transport?: string;
  parking?: string;
};

const initialForm: {
  accomodation: ReturnRegistrationAnswer | "";
  transport: ReturnRegistrationAnswer | "";
  parking: ParkingOption | "";
  note: string;
} = {
  accomodation: "",
  transport: "",
  parking: "",
  note: "",
};

function parkingOptionLabel(parking: ParkingOption | ""): string {
  if (parking === "car") return "Sí, para carro";
  if (parking === "bike") return "Sí, para moto";
  return "No";
}

function NoUserView() {
  return (
    <div className="bg-white px-4 py-6 flex items-center justify-center">
      <div className="w-full max-w-xl rounded-2xl bg-bg-card p-8 shadow-md text-center">
        <h1 className="page-title">Registro de Asistencia al Retorno</h1>
        <p className="text-text text-lg font-medium">
          Debes iniciar sesión para registrar tu asistencia al retorno.
        </p>
      </div>
    </div>
  );
}

function NoColonyView() {
  return (
    <div className="bg-white px-4 py-6 flex items-center justify-center">
      <div className="w-full max-w-xl rounded-2xl bg-bg-card p-8 shadow-md text-center">
        <h1 className="page-title">Registro de Asistencia al Retorno</h1>
        <p className="text-text text-lg font-medium">No tienes colonia asignada.</p>
        <p className="text-text-muted mt-2">
          Para registrarte a un retorno debes solicitar acceso y hacer parte de una colonia.
        </p>
      </div>
    </div>
  );
}

function EligibilityLoadingView() {
  return (
    <div className="bg-white px-4 py-6 flex items-center justify-center">
      <div className="text-center">
        <Spinner size="lg" className="mx-auto" />
        <p className="mt-4 text-text-muted">Cargando información de inscripción...</p>
      </div>
    </div>
  );
}

function EligibilityErrorView({ error }: { readonly error: string }) {
  return (
    <div className="bg-white px-4 py-6 flex items-center justify-center">
      <div className="w-full max-w-xl rounded-2xl bg-bg-card p-8 shadow-md text-center">
        <h1 className="page-title">Registro de Asistencia al Retorno</h1>
        <div className="alert-error mb-0">
          <p className="alert-error-text">{error}</p>
        </div>
      </div>
    </div>
  );
}

function NoActiveReturnView() {
  return (
    <div className="bg-white px-4 py-6 flex items-center justify-center">
      <div className="w-full max-w-xl rounded-2xl bg-bg-card p-8 shadow-md text-center">
        <h1 className="page-title">Registro de Asistencia al Retorno</h1>
        <h2 className="section-title mb-4">No hay un retorno activo habilitado</h2>
        <p className="text-text-muted mt-2">
          Cuando un retorno sea habilitado, podras completar este formulario.
        </p>
      </div>
    </div>
  );
}

type FormGuardProps = {
  user: UserData | null;
  eligibilityLoading: boolean;
  eligibilityError: string | null;
  activeReturnCode: number | null;
  activeReturnYear: number | null;
  alreadyRegistered: boolean;
  submittedRecord: ReturnRegistrationApi | null;
  onReset: () => void;
  onUnregistered: () => void;
};

function resolveFormGuard({
  user,
  eligibilityLoading,
  eligibilityError,
  activeReturnCode,
  activeReturnYear,
  alreadyRegistered,
  onUnregistered,
}: FormGuardProps): React.ReactNode {
  if (!user) return <NoUserView />;
  if (!user.codigo_colonia) return <NoColonyView />;
  if (eligibilityLoading) return <EligibilityLoadingView />;
  if (eligibilityError) return <EligibilityErrorView error={eligibilityError} />;
  if (!activeReturnCode) return <NoActiveReturnView />;
  if (alreadyRegistered) {
    return (
      <ReturnRegistrationManagement
        userId={user.id}
        activeReturnCode={activeReturnCode}
        activeReturnYear={activeReturnYear}
        onUnregistered={onUnregistered}
      />
    );
  }
  return null;
}

function ReturnRegistrationFormContent() {
  const { user } = useAuth();
  const { sendReturnRegistration, loading, error } =
    useSendReturnRegistration();
  const router = useRouter();
  const { showToast } = useToast();

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
  const maxLength = 150;

  useEffect(() => {
    if (!user) {
      setEligibilityLoading(false);
      setEligibilityError(null);
      setAlreadyRegistered(false);
      setActiveReturnCode(null);
      return;
    }

    if (!user.codigo_colonia) {
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
        const activeReturn = await retornoService.getActiveReturn();
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
          await retornoService.hasUserRegistrationInReturn(
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
      <span key="hospedaje"><strong>Tiene hospedaje: </strong>{formData.accomodation === 1 ? "Sí" : "No"}</span>,
      <span key="transporte"><strong>Tiene transporte: </strong>{formData.transport === 1 ? "Sí" : "No"}</span>,
      ...(formData.transport === 1
        ? [<span key="parqueadero"><strong>Parqueadero: </strong>{parkingOptionLabel(formData.parking)}</span>,]
        : []),
      ...(formData.note ? [<span key="nota"><strong>Nota: </strong><em>{formData.note}</em></span>] : []),
    ],
    [formData.accomodation, formData.transport, formData.parking, formData.note],
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
      nextErrors.parking = "Selecciona si necesitas parqueadero y de qué tipo.";
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleRadioChange = (
    field: "accomodation" | "transport",
    value: ReturnRegistrationAnswer | "",
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

  const handleParkingChange = (value: ParkingOption | "") => {
    setFormData((prev) => ({ ...prev, parking: value }));
    setFieldErrors((prev) => ({ ...prev, parking: undefined }));
  };

  const handleUnregistered = () => {
    setAlreadyRegistered(false);
    setSubmittedRecord(null);
    resetForm();
  };

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
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
        await retornoService.hasUserRegistrationInReturn(
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
      num_parqueadero_carro: formData.transport === 0 ? 0 : Number(formData.parking === "car"),
      num_parqueadero_moto: formData.transport === 0 ? 0 : Number(formData.parking === "bike"),
      anotacion: formData.note || undefined,
    };

    const response = await sendReturnRegistration(payload);
    setShowConfirmModal(false);

    if (response) {
      setAlreadyRegistered(true);
      showToast("Asistencia registrada exitosamente", "success");
    } else {
      showToast("No se pudo registrar la asistencia, intenta nuevamente", "error");
    }
  };

  const resetForm = () => {
    setSubmittedRecord(null);
    setFormData(initialForm);
    setFieldErrors({});
  };

  const guardView = resolveFormGuard({
    user,
    eligibilityLoading,
    eligibilityError,
    activeReturnCode,
    activeReturnYear,
    alreadyRegistered,
    submittedRecord,
    onReset: resetForm,
    onUnregistered: handleUnregistered,
  });
  if (guardView) return guardView;

  return (
    <div className="flex flex-col h-full w-full items-center justify-start pt-8 px-4 bg-bg">
      <div className="w-full max-w-3xl rounded-3xl border border-bg-border bg-bg p-6 shadow-xl sm:p-8">
        <h1 className="page-title text-center mb-1">
          {activeReturnYear
            ? ` Registro de Asistencia para El Retorno ${activeReturnYear}`
            : ` El Retorno #${activeReturnCode}`}
        </h1>
        <h2 className="section-title text-center mb-6">
          Confirma tu disponibilidad de viaje
        </h2>

        {error && (
          <div className="alert-error mt-4">
            <p className="alert-error-text">{error}</p>
          </div>
        )}

        <form className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch" onSubmit={handleSubmit} noValidate>
          <div className="space-y-4 flex flex-col justify-between">
            <SelectField
              label="¿Tiene hospedaje?"
              options={[
                { value: 1, label: "Sí" },
                { value: 0, label: "No" },
              ]}
              value={formData.accomodation !== "" ? { value: formData.accomodation, label: formData.accomodation === 1 ? "Sí" : "No" } : null}
              onChange={(option) => handleRadioChange("accomodation", option ? (option.value as ReturnRegistrationAnswer) : "")}
              hasError={!!fieldErrors.accomodation}
              errorMessage={fieldErrors.accomodation}
            />

            <SelectField
              label="¿Tiene transporte?"
              options={[
                { value: 1, label: "Sí" },
                { value: 0, label: "No" },
              ]}
              value={formData.transport !== "" ? { value: formData.transport, label: formData.transport === 1 ? "Sí" : "No" } : null}
              onChange={(option) => handleRadioChange("transport", option ? (option.value as ReturnRegistrationAnswer) : "")}
              hasError={!!fieldErrors.transport}
              errorMessage={fieldErrors.transport}
            />

            <SelectField
              label="¿Necesita parqueadero?"
              options={[
                { value: "none", label: "No" },
                { value: "car", label: "Sí, para carro" },
                { value: "bike", label: "Sí, para moto" },
              ]}
              value={
                formData.parking !== ""
                  ? { value: formData.parking, label: parkingOptionLabel(formData.parking) }
                  : null
              }
              onChange={(option) => handleParkingChange(option ? (option.value as ParkingOption) : "")}
              hasError={!!fieldErrors.parking}
              errorMessage={fieldErrors.parking}
              isDisabled={formData.transport !== 1}
            />
          </div>

          <div className="flex flex-col justify-between h-full">
            <div className="flex-1 flex flex-col">
              <label htmlFor="note" className="block text-sm font-medium text-text mb-1.5">
                Notas adicionales <span className="text-xs text-text-muted font-normal">(Opcional)</span>
              </label>
              <textarea
                id="note"
                name="note"
                className="textarea-base w-full resize-none flex-1 min-h-[140px]"
                maxLength={maxLength}
                placeholder="Indica información adicional relevante para tu asistencia..."
                value={formData.note}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, note: e.target.value }))
                }
              />
              <p className="text-[10px] text-text-muted text-right mt-1">
                {formData.note.length} / {maxLength} caracteres
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                className="btn-secondary px-6 py-2 text-sm"
                onClick={() => router.push("/gestion/retorno/registro")}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-primary bg-secondary px-6 py-2 text-sm inline-flex items-center justify-center gap-2 hover:opacity-90"
                disabled={loading}
              >
                {loading && <Spinner size="sm" />}
                {loading ? "Enviando..." : "Registrar asistencia"}
              </button>
            </div>
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

