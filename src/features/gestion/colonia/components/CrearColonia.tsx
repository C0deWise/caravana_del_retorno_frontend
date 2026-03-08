'use client'

import { useState, useMemo } from 'react';
import { useCreateColonia } from '../hooks';
import type { ColoniaData } from '../types/colonia.types';

// Datos de departamentos y municipios de Colombia
const departamentos = [
    { nombre: 'Amazonas', municipios: ['Leticia', 'Puerto Nariño'] },
    { nombre: 'Antioquia', municipios: ['Medellín', 'Bello', 'Itagüí', 'Envigado', 'Rionegro', 'Apartadó'] },
    { nombre: 'Arauca', municipios: ['Arauca', 'Arauquita', 'Saravena', 'Tame'] },
    { nombre: 'Atlántico', municipios: ['Barranquilla', 'Soledad', 'Malambo', 'Sabanalarga'] },
    { nombre: 'Bolívar', municipios: ['Cartagena', 'Magangué', 'Turbaco', 'Arjona'] },
    { nombre: 'Boyacá', municipios: ['Tunja', 'Duitama', 'Sogamoso', 'Chiquinquirá', 'Paipa'] },
    { nombre: 'Caldas', municipios: ['Manizales', 'Villamaría', 'Chinchiná', 'La Dorada'] },
    { nombre: 'Caquetá', municipios: ['Florencia', 'San Vicente del Caguán', 'Puerto Rico'] },
    { nombre: 'Casanare', municipios: ['Yopal', 'Aguazul', 'Villanueva', 'Monterrey'] },
    { nombre: 'Cauca', municipios: ['Popayán', 'Santander de Quilichao', 'Puerto Tejada'] },
    { nombre: 'Cesar', municipios: ['Valledupar', 'Aguachica', 'Bosconia', 'Codazzi'] },
    { nombre: 'Chocó', municipios: ['Quibdó', 'Istmina', 'Condoto', 'Acandí'] },
    { nombre: 'Córdoba', municipios: ['Montería', 'Cereté', 'Lorica', 'Sahagún'] },
    { nombre: 'Cundinamarca', municipios: ['Bogotá', 'Soacha', 'Facatativá', 'Zipaquirá', 'Chía', 'Fusagasugá', 'Girardot'] },
    { nombre: 'Guainía', municipios: ['Inírida', 'Barranco Minas', 'Mapiripana'] },
    { nombre: 'Guaviare', municipios: ['San José del Guaviare', 'Calamar', 'El Retorno'] },
    { nombre: 'Huila', municipios: ['Neiva', 'Pitalito', 'Garzón', 'La Plata'] },
    { nombre: 'La Guajira', municipios: ['Riohacha', 'Maicao', 'Uribia', 'Manaure'] },
    { nombre: 'Magdalena', municipios: ['Santa Marta', 'Ciénaga', 'Fundación', 'Plato'] },
    { nombre: 'Meta', municipios: ['Villavicencio', 'Acacías', 'Granada', 'Puerto López'] },
    { nombre: 'Nariño', municipios: ['Pasto', 'Tumaco', 'Ipiales', 'Túquerres'] },
    { nombre: 'Norte de Santander', municipios: ['Cúcuta', 'Ocaña', 'Pamplona', 'Villa del Rosario'] },
    { nombre: 'Putumayo', municipios: ['Mocoa', 'Puerto Asís', 'Orito', 'Valle del Guamuez'] },
    { nombre: 'Quindío', municipios: ['Armenia', 'Calarcá', 'La Tebaida', 'Montenegro'] },
    { nombre: 'Risaralda', municipios: ['Pereira', 'Dosquebradas', 'Santa Rosa de Cabal', 'La Virginia'] },
    { nombre: 'San Andrés y Providencia', municipios: ['San Andrés', 'Providencia'] },
    { nombre: 'Santander', municipios: ['Bucaramanga', 'Floridablanca', 'Girón', 'Piedecuesta', 'Barrancabermeja'] },
    { nombre: 'Sucre', municipios: ['Sincelejo', 'Corozal', 'Sampués', 'San Marcos'] },
    { nombre: 'Tolima', municipios: ['Ibagué', 'Espinal', 'Melgar', 'Honda', 'Chaparral'] },
    { nombre: 'Valle del Cauca', municipios: ['Cali', 'Palmira', 'Buenaventura', 'Tuluá', 'Cartago', 'Buga'] },
    { nombre: 'Vaupés', municipios: ['Mitú', 'Caruru', 'Taraira'] },
    { nombre: 'Vichada', municipios: ['Puerto Carreño', 'La Primavera', 'Cumaribo'] },
];

export default function CrearColonia() {
    const { createColonia, loading, error, success } = useCreateColonia();
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    
    const [coloniaData, setColoniaData] = useState<ColoniaData>({
        co_pais: 'Colombia',
        co_departamento: '',
        co_ciudad: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        // Si cambia el departamento, resetear el municipio
        if (name === 'co_departamento') {
            setColoniaData(prev => ({ ...prev, [name]: value, co_ciudad: '' }));
        } else {
            setColoniaData(prev => ({ ...prev, [name]: value }));
        }
    };

    // Obtener lista de municipios según departamento seleccionado
    const municipiosDisponibles = useMemo(() => {
        if (coloniaData.co_pais !== 'Colombia') return [];
        const dept = departamentos.find(d => d.nombre === coloniaData.co_departamento);
        return dept ? dept.municipios : [];
    }, [coloniaData.co_departamento, coloniaData.co_pais]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowConfirmModal(true);
    };

    const handleConfirm = async () => {
        setShowConfirmModal(false);
        await createColonia(coloniaData);
    };

    const handleCancel = () => {
        setShowConfirmModal(false);
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
                            style={{ paddingRight: '2.5rem' }}
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
                        <select
                            name="co_departamento"
                            value={coloniaData.co_departamento}
                            onChange={handleChange}
                            className="input-base"
                            style={{ paddingRight: '2.5rem' }}
                            required
                            disabled={coloniaData.co_pais !== 'Colombia'}
                        >
                            <option value="">Seleccione un departamento</option>
                            {coloniaData.co_pais === 'Colombia' && departamentos.map(dept => (
                                <option key={dept.nombre} value={dept.nombre}>
                                    {dept.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Municipio */}
                    <div>
                        <label className="label-base">
                            Municipio
                        </label>
                        <select
                            name="co_ciudad"
                            value={coloniaData.co_ciudad}
                            onChange={handleChange}
                            className="input-base"
                            style={{ paddingRight: '2.5rem' }}
                            required
                            disabled={!coloniaData.co_departamento || coloniaData.co_pais !== 'Colombia'}
                        >
                            <option value="">Seleccione un municipio</option>
                            {municipiosDisponibles.map(municipio => (
                                <option key={municipio} value={municipio}>
                                    {municipio}
                                </option>
                            ))}
                        </select>
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
                                <span>{coloniaData.co_pais}</span>
                            </li>
                            <li className="flex items-center">
                                <span className="mr-2">•</span>
                                <span>{coloniaData.co_departamento}</span>
                            </li>
                            <li className="flex items-center">
                                <span className="mr-2">•</span>
                                <span>{coloniaData.co_ciudad}</span>
                            </li>
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
