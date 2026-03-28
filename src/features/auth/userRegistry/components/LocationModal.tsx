'use client'

import { useState, useMemo } from 'react';
import Select, { type StylesConfig } from 'react-select';
import { getDepartments, getCitiesByDepartmentName } from '@/shared/constants/countries';
import type { City } from '@/shared/constants/countries';
import CountrySelect from '@/shared/components/CountrySelect';

interface LocationModalProps {
    onClose: () => void;
    onSave: (location: LocationData) => void;
    initialData?: LocationData;
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
    pais: '',
    departamento: '',
    municipio: '',
};

export default function LocationModal({ onClose, onSave, initialData }: LocationModalProps) {

    // Estados
    const [locationData, setLocationData] = useState<LocationData>(() => initialData ?? EMPTY_LOCATION_DATA);
    const [cities, setCities] = useState<City[]>(() => {
        if (initialData?.departamento) {
            return getCitiesByDepartmentName(initialData.departamento);
        }
        return [];
    });

    // Cargar departamentos solo si el país es Colombia
    // Nota: useMemo evita re-renders innecesarios y responde a cambios en la selección del país
    const departments = useMemo(() => {
        if (locationData.pais === 'Colombia') {
            return getDepartments();
        }
        return [];
    }, [locationData.pais]);

    const departmentOptions = useMemo(() =>
        departments.map(dept => ({ value: dept.name, label: dept.name })),
        [departments]
    );

    const cityOptions = useMemo(() =>
        cities.map(city => ({ value: city.name, label: city.name })),
        [cities]
    );

    const handlePaisChange = (pais: string) => {
        // Actualizar país y resetear departamento y municipio
        setLocationData({
            pais,
            departamento: '',
            municipio: '',
        });

        // Limpiar ciudades cuando cambia el país
        if (pais !== 'Colombia') {
            setCities([]);
        }
    };

    const handleDepartamentoChange = (option: SelectOption | null) => {
        const departamento = option?.value || '';

        // Actualizar departamento y resetear municipio
        setLocationData(prev => ({
            ...prev,
            departamento,
            municipio: '', // Resetear municipio cuando cambia el departamento
        }));

        // Cargar las ciudades del departamento seleccionado
        if (departamento) {
            const ciudades = getCitiesByDepartmentName(departamento);
            setCities(ciudades);
        } else {
            setCities([]);
        }
    };

    const handleMunicipioChange = (option: SelectOption | null) => {
        const municipio = option?.value || '';
        setLocationData(prev => ({ ...prev, municipio }));
    };

    const handleSave = () => {
        onSave(locationData);
        onClose();
    };

    // Estilos personalizados para react-select
    const customStyles: StylesConfig<SelectOption, false> = {
        control: (base: Record<string, unknown>) => ({
            ...base,
            borderColor: '#d1d5db',
            borderRadius: '0.5rem',
            padding: '0.25rem',
            fontSize: '1rem',
            '&:hover': {
                borderColor: '#9ca3af',
            },
        }),
        menu: (base: Record<string, unknown>) => ({
            ...base,
            zIndex: 9999,
        }),
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 mx-4">
                <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-primary)' }}>
                    Seleccione su lugar de residencia
                </h2>

                <div className="space-y-4">
                    {/* País */}
                    <CountrySelect
                        value={locationData.pais}
                        onChange={handlePaisChange}
                        instanceId="location-modal-country-select"
                        inputId="location-modal-country-select-input"
                        styles={customStyles}
                    />

                    {/* Departamento - Solo para Colombia */}
                    {locationData.pais === 'Colombia' && (
                        <div>
                            <label className="label-base">
                                Departamento
                            </label>
                            <Select
                                instanceId="create-colony-department-select"
                                inputId="create-colony-department-select-input"
                                options={departmentOptions}
                                value={departmentOptions.find(opt => opt.value === locationData.departamento) || null}
                                onChange={handleDepartamentoChange}
                                placeholder="Seleccione un departamento"
                                isSearchable={true}
                                isClearable={true}
                                openMenuOnFocus={true}
                                styles={customStyles}
                                noOptionsMessage={() => 'No se encontraron departamentos'}
                            />
                        </div>
                    )}

                    {/* Municipio - Solo para Colombia */}
                    {locationData.pais === 'Colombia' && (
                        <div>
                            <label className="label-base">
                                Municipio
                            </label>
                            <Select
                                instanceId="create-colony-city-select"
                                inputId="create-colony-city-select-input"
                                options={cityOptions}
                                value={cityOptions.find(opt => opt.value === locationData.municipio) || null}
                                onChange={handleMunicipioChange}
                                placeholder={locationData.departamento ? 'Seleccione un municipio' : 'Seleccione primero un departamento'}
                                isSearchable={true}
                                isClearable={true}
                                openMenuOnFocus={true}
                                isDisabled={!locationData.departamento || cities.length === 0}
                                styles={customStyles}
                                noOptionsMessage={() => 'No se encontraron municipios'}
                            />
                        </div>
                    )}
                </div>


                {/* Botones */}
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 border rounded-lg transition-colors"
                        style={{
                            borderColor: 'var(--color-bg-border)',
                            color: 'var(--color-text)'
                        }}
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="btn-primary"
                        style={{ padding: '0.5rem 1.5rem' }}
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
}
