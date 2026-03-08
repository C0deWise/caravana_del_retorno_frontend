'use client'

import { useState, useEffect } from 'react';

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

export default function LocationModal({ isOpen, onClose, onSave, initialData }: LocationModalProps) {
    const [locationData, setLocationData] = useState<LocationData>({
        pais: 'Colombia',
        departamento: '',
        municipio: '',
    });

    // Restablecer datos cuando se abre el modal
    useEffect(() => {
        if (isOpen && initialData) {
            // En este caso es válido actualizar el estado local con los datos iniciales
            // cuando el modal se abre para mostrar los valores actuales
            setLocationData(initialData);
        }
    }, [isOpen, initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setLocationData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        onSave(locationData);
        onClose();
    };

    if (!isOpen) return null;

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
                        <select
                            name="pais"
                            value={locationData.pais}
                            onChange={handleChange}
                            className="input-base"
                        >
                            <option value="Colombia">Colombia</option>
                            <option value="Venezuela">Venezuela</option>
                            <option value="Ecuador">Ecuador</option>
                            <option value="Perú">Perú</option>
                            <option value="México">México</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </div>

                    {/* Departamento */}
                    <div>
                        <label className="label-base">
                            Departamento
                        </label>
                        <input
                            type="text"
                            name="departamento"
                            value={locationData.departamento}
                            onChange={handleChange}
                            placeholder="Ej: Cundinamarca"
                            className="input-base"
                        />
                    </div>

                    {/* Municipio */}
                    <div>
                        <label className="label-base">
                            Municipio
                        </label>
                        <input
                            type="text"
                            name="municipio"
                            value={locationData.municipio}
                            onChange={handleChange}
                            placeholder="Ej: Bogotá"
                            className="input-base"
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
