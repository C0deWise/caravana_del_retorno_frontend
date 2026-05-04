"use client";

import { useEffect, useState } from "react";
import { RequireAuth } from "@/auth/components/RequireAuth";
import { useAuth } from "@/auth/context/AuthContext";
import { ConfirmModal } from "@/components/feedback/confirmModal";
import Spinner from "@/components/feedback/Spinner";
import { useSendReturnUnregistration } from "../hook/useSendReturnUnregistration.hook";
import { returnUnregistrationService } from "../service/returnUnregistration.service";
import type { ReturnUnregistrationApi } from "../types/returnUnregistration.types";
import type { Retorno } from "../../types/retorno.types";

function ReturnUnregistrationFormContent() {
  const { user } = useAuth();
  const { sendReturnUnregistration, loading, error } =
    useSendReturnUnregistration();

  const [eligibilityLoading, setEligibilityLoading] = useState(true);
  const [eligibilityError, setEligibilityError] = useState<string | null>(null);
  const [activeReturn, setActiveReturn] = useState<Retorno | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [unregisteredRecord, setUnregisteredRecord] =
    useState<ReturnUnregistrationApi | null>(null);

  useEffect(() => {
    if (!user?.codigo_colonia) {
      setEligibilityLoading(false);
      return;
    }

    let isMounted = true;

    const loadActiveReturn = async () => {
      setEligibilityLoading(true);
      setEligibilityError(null);

      try {
        const retorno = await returnUnregistrationService.getActiveReturn();
        if (!isMounted) return;
        setActiveReturn(retorno);
      } catch {
        if (!isMounted) return;
        setEligibilityError(
          "No fue posible cargar la información del retorno. Intenta nuevamente.",
        );
      } finally {
        if (isMounted) setEligibilityLoading(false);
      }
    };

    void loadActiveReturn();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleConfirmUnregister = async () => {
    if (!user || !activeReturn) {
      setShowConfirmModal(false);
      return;
    }

    const payload = {
      usuario: user.id,
      retorno: activeReturn.codigo,
    };

    const response = await sendReturnUnregistration(payload);
    setShowConfirmModal(false);

    if (response) {
      setUnregisteredRecord(response);
    }
  };

  if (!user?.codigo_colonia) {
    return (
      <div className="flex items-center justify-center bg-white px-4 py-6">
        <div className="w-full max-w-xl rounded-2xl bg-bg-card p-8 shadow-md text-center">
          <h1 className="page-title mb-4">Darse de baja de un retorno</h1>
          <p className="text-lg font-medium text-text">
            No tienes colonia asignada.
          </p>
          <p className="mt-2 text-text-muted">
            Para gestionar tu registro en un retorno debes hacer parte de una
            colonia.
          </p>
        </div>
      </div>
    );
  }

  if (eligibilityLoading) {
    return (
      <div className="flex items-center justify-center bg-white px-4 py-6">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto" />
          <p className="mt-4 text-text-muted">
            Cargando información del retorno...
          </p>
        </div>
      </div>
    );
  }

  if (eligibilityError) {
    return (
      <div className="flex items-center justify-center bg-white px-4 py-6">
        <div className="w-full max-w-xl rounded-2xl bg-bg-card p-8 shadow-md text-center">
          <h1 className="page-title mb-4">Darse de baja de un retorno</h1>
          <div className="alert-error mb-0">
            <p className="alert-error-text">{eligibilityError}</p>
          </div>
        </div>
      </div>
    );
  }

  if (unregisteredRecord) {
    return (
      <div className="flex items-center justify-center bg-white px-4 py-6">
        <div className="w-full max-w-xl rounded-2xl bg-bg-card p-8 shadow-md text-center">
          <h1 className="page-title mb-4">Darse de baja de un retorno</h1>
          <div className="alert-success mt-0">
            <p className="alert-success-text">
              Te has dado de baja del retorno exitosamente.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!activeReturn) {
    return (
      <div className="flex items-center justify-center bg-white px-4 py-6">
        <div className="w-full max-w-xl rounded-2xl bg-bg-card p-8 shadow-md text-center">
          <h1 className="page-title mb-4">Darse de baja de un retorno</h1>
          <h2 className="section-title mb-4">No hay un retorno activo habilitado</h2>
          <p className="mt-2 text-text-muted">
            No estás registrado en ningún retorno activo actualmente.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white px-4 py-6">
      <div className="mx-auto w-full max-w-xl rounded-2xl bg-bg-card p-8 shadow-md">
        <h1 className="page-title">Darse de baja de un retorno</h1>
        <h2 className="section-title">Usted se encuentra registrado en</h2>

        {error && (
          <div className="alert-error">
            <p className="alert-error-text">{error}</p>
          </div>
        )}

        <div className="mt-4 rounded-lg border border-bg-border bg-bg p-4">
          <h3 className="label-primary mb-3 font-semibold">Retornos</h3>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-col">
              <span className="font-medium text-text">
                Retorno {activeReturn.anio}
              </span>
              <span className="text-sm text-text-muted capitalize">
                {activeReturn.estado}
              </span>
            </div>

            <button
              type="button"
              className="shrink-0 cursor-pointer rounded-lg bg-danger px-4 py-2 text-sm font-semibold text-text-inverse transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => setShowConfirmModal(true)}
              disabled={loading}
            >
              Darme de baja
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirmModal}
        title="¿Confirmas que deseas darte de baja del retorno?"
        details={[
          `Retorno ${activeReturn.anio}`,
        ]}
        onConfirm={handleConfirmUnregister}
        onCancel={() => setShowConfirmModal(false)}
        loading={loading}
        confirmLabel="Confirmar"
        cancelLabel="Cancelar"
      />
    </div>
  );
}

export default function ReturnUnregistrationForm() {
  return (
    <RequireAuth>
      <ReturnUnregistrationFormContent />
    </RequireAuth>
  );
}
