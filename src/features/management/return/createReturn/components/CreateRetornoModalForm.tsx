"use client";

import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { useCreateRetorno } from "../hooks/useCreateRetorno";
import { ConfirmModal } from "@/components/feedback/confirmModal";
import { useToast } from "@/components/feedback/Toast";
import { SelectField } from "@/components/forms/SelectField";

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 11 }, (_, i) => CURRENT_YEAR + i);

interface CreateRetornoModalFormProps {
  readonly onSuccess?: () => void;
  readonly onCancel?: () => void;
}

export const CreateRetornoModalForm = forwardRef<
  { reset: () => void },
  CreateRetornoModalFormProps
>(function CreateRetornoModalForm({ onSuccess, onCancel }, ref) {
  const { createRetorno, loading, error, resetState } = useCreateRetorno();
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (error) {
      showToast(error, "error");
      onCancel?.();
    }
  }, [error, showToast, onCancel]);

  useImperativeHandle(ref, () => ({
    reset: () => {
      setSelectedYear(null);
      resetState();
    },
  }));

  const handleYearChange = (option: { value: string; label: string } | null) => {
    resetState();
    setSelectedYear(option ? Number.parseInt(option.value) : null);
  };

  const yearOptions = YEARS.map((year) => ({
    value: year.toString(),
    label: year.toString(),
  }));

  const handleOpenConfirm = () => {
    if (!selectedYear) return;
    setShowConfirmModal(true);
  };

  const handleConfirm = async () => {
    if (!selectedYear) return;

    const response = await createRetorno({
      anio: selectedYear,
      estado: "activo",
    });

    setShowConfirmModal(false);

    if (response) {
      setSelectedYear(null);
      showToast(`¡Retorno ${selectedYear} creado con éxito!`, "success");
      onSuccess?.();
    }
  };

  return (
    <div className="p-6 bg-bg">
      <h2
        className="text-xl font-bold text-primary mb-1 outline-none"
        tabIndex={-1}
        autoFocus
      >
        Crear Retorno
      </h2>
      <p className="text-sm text-text-muted mb-6">
        Seleccione el año para el nuevo retorno.
      </p>

      <div className="space-y-6">
        <SelectField
          label="Año del Retorno"
          instanceId="create-retorno-year-select"
          inputId="create-retorno-year-select-input"
          options={yearOptions}
          value={yearOptions.find((opt) => opt.value === selectedYear?.toString()) || null}
          onChange={handleYearChange}
          placeholder="-- Seleccionar año --"
          isSearchable={false}
          isClearable
          openMenuOnFocus={false}
        />

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={handleOpenConfirm}
            disabled={!selectedYear || loading}
            className="flex-1 py-3.5 rounded-xl font-bold bg-secondary text-text-inverse hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            {loading ? "Creando..." : "Crear Retorno"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3.5 rounded-xl font-bold border border-bg-border text-text hover:bg-bg-card transition-all"
          >
            Cancelar
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirmModal}
        title="Crear Retorno"
        details={[`¿Estás seguro de crear el retorno para el año ${selectedYear}?`]}
        onConfirm={handleConfirm}
        onCancel={() => setShowConfirmModal(false)}
        loading={loading}
      />
    </div>
  );
});
