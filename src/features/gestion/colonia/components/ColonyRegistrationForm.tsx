'use client';

import { useEffect, useMemo, useState } from 'react';
import { useListColonia } from '../hooks/useListColonia';
import type { ColoniaItem } from '../types/colonia.types';

const normalizarTexto = (valor: string): string =>
	valor
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase();

export default function InscripcionColoniaForm() {
	const { listColonia, loading, error } = useListColonia();
	const [colonias, setColonias] = useState<ColoniaItem[]>([]);
	const [busqueda, setBusqueda] = useState('');
	const [seleccionada, setSeleccionada] = useState<ColoniaItem | null>(null);
	const [mostrarLista, setMostrarLista] = useState(false);
	const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
	const [mostrarMensajeEspera, setMostrarMensajeEspera] = useState(false);

	useEffect(() => {
		const cargarColonias = async () => {
			const response = await listColonia();
			if (!response?.success) {
				setColonias([]);
				return;
			}

			setColonias(response.data ?? []);
		};

		void cargarColonias();
	}, [listColonia]);

	const coloniasFiltradas = useMemo(() => {
		const termino = normalizarTexto(busqueda.trim());

		if (!termino) {
			return colonias;
		}

		return colonias.filter((colonia) => {
			const etiqueta = `${colonia.co_pais} ${colonia.co_departamento} ${colonia.co_ciudad}`;
			return normalizarTexto(etiqueta).includes(termino);
		});
	}, [busqueda, colonias]);

	const sinColoniasDisponibles = !loading && !error && colonias.length === 0;

	const seleccionarColonia = (colonia: ColoniaItem) => {
		setSeleccionada(colonia);
		setBusqueda(`${colonia.co_pais} - ${colonia.co_departamento} - ${colonia.co_ciudad}`);
		setMostrarLista(false);
	};

	const abrirConfirmacion = () => {
		if (!seleccionada) {
			return;
		}
		setMostrarConfirmacion(true);
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
					<input
						id="buscar-colonia"
						type="text"
						value={busqueda}
						onChange={(event) => {
							setBusqueda(event.target.value);
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

							{!loading &&
								coloniasFiltradas.map((colonia, index) => (
									<li key={colonia.co_codigo ?? `${colonia.co_pais}-${colonia.co_departamento}-${colonia.co_ciudad}-${index}`}>
										<button
											type="button"
											onClick={() => seleccionarColonia(colonia)}
											className="w-full px-4 py-3 text-left text-base text-text hover:bg-bg-separator"
										>
											{colonia.co_pais} - {colonia.co_departamento} - {colonia.co_ciudad}
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
						onClick={abrirConfirmacion}
						disabled={!seleccionada}
						className="mt-8 w-full rounded-lg bg-secondary py-3 text-xl font-semibold text-text-inverse disabled:cursor-not-allowed disabled:opacity-60"
					>
						Inscribir
					</button>
				</div>

				{mostrarConfirmacion && seleccionada && (
					<div className="fixed inset-0 z-30 flex items-center justify-center bg-black/45 px-4 py-6">
						<div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-bg p-5 shadow-lg">
						<h3 className="text-3xl font-bold text-primary">¿Confirmas la colonia seleccionada?</h3>

						<ul className="my-5 list-disc space-y-1 pl-7 text-xl font-semibold text-text sm:text-2xl">
							<li>{seleccionada.co_pais}</li>
							<li>{seleccionada.co_departamento}</li>
							<li>{seleccionada.co_ciudad}</li>
						</ul>

						<div className="mt-6 flex gap-4">
							<button
								type="button"
								onClick={confirmarInscripcion}
								className="flex-1 rounded-lg bg-success py-2 text-xl font-semibold text-text-inverse"
							>
								Confirmar
							</button>
							<button
								type="button"
								onClick={() => setMostrarConfirmacion(false)}
								className="flex-1 rounded-lg bg-danger py-2 text-xl font-semibold text-text-inverse"
							>
								Cancelar
							</button>
						</div>
						</div>
					</div>
				)}

				{mostrarMensajeEspera && (
					<div className="fixed inset-0 z-30 flex items-center justify-center bg-black/45 px-4 py-6">
						<div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-bg p-6 text-center shadow-lg">
						<h3 className="text-2xl font-bold text-primary">Solicitud enviada</h3>
						<p className="mt-4 text-lg text-text">
							Debes esperar a que el líder de colonia apruebe tu solicitud para unirte.
						</p>
						<button
							type="button"
							onClick={() => setMostrarMensajeEspera(false)}
							className="mt-6 w-full rounded-lg bg-secondary py-2 text-lg font-semibold text-text-inverse"
						>
							Entendido
						</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
