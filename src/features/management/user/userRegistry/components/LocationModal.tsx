"use client";

import { useState, useMemo } from "react";
import {
  getDepartments,
  getCitiesByDepartmentName,
} from "@/constants/countries";
import type { City } from "@/constants/countries";
import { useEffect } from "react";
import CountrySelect from "@/components/forms/CountrySelect";
import { SelectField } from "@/components/forms/SelectField";
import { FrostedModal } from "@/components/feedback/FrostedModal";
import { motion, AnimatePresence } from "framer-motion";
import { MarqueeText } from "@/components/common/MarqueeText";

interface LocationModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSave: (location: LocationData) => void;
  readonly initialData?: LocationData;
}

export interface LocationData {
  pais: string;
  departamento: string;
  municipio: string;
}

type SelectOption = {
  value: string;
  label: string;
};

const EMPTY_LOCATION_DATA: LocationData = {
  pais: "",
  departamento: "",
  municipio: "",
};

export default function LocationModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: LocationModalProps) {
  const [locationData, setLocationData] = useState<LocationData>(
    () => initialData ?? EMPTY_LOCATION_DATA,
  );
  const [cities, setCities] = useState<City[]>(() => {
    if (initialData?.departamento) {
      return getCitiesByDepartmentName(initialData.departamento);
    }
    return [];
  });

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setLocationData(initialData ?? EMPTY_LOCATION_DATA);
        if (initialData?.departamento) {
          setCities(getCitiesByDepartmentName(initialData.departamento));
        } else {
          setCities([]);
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initialData]);

  const departments = useMemo(() => {
    if (locationData.pais === "Colombia") {
      return getDepartments();
    }
    return [];
  }, [locationData.pais]);

  const departmentOptions = useMemo(
    () => departments.map((dept) => ({ value: dept.name, label: dept.name })),
    [departments],
  );

  const cityOptions = useMemo(
    () => cities.map((city) => ({ value: city.name, label: city.name })),
    [cities],
  );

  const handlePaisChange = (pais: string) => {
    setLocationData({ pais, departamento: "", municipio: "" });
    if (pais !== "Colombia") setCities([]);
  };

  const handleDepartamentoChange = (option: SelectOption | null) => {
    const departamento = option?.value || "";
    setLocationData((prev) => ({ ...prev, departamento, municipio: "" }));
    if (departamento) {
      setCities(getCitiesByDepartmentName(departamento));
    } else {
      setCities([]);
    }
  };

  const handleMunicipioChange = (option: SelectOption | null) => {
    const municipio = option?.value || "";
    setLocationData((prev) => ({ ...prev, municipio }));
  };

  const handleSave = () => {
    onSave(locationData);
    onClose();
  };

  return (
    <FrostedModal
      isOpen={isOpen}
      onClose={onClose}
      title="Seleccione su lugar de residencia"
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
          {/* País */}
          <CountrySelect
            value={locationData.pais}
            onChange={handlePaisChange}
            instanceId="location-modal-country-select"
            inputId="location-modal-country-select-input"
          />

          {/* Campos adicionales para Colombia */}
          <AnimatePresence>
            {locationData.pais === "Colombia" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="space-y-4 pt-4">
                  {/* Departamento */}
                  <SelectField
                    label="Departamento"
                    instanceId="create-colony-department-select"
                    inputId="create-colony-department-select-input"
                    options={departmentOptions}
                    value={
                      departmentOptions.find(
                        (opt) => opt.value === locationData.departamento,
                      ) || null
                    }
                    onChange={handleDepartamentoChange}
                    placeholder="Elegir departamento"
                    isSearchable
                    isClearable
                    openMenuOnFocus
                    noOptionsMessage={() => "No se encontraron departamentos"}
                    formatOptionLabel={(option, { context }) => (
                      context === 'value' ? (
                        <div className="w-full overflow-hidden">
                          <MarqueeText text={option.label} speed={20} className="w-full text-left" />
                        </div>
                      ) : (
                        <span>{option.label}</span>
                      )
                    )}
                  />

                  {/* Municipio */}
                  <SelectField
                    label="Municipio"
                    instanceId="create-colony-city-select"
                    inputId="create-colony-city-select-input"
                    options={cityOptions}
                    value={
                      cityOptions.find(
                        (opt) => opt.value === locationData.municipio,
                      ) || null
                    }
                    onChange={handleMunicipioChange}
                    placeholder={
                      locationData.departamento
                        ? "Elegir municipio"
                        : "Primero elija departamento"
                    }
                    isSearchable
                    isClearable
                    openMenuOnFocus
                    isDisabled={!locationData.departamento || cities.length === 0}
                    noOptionsMessage={() => "No se encontraron municipios"}
                    formatOptionLabel={(option, { context }) => (
                      context === 'value' ? (
                        <div className="w-full overflow-hidden">
                          <MarqueeText text={option.label} speed={20} className="w-full text-left" />
                        </div>
                      ) : (
                        <span>{option.label}</span>
                      )
                    )}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Botones */}
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={!locationData.pais || (locationData.pais === "Colombia" && (!locationData.departamento || !locationData.municipio))}
            className="w-full py-3 px-4 rounded-xl bg-secondary text-white font-semibold hover:bg-secondary/90 hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:shadow-none disabled:hover:translate-y-0 disabled:cursor-not-allowed"
          >
            Guardar
          </button>
        </div>
    </FrostedModal>
  );
}
