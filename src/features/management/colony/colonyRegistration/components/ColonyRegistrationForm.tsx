"use client";

import { useEffect, useMemo, useState } from "react";
import { useListColonies } from "../../hooks/useListColonies";
import { useSignupColony } from "../hooks/useSignupColony";
import { useAuth } from "@/auth/context/AuthContext";
import type { ColonyData } from "@/types/colony.types";
import { ConfirmModal } from "@/components/feedback/confirmModal";
import { RequireAuth } from "@/auth/components/RequireAuth";
import { Search } from "lucide-react";
import { normalizeText } from "@/utils/formatting";

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

  const [busqueda, setBusqueda] = useState("");
  const [seleccionada, setSeleccionada] = useState<ColonyData | null>(null);
  const [mostrarLista, setMostrarLista] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [mostrarMensajeEspera, setMostrarMensajeEspera] = useState(false);

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
    setMostrarLista(false);
  };

  const confirmarInscripcion = async () => {
    if (!seleccionada || user?.id === undefined || user?.id === null) return;

    const ok = await signupColony(user.id, seleccionada.codigo);

    if (ok) {
      setMostrarMensajeEspera(true);
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full items-center px-4 py-6 bg-bg">
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
              <label className="label-base">Buscar colonia</label>
              <div className="relative">
                <Search
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"
                  size={20}
                />
                <input
                  id="buscar-colonia"
                  type="text"
                  value={busqueda}
                  onChange={(e) => {
                    setBusqueda(e.target.value);
                    setSeleccionada(null);
                    setMostrarLista(true);
                  }}
                  onFocus={() => setMostrarLista(true)}
                  placeholder="Buscar colonia"
                  className="w-full rounded-lg border border-bg-border bg-white px-4 py-3 text-lg text-text outline-none ring-primary transition focus:ring-2"
                />

                {mostrarLista && (
                  <ul className="absolute z-20 mt-2 max-h-56 w-full overflow-auto rounded-lg border border-bg-border bg-white shadow-md">
                    {loadingColonies && (
                      <li className="px-4 py-3 text-sm text-text-muted">
                        Cargando colonias...
                      </li>
                    )}
                    {!loadingColonies && coloniasFiltradas.length === 0 && (
                      <li className="px-4 py-3 text-sm text-text-muted">
                        No hay colonias disponibles para esta búsqueda.
                      </li>
                    )}
                    {!loadingColonies &&
                      coloniasFiltradas.map((colonia, index) => (
                        <li
                          key={
                            colonia.codigo ??
                            `${colonia.pais}-${colonia.departamento}-${colonia.ciudad}-${index}`
                          }
                        >
                          <button
                            type="button"
                            onClick={() => seleccionarColonia(colonia)}
                            className="w-full px-4 py-3 text-left text-base text-text hover:bg-bg-separator"
                          >
                            {colonia.departamento
                              ? `${colonia.pais} - ${colonia.departamento} - ${colonia.ciudad}`
                              : colonia.pais}
                          </button>
                        </li>
                      ))}
                  </ul>
                )}
              </div>

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

      <ConfirmModal
        isOpen={mostrarMensajeEspera}
        title="Solicitud enviada"
        details={[
          "Debes esperar a que el líder de colonia apruebe tu solicitud para unirte.",
        ]}
        onConfirm={() => setMostrarMensajeEspera(false)}
        onCancel={() => setMostrarMensajeEspera(false)}
        confirmLabel="Entendido"
        cancelLabel="Cerrar"
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

