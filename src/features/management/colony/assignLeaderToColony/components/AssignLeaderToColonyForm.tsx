'use client'

import { useState, useRef, useEffect, useId } from "react";
import { useAssignLeaderToColony } from "../hooks/UseAssignLeaderToColony";
import { UserData } from "../../../../../shared/types/user/user.types";
import { ConfirmModal } from "@/shared/components/confirmModal";

const USE_MOCK = true;
const NAME_ALLOWED_CHAR_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]$/;
const IDENTIFICATION_ALLOWED_CHAR_REGEX = /^[A-Za-z0-9]$/;

const MOCK_USERS: UserData[] = [
    {
        codigo: 'USR001',
        tipo_doc: 'CC',
        documento: '1010101010',
        celular: '3000000001',
        colonia: 'Colombia, Antioquia, Medellín',
        nombre: 'Ana',
        apellido: 'Pérez',
        genero: 'F',
        rol: 'participante',
        fecha_nacimiento: '1998-05-01',
        pais: 'Colombia',
        departamento: 'Antioquia',
        ciudad: 'Medellín',
        email: 'ana@example.com',
    },
    {
        codigo: 'USR002',
        tipo_doc: 'CC',
        documento: '2020202020',
        celular: '3000000002',
        colonia: 'Colombia, Cundinamarca, Bogotá',
        nombre: 'Carlos',
        apellido: 'Gómez',
        genero: 'M',
        rol: 'participante',
        fecha_nacimiento: '1995-09-12',
        pais: 'Colombia',
        departamento: 'Cundinamarca',
        ciudad: 'Bogotá',
        email: 'carlos@example.com',
    },
];

type SearchType = 'documento' | 'nombre';

export default function AssignLeaderToColonyForm() {
    const { assignLeader, loading, error, success } = useAssignLeaderToColony();
    const listboxId = useId();

    const [searchType, setSearchType] = useState<SearchType>('documento');
    const [inputValue, setInputValue] = useState('');
    const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Cierra el dropdown al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filterUsers = (term: string, type: SearchType): UserData[] => {
        if (!term.trim()) return [];
        const normalized = term.toLowerCase();

        if (USE_MOCK) {
            return MOCK_USERS.filter((u) =>
                type === 'documento'
                    ? u.documento.toLowerCase().includes(normalized)
                    : `${u.nombre} ${u.apellido}`.toLowerCase().includes(normalized)
            );
        }

        // Aquí se haría la llamada al backend real
        return [];
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const normalizedValue =
            searchType === 'nombre'
                ? value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]/g, '')
                : value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();

        setInputValue(normalizedValue);
        setSelectedUser(null);
        setHighlightedIndex(-1);

        const results = filterUsers(normalizedValue, searchType);
        setFilteredUsers(results);
        setIsDropdownOpen(results.length > 0 && normalizedValue.trim().length > 0);
    };

    const handleSearchTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const type = e.target.value as SearchType;
        setSearchType(type);
        setInputValue('');
        setSelectedUser(null);
        setFilteredUsers([]);
        setIsDropdownOpen(false);
        inputRef.current?.focus();
    };

    const handleSelectUser = (user: UserData) => {
        setSelectedUser(user);
        setInputValue(
            searchType === 'documento'
                ? user.documento
                : `${user.nombre} ${user.apellido}`
        );
        setIsDropdownOpen(false);
        setHighlightedIndex(-1);
    };

    // Navegación con teclado
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (
            searchType === 'nombre' &&
            e.key.length === 1 &&
            !NAME_ALLOWED_CHAR_REGEX.test(e.key)
        ) {
            e.preventDefault();
            return;
        }

        if (
            searchType === 'documento' &&
            e.key.length === 1 &&
            !IDENTIFICATION_ALLOWED_CHAR_REGEX.test(e.key)
        ) {
            e.preventDefault();
            return;
        }

        if (!isDropdownOpen) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHighlightedIndex((prev) => Math.min(prev + 1, filteredUsers.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlightedIndex((prev) => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter' && highlightedIndex >= 0) {
            e.preventDefault();
            handleSelectUser(filteredUsers[highlightedIndex]);
        } else if (e.key === 'Escape') {
            setIsDropdownOpen(false);
        }
    };

    const handleConfirm = async () => {
        if (!selectedUser) return;
        setShowConfirmModal(true);
    };

    const handleModalConfirm = async () => {
        if (!selectedUser) return;
        await assignLeader({ ...selectedUser, rol: '1' });
        setShowConfirmModal(false);
    };

    // Resalta el término buscado dentro del texto del resultado
    const highlight = (text: string, term: string) => {
        if (!term.trim()) return text;
        const idx = text.toLowerCase().indexOf(term.toLowerCase());
        if (idx === -1) return text;
        return (
            <>
                {text.slice(0, idx)}
                <mark
                    style={{
                        backgroundColor: 'var(--color-accent-yellow)',
                        color: 'var(--color-text)',
                        borderRadius: '2px',
                        padding: '0 1px',
                    }}
                >
                    {text.slice(idx, idx + term.length)}
                </mark>
                {text.slice(idx + term.length)}
            </>
        );
    };

    const placeholder =
        searchType === 'documento'
            ? 'Ej: 1234567890'
            : 'Ej: Ana Pérez';

    return (
        <div
            className="flex flex-col min-h-screen w-full items-center px-4 py-6"
            style={{ backgroundColor: 'var(--color-bg)' }}
        >
            <div
                className="rounded-lg shadow-xl w-full max-w-lg p-8"
                style={{ backgroundColor: 'var(--color-bg)' }}
            >
                <h1 className="page-title">
                    Asignar Líder a Colonia
                </h1>

                <h2 className="section-title">
                    Busca y selecciona el usuario que deseas asignar como líder
                </h2>

                {/* Alertas */}
                {error && (
                    <div className="alert-error">
                        <p className="alert-error-text">{error}</p>
                    </div>
                )}
                {success && (
                    <div className="alert-success">
                        <p className="alert-success-text">Líder asignado exitosamente</p>
                    </div>
                )}

                <div className="space-y-5">
                    {/* Select: Buscar por */}
                    <div>
                        <label
                            className="block text-sm font-semibold mb-1.5"
                            style={{ color: 'var(--color-primary)' }}
                        >
                            Buscar por
                        </label>
                        <div className="relative">
                            <select
                                value={searchType}
                                onChange={handleSearchTypeChange}
                                className="w-full appearance-none rounded-lg px-4 py-3 pr-10 border text-base cursor-pointer"
                                style={{
                                    backgroundColor: 'var(--color-bg)',
                                    borderColor: 'var(--color-bg-border)',
                                    color: 'var(--color-text)',
                                    outline: 'none',
                                }}
                                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
                                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--color-bg-border)')}
                            >
                                <option value="documento">Número de documento</option>
                                <option value="nombre">Nombre</option>
                            </select>
                            {/* Ícono chevron personalizado */}
                            <div
                                className="pointer-events-none absolute inset-y-0 right-3 flex items-center"
                                style={{ color: 'var(--color-primary)' }}
                            >
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Combobox con autocomplete */}
                    <div>
                        <label
                            className="block text-sm font-semibold mb-1.5"
                            style={{ color: 'var(--color-primary)' }}
                        >
                            {searchType === 'documento' ? 'Número de documento' : 'Nombre del usuario'}
                        </label>

                        <div ref={containerRef} className="relative">
                            <div
                                className="flex items-center rounded-lg border overflow-hidden transition-all"
                                style={{
                                    backgroundColor: 'var(--color-bg)',
                                    borderColor: isDropdownOpen ? 'var(--color-primary)' : 'var(--color-bg-border)',
                                }}
                            >
                                {/* Ícono de búsqueda */}
                                <div className="pl-3 pr-2 shrink-0" style={{ color: 'var(--color-text-muted)' }}>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
                                        <path d="M10.5 10.5L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                </div>

                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={inputValue}
                                    onChange={handleInputChange}
                                    onKeyDown={handleKeyDown}
                                    onFocus={() => {
                                        if (filteredUsers.length > 0) setIsDropdownOpen(true);
                                    }}
                                    placeholder={placeholder}
                                    className="flex-1 py-3 pr-4 text-base bg-transparent outline-none"
                                    style={{ color: 'var(--color-text)' }}
                                    autoComplete="off"
                                    role="combobox"
                                    aria-expanded={isDropdownOpen}
                                    aria-controls={listboxId}
                                    aria-haspopup="listbox"
                                    aria-activedescendant={
                                        highlightedIndex >= 0
                                            ? `${listboxId}-option-${highlightedIndex}`
                                            : undefined
                                    }
                                />

                                {/* Botón para limpiar */}
                                {inputValue && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setInputValue('');
                                            setSelectedUser(null);
                                            setFilteredUsers([]);
                                            setIsDropdownOpen(false);
                                            inputRef.current?.focus();
                                        }}
                                        className="pr-3 shrink-0 transition-opacity hover:opacity-60 text-text-muted"
                                        aria-label="Limpiar búsqueda"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                            <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                    </button>
                                )}
                            </div>

                            {/* Dropdown de resultados */}
                            {isDropdownOpen && (
                                <div
                                    ref={dropdownRef}
                                    id={listboxId}
                                    role="listbox"
                                    className="absolute z-50 w-full mt-1 rounded-lg border shadow-lg overflow-hidden"
                                    style={{
                                        backgroundColor: 'var(--color-bg)',
                                        borderColor: 'var(--color-bg-border)',
                                    }}
                                >
                                    {filteredUsers.length === 0 ? (
                                        <div
                                            className="px-4 py-3 text-sm"
                                            style={{ color: 'var(--color-text-muted)' }}
                                        >
                                            Sin resultados
                                        </div>
                                    ) : (
                                        filteredUsers.map((user, idx) => {
                                            const isHighlighted = idx === highlightedIndex;
                                            const label =
                                                searchType === 'documento'
                                                    ? user.documento
                                                    : `${user.nombre} ${user.apellido}`;
                                            const sublabel =
                                                searchType === 'documento'
                                                    ? `${user.nombre} ${user.apellido}`
                                                    : user.documento;

                                            return (
                                                <button
                                                    key={user.codigo}
                                                    id={`${listboxId}-option-${idx}`}
                                                    type="button"
                                                    role="option"
                                                    aria-selected={selectedUser?.codigo === user.codigo}
                                                    onClick={() => handleSelectUser(user)}
                                                    onMouseEnter={() => setHighlightedIndex(idx)}
                                                    className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors border-b last:border-b-0"
                                                    style={{
                                                        backgroundColor: isHighlighted
                                                            ? 'var(--color-bg-card)'
                                                            : 'transparent',
                                                        borderColor: 'var(--color-bg-separator)',
                                                    }}
                                                >
                                                    <div>
                                                        <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                                                            {highlight(label, inputValue)}
                                                        </p>
                                                        <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                                                            {sublabel} · {user.colonia}
                                                        </p>
                                                    </div>
                                                    {selectedUser?.codigo === user.codigo && (
                                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--color-accent-green)', flexShrink: 0 }}>
                                                            <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    )}
                                                </button>
                                            );
                                        })
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Chip del usuario seleccionado */}
                        {selectedUser && (
                            <div
                                className="mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm"
                                style={{
                                    backgroundColor: 'var(--color-bg-card)',
                                    border: '1px solid var(--color-bg-border)',
                                    color: 'var(--color-text)',
                                }}
                            >
                                <span
                                    className="w-2 h-2 rounded-full shrink-0"
                                    style={{ backgroundColor: 'var(--color-accent-green)' }}
                                />
                                {selectedUser.nombre} {selectedUser.apellido}
                                <span style={{ color: 'var(--color-text-muted)' }}>·</span>
                                <span style={{ color: 'var(--color-text-muted)' }}>{selectedUser.colonia}</span>
                            </div>
                        )}
                    </div>

                    {/* Botón confirmar */}
                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={!selectedUser || loading}
                        className="w-full py-3 rounded-lg font-semibold transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{
                            backgroundColor: 'var(--color-secondary)',
                            color: 'var(--color-text-inverse)',
                        }}
                    >
                        {loading ? 'Asignando...' : 'Confirmar asignación'}
                    </button>
                </div>
            </div>

            {/* Modal de confirmación */}
            <ConfirmModal
                isOpen={showConfirmModal}
                title="¿Confirmas la asignación del líder?"
                details={[
                    `${selectedUser?.nombre} ${selectedUser?.apellido}`,
                    selectedUser?.colonia ?? '',
                ]}
                onConfirm={handleModalConfirm}
                onCancel={() => setShowConfirmModal(false)}
                loading={loading}
            />

        </div>
    );
}