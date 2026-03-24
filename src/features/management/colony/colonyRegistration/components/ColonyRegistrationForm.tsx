'use client';

import { useEffect, useMemo, useState } from 'react';
import { useListColonia } from '../hooks/useListColonia';
import type { ColonyData } from '@/types/colony.types';
import { ConfirmModal } from '@/shared/components/confirmModal';
import { Search } from 'lucide-react';

const normalizarTexto = (valor: string): string =>
	valor.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export default function InscripcionColoniaForm() {
	const { listColonia, loading, error } = useListColonia();
	const [colonias, setColonias] = useState<ColonyData[]>([]);
	const [busqueda, setBusqueda] = useState('');
	const [seleccionada, setSeleccionada] = useState<ColonyData | null>(null);
	const [mostrarLista, setMostrarLista] = useState(false);
	const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
	const [mostrarMensajeEspera, setMostrarMensajeEspera] = useState(false);

	useEffect(() => {
		const cargarColonias = async () => {
			const response = await listColonia();
			setColonias(response?.success ? (response.data ?? []) : []);
		};
		void cargarColonias();
	}, [listColonia]);

	const coloniasFiltradas = useMemo(() => {
		const termino = normalizarTexto(busqueda.trim());
		if (!termino) return colonias;
		return colonias.filter((colonia) => {
			const etiqueta = colonia.department
				? `${colonia.country} ${colonia.department} ${colonia.city}`
				: colonia.country;
			return normalizarTexto(etiqueta).includes(termino);
		});
	}, [busqueda, colonias]);

	const sinColoniasDisponibles = !loading && !error && colonias.length === 0;

	const seleccionarColonia = (colonia: ColonyData) => {
		setSeleccionada(colonia);
		setBusqueda(
			colonia.department
				? `${colonia.country} - ${colonia.department} - ${colonia.city}`
				: colonia.country
		);
		setMostrarLista(false);
	};

	const confirmarInscripcion = () => {
		setMostrarConfirmacion(false);
		setMostrarMensajeEspera(true);
	};

	return (
		<div className="flex min-h-screen w-full items-center justify-center bg-bg px-4 py-6">
			<div className="mx-auto w-full max-w-xl rounded-xl border border-bg-border bg-bg-card p-6 shadow-sm sm:p-8">
				<h2 className="text-4xl font-bold text-primary">Registro de colonia</h2>

				<div className="mt-10">
					<label htmlFor="buscar-colonia" className="mb-3 block text-2xl font-semibold text-primary">
						Buscar colonia
					</label>

					<div className="relative">
						<Search className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
						<input
							id="buscar-colonia"
							type="text"
							value={busqueda}
							onChange={(e) => {
								setBusqueda(e.target.value);
								setSeleccionada(null);
								setMostrarLista(true);
							}}
							onFocus={() => setMostrarLista(true)}
							placeholder="Buscar colonia"
							className="w-full rounded-lg border border-bg-border bg-white px-4 py-3 text-lg text-text outline-none ring-primary transition focus:ring-2"
						/>

						{mostrarLista && (
							<ul className="absolute z-20 mt-2 max-h-56 w-full overflow-auto rounded-lg border border-bg-border bg-white shadow-md">
								{loading && (
									<li className="px-4 py-3 text-sm text-text-muted">Cargando colonias...</li>
								)}
								{!loading && coloniasFiltradas.length === 0 && (
									<li className="px-4 py-3 text-sm text-text-muted">
										No hay colonias disponibles para esta búsqueda.
									</li>
								)}
								{!loading && coloniasFiltradas.map((colonia, index) => (
									<li key={colonia.id ?? `${colonia.country}-${colonia.department}-${colonia.city}-${index}`}>
										<button
											type="button"
											onClick={() => seleccionarColonia(colonia)}
											className="w-full px-4 py-3 text-left text-base text-text hover:bg-bg-separator"
										>
											{colonia.department
												? `${colonia.country} - ${colonia.department} - ${colonia.city}`
												: colonia.country}
										</button>
									</li>
								))}
							</ul>
						)}
					</div>

					{error && <p className="mt-3 text-sm text-danger">{error}</p>}

					{sinColoniasDisponibles && (
						<div className="mt-4 rounded-lg border border-bg-border bg-bg px-4 py-3">
							<p className="text-sm text-text-muted">
								Actualmente no hay colonias disponibles. Intenta de nuevo más tarde.
							</p>
						</div>
					)}

					<button
						type="button"
						onClick={() => seleccionada && setMostrarConfirmacion(true)}
						disabled={!seleccionada}
						className="mt-8 w-full rounded-lg bg-secondary py-3 text-xl font-semibold text-text-inverse disabled:cursor-not-allowed disabled:opacity-60"
					>
						Inscribir
					</button>
				</div>
			</div>

			{/* Modal de confirmación de colonia */}
			<ConfirmModal
				isOpen={mostrarConfirmacion}
				title="¿Confirmas la creación de la colonia?"
				details={
					seleccionada
						? [
							seleccionada.country,
							seleccionada.department,
							seleccionada.city,
						].filter((v): v is string => v !== null)
						: []
				}
				onConfirm={confirmarInscripcion}
				onCancel={() => setMostrarConfirmacion(false)}
			/>

			{/* Modal de mensaje de espera */}
			<ConfirmModal
				isOpen={mostrarMensajeEspera}
				title="Solicitud enviada"
				details={['Debes esperar a que el líder de colonia apruebe tu solicitud para unirte.']}
				onConfirm={() => setMostrarMensajeEspera(false)}
				onCancel={() => setMostrarMensajeEspera(false)}
				confirmLabel="Entendido"
				cancelLabel="Cerrar"
			/>
		</div>
	);
}