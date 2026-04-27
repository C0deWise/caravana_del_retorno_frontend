"use client";

import { useState, useMemo } from "react";
import Select, { type StylesConfig } from "react-select";
import { useCreateColonia } from "../hooks/useCreateColony";
import type { ColonyData } from "@/types/colony.types";
import {
  getDepartments,
  getCitiesByDepartmentName,
} from "@/constants/countries";
import type { City } from "@/constants/countries";
import CountrySelect from "@/components/CountrySelect";
import { ConfirmModal } from "@/components/confirmModal";

type SelectOption = {
  value: string;
  label: string;
};

interface CreateColonyModalFormProps {
  readonly onSuccess?: () => void;
  readonly onCancel?: () => void;
}

export function CreateColonyModalForm({
  onSuccess,
  onCancel,
}: CreateColonyModalFormProps) {
  const { createColonia, resetError, loading, error } = useCreateColonia();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [cities, setCities] = useState<City[]>([]);

  const [coloniaData, setColoniaData] = useState<ColonyData>({
    codigo: 0,
    pais: "Colombia",
    departamento: null,
    ciudad: null,
    lider: 0,
  });

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
    const response = await createColonia(coloniaData);
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

  const customStyles: StylesConfig<SelectOption, false> = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "var(--color-bg-card)",
      borderColor: state.isFocused ? "var(--color-primary)" : "transparent",
      borderRadius: "0.75rem", // rounded-xl
      padding: "0.2rem",
      fontSize: "0.875rem",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(2, 64, 89, 0.1)" : "none",
      transition: "all 0.2s ease",
      ":hover": {
        borderColor: state.isFocused ? "var(--color-primary)" : "var(--color-bg-border)",
      }
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "var(--color-bg)",
      borderRadius: "0.75rem",
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      padding: "0.25rem",
      border: "1px solid var(--color-bg-border)",
      overflow: "hidden",
      zIndex: 9999,
      marginTop: "0.5rem",
      animation: "fade-in 0.2s ease-out, zoom-in 0.2s ease-out",
    }),
    option: (base, state) => {
      let backgroundColor = "transparent";
      if (state.isSelected) {
        backgroundColor = "var(--color-primary)";
      } else if (state.isFocused) {
        backgroundColor = "rgba(2, 64, 89, 0.08)";
      }

      return {
        ...base,
        backgroundColor,
        color: state.isSelected ? "var(--color-text-inverse)" : "var(--color-text)",
        padding: "0.625rem 1rem",
        borderRadius: "0.5rem",
        cursor: "pointer",
        fontSize: "0.875rem",
        fontWeight: state.isSelected ? "600" : "400",
        ":active": {
          backgroundColor: "rgba(2, 64, 89, 0.15)",
        },
        borderBottom: "1px solid var(--color-bg-separator)",
        ":last-child": {
          borderBottom: "none",
        }
      };
    },
    placeholder: (base) => ({
      ...base,
      color: "var(--color-text-muted)",
      fontSize: "0.875rem",
    }),
    singleValue: (base) => ({
      ...base,
      color: "var(--color-text)",
      fontSize: "0.875rem",
    }),
    input: (base) => ({
      ...base,
      color: "var(--color-text)",
    })
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
          styles={customStyles}
          openMenuOnFocus={false}
        />

        {/* Departamento - Solo para Colombia */}
        {coloniaData.pais === "Colombia" && (
          <>
            <div>
              <label className="label-base" htmlFor="create-colony-department-select-input-modal">
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
                openMenuOnFocus={false}
                styles={customStyles}
                noOptionsMessage={() => "No se encontraron departamentos"}
              />
            </div>

            {coloniaData.departamento && (
              <div>
                <label className="label-base" htmlFor="create-colony-city-select-input-modal">
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
                  openMenuOnFocus={false}
                  isDisabled={cities.length === 0}
                  styles={customStyles}
                  noOptionsMessage={() => "No se encontraron municipios"}
                />
              </div>
            )}
          </>
        )}

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
            onClick={onCancel}
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
            </strong>?
          </span>,
        ]}
        onConfirm={handleConfirm}
        onCancel={() => setShowConfirmModal(false)}
        loading={loading}
      />
    </div>
  );
}
