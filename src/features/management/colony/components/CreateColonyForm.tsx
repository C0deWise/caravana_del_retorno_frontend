'use client'

import { useState, useMemo } from 'react';
import Select from 'react-select';
import { useCreateColonia } from '../hooks/useCreateColonia';
import type { ColoniaData } from '../types/colonia.types';
import { getAllCountries, getDepartments, getCitiesByDepartmentName } from '@/shared/constants/countries';
import type { City } from '@/shared/constants/countries';

type SelectOption = {
    value: string;
    label: string;
};

export default function CrearColonia() {
    const { createColonia, loading, error, success } = useCreateColonia();
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [cities, setCities] = useState<City[]>([]);
    
    const [coloniaData, setColoniaData] = useState<ColoniaData>({
        pais: 'Colombia',
        departamento: '',
        ciudad: '',
    });

    // Obtener países y departamentos
    const countries = useMemo(() => getAllCountries(), []);
    const departments = useMemo(() => {
        if (coloniaData.pais === 'Colombia') {
            return getDepartments();
        }
        return [];
    }, [coloniaData.pais]);

    // Convertir a formato de react-select
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
        setColoniaData({
            pais: pais,
            departamento: '',
            ciudad: '',
        });
        setCities([]);
    };

    const handleDepartamentoChange = (option: SelectOption | null) => {
        const departamento = option?.value || '';
        setColoniaData(prev => ({
            ...prev,
            departamento: departamento,
            ciudad: '',
        }));

        if (departamento) {
            const ciudades = getCitiesByDepartmentName(departamento);
            setCities(ciudades);
        } else {
            setCities([]);
        }
    };

    const handleMunicipioChange = (option: SelectOption | null) => {
        const municipio = option?.value || '';
        setColoniaData(prev => ({ ...prev, ciudad: municipio }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validar campos según el país seleccionado
        if (!coloniaData.pais) {
            return; // El campo país es requerido siempre
        }
        
        // Si es Colombia, validar departamento y municipio
        if (coloniaData.pais === 'Colombia') {
            if (!coloniaData.departamento || !coloniaData.ciudad) {
                return; // Campos requeridos para Colombia
            }
        }
        
        setShowConfirmModal(true);
    };

    const handleConfirm = async () => {
        setShowConfirmModal(false);
        await createColonia(coloniaData);
    };

    const handleCancel = () => {
        setShowConfirmModal(false);
    };

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
        <div className="flex flex-col min-h-screen justify-center items-center p-4" style={{ backgroundColor: 'var(--color-bg)' }}>
            <div className="rounded-lg shadow-xl w-full max-w-lg p-8" style={{ backgroundColor: 'var(--color-bg)' }}>
                <h1 className="page-title">
                    Registro de colonia
                </h1>
                
                <h2 className="section-title">
                    {coloniaData.pais === 'Colombia' 
                        ? 'Seleccione la ubicación de la colonia'
                        : 'Seleccione el país de la colonia'}
                </h2>

                {/* Mensajes de estado */}
                {error && (
                    <div className="alert-error">
                        <p className="alert-error-text">{error}</p>
                    </div>
                )}
                
                {success && (
                    <div className="alert-success">
                        <p className="alert-success-text">Colonia creada exitosamente</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* País */}
                    <div>
                        <label className="label-base">
                            País
                        </label>
                        <Select
                            options={countryOptions}
                            value={countryOptions.find(opt => opt.value === coloniaData.pais)}
                            onChange={handlePaisChange}
                            placeholder="Seleccione un país"
                            isSearchable={true}
                            isClearable={true}
                            openMenuOnFocus={true}
                            styles={customStyles}
                            noOptionsMessage={() => 'No se encontraron países'}
                        />
                    </div>

                    {/* Departamento - Solo para Colombia */}
                    {coloniaData.pais === 'Colombia' && (
                        <div>
                            <label className="label-base">
                                Departamento
                            </label>
                            <Select
                                options={departmentOptions}
                                value={departmentOptions.find(opt => opt.value === coloniaData.departamento) || null}
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
                    {coloniaData.pais === 'Colombia' && (
                        <div>
                            <label className="label-base">
                                Municipio
                            </label>
                            <Select
                                options={cityOptions}
                                value={cityOptions.find(opt => opt.value === coloniaData.ciudad) || null}
                                onChange={handleMunicipioChange}
                                placeholder={coloniaData.departamento ? 'Seleccione un municipio' : 'Seleccione primero un departamento'}
                                isSearchable={true}
                                isClearable={true}
                                openMenuOnFocus={true}
                                isDisabled={!coloniaData.departamento || cities.length === 0}
                                styles={customStyles}
                                noOptionsMessage={() => 'No se encontraron municipios'}
                            />
                        </div>
                    )}

                    {/* Botón Crear */}
                    <div className="mt-6">
                        <button
                            type="submit"
                            disabled={
                                loading || 
                                !coloniaData.pais || 
                                (coloniaData.pais === 'Colombia' && (!coloniaData.departamento || !coloniaData.ciudad))
                            }
                            className="w-full py-3 rounded-lg font-semibold transition-opacity disabled:opacity-50"
                            style={{ 
                                backgroundColor: 'var(--color-secondary)',
                                color: 'var(--color-text-inverse)'
                            }}
                        >
                            {loading ? 'Creando...' : 'Crear'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Modal de Confirmación */}
            {showConfirmModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="rounded-lg shadow-2xl w-full max-w-md p-6 mx-4" style={{ backgroundColor: 'var(--color-bg)' }}>
                        <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--color-primary)' }}>
                            ¿Confirmas la creacion de la colonia?
                        </h2>

                        <ul className="mb-6 space-y-2" style={{ color: 'var(--color-text)' }}>
                            <li className="flex items-center">
                                <span className="mr-2">•</span>
                                <span><strong>País:</strong> {coloniaData.pais}</span>
                            </li>
                            {coloniaData.pais === 'Colombia' && (
                                <>
                                    <li className="flex items-center">
                                        <span className="mr-2">•</span>
                                        <span><strong>Departamento:</strong> {coloniaData.departamento}</span>
                                    </li>
                                    <li className="flex items-center">
                                        <span className="mr-2">•</span>
                                        <span><strong>Municipio:</strong> {coloniaData.ciudad}</span>
                                    </li>
                                </>
                            )}
                        </ul>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={handleConfirm}
                                disabled={loading}
                                className="flex-1 py-2 rounded-lg font-semibold transition-opacity disabled:opacity-50"
                                style={{ 
                                    backgroundColor: 'var(--color-accent-green)',
                                    color: 'var(--color-text-inverse)'
                                }}
                            >
                                {loading ? 'Confirmando...' : 'Confirmar'}
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={loading}
                                className="flex-1 py-2 rounded-lg font-semibold transition-opacity disabled:opacity-50"
                                style={{ 
                                    backgroundColor: 'var(--color-danger)',
                                    color: 'var(--color-text-inverse)'
                                }}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
