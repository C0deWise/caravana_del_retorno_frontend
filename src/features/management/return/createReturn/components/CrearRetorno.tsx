"use client";

import { useState } from "react";
import { useCreateRetorno } from "../hooks/useCreateRetorno";
import { RequireAuth } from "@/auth/components/RequireAuth";
import { ConfirmModal } from "@/components/confirmModal";

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 11 }, (_, i) => CURRENT_YEAR - 5 + i);

function CrearRetornoFeature() {
  const { createRetorno, loading, error, success, resetState } =
    useCreateRetorno();

  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    resetState();
    const value = e.target.value;
    setSelectedYear(value ? parseInt(value) : null);
  };

  const handleCreateClick = () => {
    if (!selectedYear || loading) return;
    resetState();
    setShowModal(true);
  };

  const handleConfirm = async () => {
    if (!selectedYear) return;

    const response = await createRetorno({
      anio: selectedYear,
      estado: "activo",
    });

    if (response) {
      setShowModal(false);
      setSelectedYear(null);
    }
  };

  const handleCancel = () => {
    if (loading) return;
    setShowModal(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-(--color-bg)">
      <div className="flex flex-1 items-start justify-center p-4 pt-16">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
          <h1 className="page-title mb-4">
            Creación de un retorno
          </h1>

          <h2 className="mb-6 section-title">
            Seleccione el año del retorno
          </h2>

          {error && (
            <div className="alert-error mb-4">
              <p className="alert-error-text">{error}</p>
            </div>
          )}

          {success && (
            <div className="alert-success mb-4">
              <p className="alert-success-text">Retorno creado exitosamente</p>
            </div>
          )}

          <div className="mb-6">
            <select
              value={selectedYear ?? ""}
              onChange={handleYearChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-center text-lg focus:border-blue-500 focus:outline-none"
            >
              <option value="" disabled>
                -- Seleccionar año --
              </option>
              {YEARS.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={handleCreateClick}
              disabled={!selectedYear || loading}
              className="btn-primary w-full py-3 font-semibold transition-opacity disabled:opacity-50"
            >
              {loading ? "Creando..." : "Crear"}
            </button>
          </div>
        </div>
      </div>

      {showModal && selectedYear && (
        <ConfirmModal
          isOpen={showModal}
          title="¿Confirmas la creación del retorno?"
          details={[`Año: ${selectedYear}`]}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          loading={loading}
          confirmLabel="Confirmar"
          cancelLabel="Cancelar"
        />
      )}
    </div>
  );
}

export default function CrearRetorno() {
  return (
    <RequireAuth roles={["admin"]}>
      <CrearRetornoFeature />
    </RequireAuth>
  );
}
