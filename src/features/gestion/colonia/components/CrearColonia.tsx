'use client'

import { useState } from 'react';
import { useCreateColonia } from '../hooks';
import type { ColoniaData } from '../types/colonia.types';

export default function CrearColonia() {
    const { createColonia, loading, error, success } = useCreateColonia();
    
    const [coloniaData, setColoniaData] = useState<ColoniaData>({
        co_pais: 'Colombia',
        co_departamento: '',
        co_ciudad: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setColoniaData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await createColonia(coloniaData);
    };

    return (
        <div className="flex flex-col min-h-screen justify-center items-center p-4" style={{ backgroundColor: 'var(--color-bg)' }}>
            <div className="rounded-lg shadow-xl w-full max-w-lg p-8" style={{ backgroundColor: 'var(--color-bg)' }}>
                <h1 className="page-title">
                    Registro de colonia
                </h1>
                
                <h2 className="section-title">
                    Seleccione la ubicacion de la colonia
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
                            Pais
                        </label>
                        <select
                            name="co_pais"
                            value={coloniaData.co_pais}
                            onChange={handleChange}
                            className="input-base"
                            required
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
                            name="co_departamento"
                            value={coloniaData.co_departamento}
                            onChange={handleChange}
                            placeholder="Ej: Cundinamarca"
                            className="input-base"
                            required
                        />
                    </div>

                    {/* Municipio */}
                    <div>
                        <label className="label-base">
                            Municipio
                        </label>
                        <input
                            type="text"
                            name="co_ciudad"
                            value={coloniaData.co_ciudad}
                            onChange={handleChange}
                            placeholder="Ej: Bogotá"
                            className="input-base"
                            required
                        />
                    </div>

                    {/* Botón Crear */}
                    <div className="mt-6">
                        <button
                            type="submit"
                            disabled={loading}
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
        </div>
    );
}
