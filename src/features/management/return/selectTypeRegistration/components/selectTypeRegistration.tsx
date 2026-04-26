"use client";

import { useState } from "react";
import { useAuth } from "@/auth/context/AuthContext";
import { RequireAuth } from "@/auth/components/RequireAuth";
import Spinner from "@/ui/animations/Spinner";
import { useActiveReturn } from "../hooks/useActiveReturn";
import ReturnRegistrationForm from "../../returnRegistrationForm/components/ReturnRegistrationForm";
import { GrupalReturnRegistrationForm } from "../../grupalReturnRegistrationForm/components/grupalReturnRegistrationForm";

type RegistrationView = "individual" | "grupal";

const ALLOWED_ROLES = ["usuario", "lider_colonia"] as const;
type AllowedRole = (typeof ALLOWED_ROLES)[number];

function SelectTypeRegistrationContent() {
  const { user } = useAuth();
  const { activeReturn, loading, error } = useActiveReturn();
  const [view, setView] = useState<RegistrationView | null>(null);

  const hasColony = !!user?.codigo_colonia;
  const hasAllowedRole = user
    ? ALLOWED_ROLES.includes(user.role as AllowedRole)
    : false;
  const canRegister = hasColony && hasAllowedRole && !!activeReturn;

  if (view === "individual") return <ReturnRegistrationForm />;
  if (view === "grupal") return <GrupalReturnRegistrationForm />;

  if (loading) {
    return (
      <div className="bg-white px-4 py-6 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto" />
          <p className="mt-4 text-text-muted">Cargando información...</p>
        </div>
      </div>
    );
  }

  if (!user || !hasAllowedRole) {
    return (
      <div className="bg-white px-4 py-6 flex items-center justify-center">
        <div className="w-full max-w-xl rounded-2xl bg-bg-card p-8 shadow-md text-center">
          <h1 className="page-title">Inscribirse a un retorno</h1>
          <p className="text-text text-lg font-medium">
            No tienes permisos para acceder a esta sección.
          </p>
        </div>
      </div>
    );
  }

  if (!hasColony) {
    return (
      <div className="bg-white px-4 py-6 flex items-center justify-center">
        <div className="w-full max-w-xl rounded-2xl bg-bg-card p-8 shadow-md text-center">
          <h1 className="page-title">Inscribirse a un retorno</h1>
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

  return (
    <div className="bg-white px-4 py-6 flex items-center justify-center">
      <div className="w-full max-w-xl rounded-2xl bg-bg-card p-8 shadow-md">
        <h1 className="page-title">Inscribirse a un retorno</h1>
        <p className="section-title">
          Seleccione el retorno al que desea inscribirse
        </p>

        {error && (
          <div className="alert-error">
            <p className="alert-error-text">{error}</p>
          </div>
        )}

        <div className="rounded-xl bg-bg-border p-4 mb-6">
          <h2 className="font-bold text-text mb-3">Retornos activos</h2>
          {activeReturn ? (
            <div className="bg-bg rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-text">
                  Retorno {activeReturn.anio}
                </p>
                <p className="text-text-muted text-sm">{activeReturn.estado}</p>
              </div>
            </div>
          ) : (
            <p className="text-text-muted text-center py-4">
              No hay un retorno activo habilitado.
            </p>
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setView("individual")}
            disabled={!canRegister}
            className="btn-action"
          >
            Inscripción Individual
          </button>
          <button
            onClick={() => setView("grupal")}
            disabled={!canRegister}
            className="btn-action"
          >
            Inscripción Grupal
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SelectTypeRegistration() {
  return (
    <RequireAuth>
      <SelectTypeRegistrationContent />
    </RequireAuth>
  );
}
