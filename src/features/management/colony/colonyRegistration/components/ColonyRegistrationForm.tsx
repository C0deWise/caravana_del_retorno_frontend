"use client";

import { useEffect, useMemo, useState } from "react";
import { useListColonies } from "../../hooks/useListColonies";
import { useSignupColony } from "../hooks/useSignupColony";
import { useAuth } from "@/auth/context/AuthContext";
import type { ColonyData } from "@/types/colony.types";
import { ConfirmModal } from "@/components/feedback/confirmModal";
import { RequireAuth } from "@/auth/components/RequireAuth";
import { normalizeText } from "@/utils/formatting";
import { Autocomplete } from "@/components/forms/Autocomplete";
import { useToast } from "@/components/feedback/Toast";

function InscripcionColoniaFormFeature() {
  const { user } = useAuth();
  const {
    listColonies,
    colonies,
    loading: loadingColonies,
    error: errorColonies,
  } = useListColonies();
  const {
    signupColony,
    loading: loadingSignup,
    error: errorSignup,
  } = useSignupColony();

  const { showToast } = useToast();
  const [busqueda, setBusqueda] = useState("");
  const [seleccionada, setSeleccionada] = useState<ColonyData | null>(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  const yaPertenecAColonia = Boolean(user?.codigo_colonia);
  const esAdmin = Boolean(user?.role === "admin");
  const loading = loadingColonies || loadingSignup;
  const error = errorColonies ?? errorSignup;

  useEffect(() => {
    if (yaPertenecAColonia) return;
    void listColonies();
  }, [listColonies, yaPertenecAColonia]);

  const coloniasFiltradas = useMemo(() => {
    const termino = normalizeText(busqueda.trim());
    if (!termino) return colonies;
    return colonies.filter((colonia) => {
      const etiqueta = colonia.departamento
        ? `${colonia.pais} ${colonia.departamento} ${colonia.ciudad}`
        : colonia.pais;
      return normalizeText(etiqueta).includes(termino);
    });
  }, [busqueda, colonies]);

  const sinColoniasDisponibles = !loading && !error && colonies.length === 0;

  const seleccionarColonia = (colonia: ColonyData) => {
    setSeleccionada(colonia);
    setBusqueda(
      colonia.departamento
        ? `${colonia.pais} - ${colonia.departamento} - ${colonia.ciudad}`
        : colonia.pais,
    );
  };

  const confirmarInscripcion = async () => {
    if (!seleccionada || user?.id === undefined || user?.id === null) return;

    const ok = await signupColony(user.id, seleccionada.codigo);

    if (ok) {
      showToast("¡Solicitud enviada! Espera a que el líder de la colonia la apruebe.", "success");
      setMostrarConfirmacion(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full items-center justify-center px-4 bg-bg">
      <div className="rounded-lg shadow-xl w-full max-w-lg p-8 bg-bg">
        <h1 className="page-title">Inscribirse a una colonia</h1>
        <h2 className="section-title">
          Selecciona la colonia a la que deseas unirte
        </h2>

        <div className="mt-10">
          {esAdmin ? (
            <div className="rounded-lg border border-bg-border bg-bg-card px-4 py-5">
              <p className="text-sm text-text-muted">
                El usuario administrador no puede inscribirse a una colonia.
              </p>
            </div>
          ) : yaPertenecAColonia ? (
            <div className="rounded-lg border border-bg-border bg-bg-card px-4 py-5">
              <p className="text-sm text-text-muted">
                Ya perteneces a una colonia. No puedes inscribirte a otra.
              </p>
            </div>
          ) : (
            <>
              <Autocomplete
                label="Buscar colonia"
                placeholder="Buscar colonia..."
                onSearch={(q) => {
                  setBusqueda(q);
                  const labelSeleccionada = seleccionada
                    ? (seleccionada.departamento
                      ? `${seleccionada.pais} - ${seleccionada.departamento} - ${seleccionada.ciudad}`
                      : seleccionada.pais)
                    : "";
                  if (q !== labelSeleccionada) {
                    setSeleccionada(null);
                  }
                }}
                results={coloniasFiltradas}
                loading={loadingColonies}
                minLength={0}
                onSelect={seleccionarColonia}
                value={busqueda}
                getDisplayValue={(c) =>
                  c.departamento
                    ? `${c.pais} - ${c.departamento} - ${c.ciudad}`
                    : c.pais
                }
                renderItem={(c) => (
                  <div className="px-4 py-3 text-sm text-left">
                    {c.departamento
                      ? `${c.pais} - ${c.departamento} - ${c.ciudad}`
                      : c.pais}
                  </div>
                )}
              />

              {error && <p className="mt-3 text-sm text-danger">{error}</p>}

              {sinColoniasDisponibles && (
                <div className="mt-4 rounded-lg border border-bg-border bg-bg px-4 py-3">
                  <p className="text-sm text-text-muted">
                    Actualmente no hay colonias disponibles. Intenta de nuevo
                    más tarde.
                  </p>
                </div>
              )}

              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => seleccionada && setMostrarConfirmacion(true)}
                  disabled={!seleccionada || loading}
                  className="w-full py-3 rounded-lg font-semibold transition-opacity disabled:opacity-50 bg-secondary text-text-inverse"
                >
                  {loading ? "Cargando..." : "Inscribir"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={mostrarConfirmacion}
        title="¿Confirmas la inscripción a la colonia?"
        details={
          seleccionada
            ? [
                seleccionada.pais.toLowerCase() === "colombia"
                  ? `${seleccionada.ciudad}, ${seleccionada.departamento}, ${seleccionada.pais}`
                  : seleccionada.pais,
              ]
            : []
        }
        onConfirm={confirmarInscripcion}
        onCancel={() => setMostrarConfirmacion(false)}
        loading={loadingSignup}
      />
    </div>
  );
}

export default function InscripcionColoniaForm() {
  return (
    <RequireAuth>
      <InscripcionColoniaFormFeature />
    </RequireAuth>
  );
}

