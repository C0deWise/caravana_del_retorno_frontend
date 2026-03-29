"use client";

import { useEffect, useMemo, useState } from "react";
import { useListColonia } from "../hooks/useListColonia";
import type { ColonyItem } from "@/types/colony.types";
import { ConfirmModal } from "@/components/confirmModal";
import { Search } from "lucide-react";

const normalizarTexto = (valor: string): string =>
  valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export default function InscripcionColoniaForm() {
  const { listColonia, loading, error } = useListColonia();
  const [colonias, setColonias] = useState<ColonyItem[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [seleccionada, setSeleccionada] = useState<ColonyItem | null>(null);
  const [mostrarLista, setMostrarLista] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [mostrarMensajeEspera, setMostrarMensajeEspera] = useState(false);

  useEffect(() => {
    const cargarColonias = async () => {
      const response = await listColonia();
      setColonias(response?.success ? (response.data ?? []) : []);
    };
    void cargarColonias();
  }, [listColonia]);

  const coloniasFiltradas = useMemo(() => {
    const termino = normalizarTexto(busqueda.trim());
    if (!termino) return colonias;
    return colonias.filter((colonia) => {
      const etiqueta = colonia.departamento
        ? `${colonia.pais} ${colonia.departamento} ${colonia.ciudad}`
        : colonia.pais;
      return normalizarTexto(etiqueta).includes(termino);
    });
  }, [busqueda, colonias]);

  const sinColoniasDisponibles = !loading && !error && colonias.length === 0;

  const seleccionarColonia = (colonia: ColonyItem) => {
    setSeleccionada(colonia);
    setBusqueda(
      colonia.departamento
        ? `${colonia.pais} - ${colonia.departamento} - ${colonia.ciudad}`
        : colonia.pais,
    );
    setMostrarLista(false);
  };

  const confirmarInscripcion = () => {
    setMostrarConfirmacion(false);
    setMostrarMensajeEspera(true);
  };

  return (
    <div
      className="flex flex-col min-h-screen w-full items-center px-4 py-6"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div
        className="rounded-lg shadow-xl w-full max-w-lg p-8"
        style={{ backgroundColor: "var(--color-bg)" }}
      >
        <h1 className="page-title">Registro de colonia</h1>

        <h2 className="section-title">
          Selecciona la colonia a la que deseas unirte
        </h2>

        <div className="mt-10">
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
                {loading && (
                  <li className="px-4 py-3 text-sm text-text-muted">
                    Cargando colonias...
                  </li>
                )}
                {!loading && coloniasFiltradas.length === 0 && (
                  <li className="px-4 py-3 text-sm text-text-muted">
                    No hay colonias disponibles para esta búsqueda.
                  </li>
                )}
                {!loading &&
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
                Actualmente no hay colonias disponibles. Intenta de nuevo más
                tarde.
              </p>
            </div>
          )}

          <div className="mt-4">
            <button
              type="button"
              onClick={() => seleccionada && setMostrarConfirmacion(true)}
              disabled={!seleccionada}
              className="w-full py-3 rounded-lg font-semibold transition-opacity disabled:opacity-50"
              style={{
                backgroundColor: "var(--color-secondary)",
                color: "var(--color-text-inverse)",
              }}
            >
              {loading ? "Inscribiendo..." : "Inscribir"}
            </button>
          </div>
        </div>
      </div>

      {/* Modal de confirmación de colonia */}
      <ConfirmModal
        isOpen={mostrarConfirmacion}
        title="¿Confirmas la creación de la colonia?"
        details={
          seleccionada
            ? [
                seleccionada.pais,
                seleccionada.departamento,
                seleccionada.ciudad,
              ].filter((v): v is string => v !== null)
            : []
        }
        onConfirm={confirmarInscripcion}
        onCancel={() => setMostrarConfirmacion(false)}
      />

      {/* Modal de mensaje de espera */}
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
