"use client";

import { useState, useMemo, forwardRef, useImperativeHandle } from "react";
import Select from "react-select";
import { useCreateColony } from "../hooks/useCreateColony";
import type { ColonyData } from "@/types/colony.types";
import {
  getDepartments,
  getCitiesByDepartmentName,
} from "@/constants/countries";
import type { City } from "@/constants/countries";
import CountrySelect from "@/components/forms/CountrySelect";
import { ConfirmModal } from "@/components/feedback/confirmModal";
import { selectStyles } from "@/utils/styles";
import { ExpandableContent } from "@/components/layout/ExpandableContent";

type SelectOption = {
  value: string;
  label: string;
};

interface CreateColonyModalFormProps {
  readonly onSuccess?: () => void;
  readonly onCancel?: () => void;
}

export const CreateColonyModalForm = forwardRef<
  { reset: () => void },
  CreateColonyModalFormProps
>(function CreateColonyModalForm({ onSuccess, onCancel }, ref) {
  const { createColony, resetError, loading, error } = useCreateColony();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const [coloniaData, setColoniaData] = useState<ColonyData>({
    codigo: 0,
    pais: "Colombia",
    departamento: null,
    ciudad: null,
    lider: 0,
  });

  useImperativeHandle(ref, () => ({
    reset: () => {
      setColoniaData({
        codigo: 0,
        pais: "Colombia",
        departamento: null,
        ciudad: null,
        lider: 0,
      });
      setCities([]);
      resetError();
    },
  }));

  const departments = useMemo(() => {
    if (coloniaData.pais === "Colombia") {
      return getDepartments();
    }
    return [];
  }, [coloniaData.pais]);

  const departmentOptions = useMemo(
    () => departments.map((dept) => ({ value: dept.name, label: dept.name })),
    [departments],
  );

  const cityOptions = useMemo(
    () => cities.map((city) => ({ value: city.name, label: city.name })),
    [cities],
  );

  const handlePaisChange = (pais: string) => {
    resetError();
    setColoniaData({
      codigo: 0,
      pais: pais,
      departamento: null,
      ciudad: null,
      lider: 0,
    });
    setCities([]);
  };

  const handleDepartamentoChange = (option: SelectOption | null) => {
    resetError();
    const departamento = option?.value || null;
    setColoniaData((prev) => ({
      ...prev,
      departamento: departamento,
      ciudad: null,
    }));

    if (departamento) {
      const ciudades = getCitiesByDepartmentName(departamento);
      setCities(ciudades);
    } else {
      setCities([]);
    }
  };

  const handleMunicipioChange = (option: SelectOption | null) => {
    resetError();
    const municipio = option?.value || null;
    setColoniaData((prev) => ({ ...prev, ciudad: municipio }));
  };

  const handleOpenConfirm = () => {
    if (!coloniaData.pais) return;
    if (coloniaData.pais === "Colombia") {
      if (!coloniaData.departamento || !coloniaData.ciudad) return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirm = async () => {
    const response = await createColony(coloniaData);
    if (response) {
      setColoniaData({
        codigo: 0,
        pais: "Colombia",
        departamento: null,
        ciudad: null,
        lider: 0,
      });
      setCities([]);

      onSuccess?.();
    }
    setShowConfirmModal(false);
  };

  const handleCancel = () => {
    onCancel?.();
  };

  return (
    <div className="p-6 bg-bg">
      <h2
        className="text-xl font-bold text-primary mb-1 outline-none"
        tabIndex={-1}
        autoFocus
      >
        Crear Colonia
      </h2>
      <p className="text-sm text-text-muted mb-6">
        Seleccione la ubicación de la nueva colonia.
      </p>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-accent-red/10 border border-accent-red/20 text-accent-red text-sm">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* País */}
        <CountrySelect
          value={coloniaData.pais}
          onChange={handlePaisChange}
          instanceId="create-colony-country-select-modal"
          inputId="create-colony-country-select-input-modal"
          styles={selectStyles}
          openMenuOnFocus={false}
        />

        {/* Departamento - Solo para Colombia */}
        <ExpandableContent
          isOpen={coloniaData.pais === "Colombia"}
          onAnimatingChange={setIsAnimating}
        >
          <div>
            <label
              className="label-base"
              htmlFor="create-colony-department-select-input-modal"
            >
              Departamento
            </label>
            <Select
              instanceId="create-colony-department-select-modal"
              inputId="create-colony-department-select-input-modal"
              options={departmentOptions}
              value={
                departmentOptions.find(
                  (opt) => opt.value === coloniaData.departamento,
                ) || null
              }
              onChange={handleDepartamentoChange}
              placeholder="Seleccione un departamento"
              isSearchable
              isClearable
              isDisabled={isAnimating}
              openMenuOnFocus={false}
              styles={selectStyles}
              noOptionsMessage={() => "No se encontraron departamentos"}
            />
          </div>
        </ExpandableContent>

        {/* Municipio */}
        <ExpandableContent
          isOpen={!!coloniaData.departamento}
          onAnimatingChange={setIsAnimating}
          className="space-y-6"
        >
          <div>
            <label
              className="label-base"
              htmlFor="create-colony-city-select-input-modal"
            >
              Municipio
            </label>
            <Select
              instanceId="create-colony-city-select-modal"
              inputId="create-colony-city-select-input-modal"
              options={cityOptions}
              value={
                cityOptions.find((opt) => opt.value === coloniaData.ciudad) ||
                null
              }
              onChange={handleMunicipioChange}
              placeholder="Seleccione un municipio"
              isSearchable
              isClearable
              isDisabled={isAnimating || cities.length === 0}
              openMenuOnFocus={false}
              styles={selectStyles}
              noOptionsMessage={() => "No se encontraron municipios"}
            />
          </div>
        </ExpandableContent>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={handleOpenConfirm}
            disabled={
              loading ||
              !coloniaData.pais ||
              (coloniaData.pais === "Colombia" &&
                (!coloniaData.departamento || !coloniaData.ciudad))
            }
            className="flex-1 py-3.5 rounded-xl font-bold bg-secondary text-text-inverse hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            {loading ? "Creando..." : "Crear Colonia"}
          </button>

          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 py-3.5 rounded-xl font-bold border border-bg-border text-text hover:bg-bg-card transition-all"
          >
            Cancelar
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirmModal}
        title="Crear Colonia"
        details={[
          <span key="msg">
            ¿Estás seguro de crear la colonia{" "}
            <strong>
              {coloniaData.pais === "Colombia"
                ? `${coloniaData.ciudad}, ${coloniaData.departamento}, ${coloniaData.pais}`
                : coloniaData.pais}
            </strong>{" "}
            ?
          </span>,
        ]}
        onConfirm={handleConfirm}
        onCancel={() => setShowConfirmModal(false)}
        loading={loading}
      />
    </div>
  );
});

