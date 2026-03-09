'use client'

import { useState, useEffect, useMemo } from 'react';
import Select from 'react-select';
import { getDepartments, getCitiesByDepartmentName, getAllCountries } from '@/shared/constants/countries';
import type { City, Country } from '@/shared/constants/countries';

interface LocationModalProps {
    isOpen: boolean;
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

export default function LocationModal({ isOpen, onClose, onSave, initialData }: LocationModalProps) {

    // Estados
    const countries = useState<Country[]>(() => getAllCountries())[0];
    const [cities, setCities] = useState<City[]>([]);
    const [locationData, setLocationData] = useState<LocationData>({
        pais: '',
        departamento: '',
        municipio: '',
    });

    // Cargar departamentos solo si el país es Colombia
    // Nota: useMemo evita re-renders innecesarios y responde a cambios en la selección del país
    const departments = useMemo(() => {
        if (locationData.pais === 'Colombia') {
            return getDepartments();
        }
        return [];
    }, [locationData.pais]);

    // Restablecer datos cuando se abre el modal
    // Nota: setState en useEffect es necesario aquí para sincronizar el estado del modal
    // con las props (isOpen, initialData) que vienen del componente padre
    useEffect(() => {
        if (isOpen) {
            // Si hay datos iniciales, cargarlos y obtener ciudades
            if (initialData) {
                setLocationData(initialData);
                
                if (initialData.departamento) {
                    const cities = getCitiesByDepartmentName(initialData.departamento);
                    setCities(cities);
                }
            } else {
                // Resetear el estado si no hay datos iniciales
                setLocationData({
                    pais: '',
                    departamento: '',
                    municipio: '',
                });
                setCities([]);
            }
        }
    }, [isOpen, initialData]);

    // Convertir datos a formato de react-select
    const countryOptions = useMemo(() => 
        countries.map(country => ({ value: country.name, label: country.name })),
        [countries]
    );

    const departmentOptions = useMemo(() => 
        departments.map(dept => ({ value: dept.name, label: dept.name })),
        [departments]
    );

    const cityOptions = useMemo(() => 
        cities.map(city => ({ value: city.name, label: city.name })),
        [cities]
    );

    const handlePaisChange = (option: SelectOption | null) => {
        const pais = option?.value || '';
        
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

    if (!isOpen) return null;

    // Estilos personalizados para react-select
    const customStyles = {
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
                    <div>
                        <label className="label-base">
                            País
                        </label>
                        <Select
                            options={countryOptions}
                            value={countryOptions.find(opt => opt.value === locationData.pais)}
                            onChange={handlePaisChange}
                            placeholder="Seleccione un país"
                            isSearchable={true}
                            isClearable={true}
                            openMenuOnFocus={true}
                            styles={customStyles}
                            noOptionsMessage={() => 'No se encontraron países'}
                        />
                    </div>

                    {/* Departamento */}
                    <div>
                        <label className="label-base">
                            Departamento
                        </label>
                        <Select
                            options={departmentOptions}
                            value={departmentOptions.find(opt => opt.value === locationData.departamento) || null}
                            onChange={handleDepartamentoChange}
                            placeholder="Seleccione un departamento"
                            isSearchable={true}
                            isClearable={true}
                            openMenuOnFocus={true}
                            isDisabled={locationData.pais !== 'Colombia'}
                            styles={customStyles}
                            noOptionsMessage={() => 'No se encontraron departamentos'}
                        />
                    </div>

                    {/* Municipio */}
                    <div>
                        <label className="label-base">
                            Municipio
                        </label>
                        <Select
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
