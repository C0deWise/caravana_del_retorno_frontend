"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/auth/context/AuthContext";
import { ConfirmModal } from "@/components/confirmModal";
import Spinner from "@/ui/animations/Spinner";
import { useSendReturnRegistration } from "../hooks/useSendReturnRegistration";
import { returnRegistrationService } from "../services/returnRegistration.service";
import type {
	ReturnRegistrationAnswer,
	ReturnRegistrationApi,
	ReturnRegistrationItem,
} from "../types/returnRegistration.types";

type FormErrors = {
	accomodation?: string;
	transport?: string;
	people_in_charge?: string;
};

const initialForm: {
	accomodation: ReturnRegistrationAnswer | "";
	transport: ReturnRegistrationAnswer | "";
	people_in_charge: string;
} = {
	accomodation: "",
	transport: "",
	people_in_charge: "0",
};

export default function ReturnRegistrationForm() {
	const { user, isAuthenticated } = useAuth();
	const { sendReturnRegistration, loading, error } = useSendReturnRegistration();

	const [formData, setFormData] = useState(initialForm);
	const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [submittedRecord, setSubmittedRecord] =
		useState<ReturnRegistrationApi | null>(null);
	const [eligibilityLoading, setEligibilityLoading] = useState(true);
	const [eligibilityError, setEligibilityError] = useState<string | null>(null);
	const [alreadyRegistered, setAlreadyRegistered] = useState(false);
	const [activeReturnCode, setActiveReturnCode] = useState<number | null>(
		null,
	);

	useEffect(() => {
		if (!isAuthenticated || !user || !user.codigo_colonia) {
			setEligibilityLoading(false);
			setEligibilityError(null);
			setAlreadyRegistered(false);
			setActiveReturnCode(null);
			return;
		}

		let isMounted = true;

		const resolveActiveReturn = async () => {
			setEligibilityLoading(true);
			setEligibilityError(null);
			setAlreadyRegistered(false);

			try {
				const activeReturn = await returnRegistrationService.getActiveReturn();
				if (!isMounted) return;

				const parsedCode = Number(activeReturn?.re_codigo);
				const normalizedCode =
					Number.isInteger(parsedCode) && parsedCode > 0 ? parsedCode : null;

				setActiveReturnCode(normalizedCode);

				if (!normalizedCode) {
					setAlreadyRegistered(false);
					return;
				}

				const hasRegistration =
					await returnRegistrationService.hasUserRegistrationInReturn(
						user.id,
						normalizedCode,
					);

				if (!isMounted) return;
				setAlreadyRegistered(hasRegistration);
			} catch {
				if (!isMounted) return;
				setEligibilityError(
					"No fue posible validar si existe un retorno activo. Intenta nuevamente.",
				);
			} finally {
				if (!isMounted) return;
				setEligibilityLoading(false);
			}
		};

		void resolveActiveReturn();

		return () => {
			isMounted = false;
		};
	}, [isAuthenticated, user]);

	const normalizedPeopleInCharge = useMemo(() => {
		const parsed = Number(formData.people_in_charge);
		if (!Number.isFinite(parsed) || parsed < 0) return 0;
		return Math.floor(parsed);
	}, [formData.people_in_charge]);

	const confirmDetails = useMemo(
		() => [
			`Hospedaje: ${formData.accomodation === "si" ? "Si" : "No"}`,
			`Transporte: ${formData.transport === "si" ? "Si" : "No"}`,
			`Personas a cargo: ${normalizedPeopleInCharge}`,
		],
		[formData.accomodation, formData.transport, normalizedPeopleInCharge],
	);

	const validateForm = (): boolean => {
		const nextErrors: FormErrors = {};

		if (!formData.accomodation) {
			nextErrors.accomodation = "Selecciona si cuentas con hospedaje.";
		}

		if (!formData.transport) {
			nextErrors.transport = "Selecciona si cuentas con transporte.";
		}

		if (formData.people_in_charge === "") {
			nextErrors.people_in_charge =
				"Ingresa un número de personas a cargo (0 si no aplica).";
		} else {
			const parsed = Number(formData.people_in_charge);
			if (!Number.isFinite(parsed) || parsed < 0) {
				nextErrors.people_in_charge =
					"El número de personas a cargo no puede ser negativo.";
			}
		}

		setFieldErrors(nextErrors);
		return Object.keys(nextErrors).length === 0;
	};

	const onPeopleInChargeChange = (raw: string) => {
		if (raw === "") {
			setFormData((prev) => ({ ...prev, people_in_charge: "" }));
			return;
		}

		const numeric = raw.replace(/[^\d-]/g, "");
		setFormData((prev) => ({ ...prev, people_in_charge: numeric }));
		setFieldErrors((prev) => ({ ...prev, people_in_charge: undefined }));
	};

	const handleRadioChange = (
		field: "accomodation" | "transport",
		value: ReturnRegistrationAnswer,
	) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
	};

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!validateForm()) return;

		setShowConfirmModal(true);
	};

	const handleConfirmSubmit = async () => {
		if (!validateForm()) {
			setShowConfirmModal(false);
			return;
		}

		if (!user) {
			setShowConfirmModal(false);
			return;
		}

		if (!activeReturnCode) {
			setShowConfirmModal(false);
			return;
		}

		try {
			const hasRegistration =
				await returnRegistrationService.hasUserRegistrationInReturn(
					user.id,
					activeReturnCode,
				);

			if (hasRegistration) {
				setAlreadyRegistered(true);
				setShowConfirmModal(false);
				return;
			}
		} catch {
			setEligibilityError(
				"No fue posible validar tu inscripción actual. Intenta nuevamente.",
			);
			setShowConfirmModal(false);
			return;
		}

		const payload: ReturnRegistrationItem = {
			accomodation: formData.accomodation as ReturnRegistrationAnswer,
			transport: formData.transport as ReturnRegistrationAnswer,
			people_in_charge: normalizedPeopleInCharge,
		};

		const response = await sendReturnRegistration(payload);
		setShowConfirmModal(false);

		if (response) {
			setAlreadyRegistered(true);
			setSubmittedRecord(response);
		}
	};

	const resetForm = () => {
		setSubmittedRecord(null);
		setFormData(initialForm);
		setFieldErrors({});
	};

	if (!isAuthenticated || !user) {
		return (
			<div className="bg-white px-4 py-6 flex justify-center">
				<div className="w-full max-w-xl rounded-2xl bg-bg-card p-8 shadow-md text-center">
					<h1 className="page-title mb-4">Registro de asistencia al retorno</h1>
					<p className="text-text text-lg font-medium">No puedes inscribirte aún.</p>
					<p className="text-text-muted mt-2">
						Debes registrarte e iniciar sesión para continuar con la inscripción.
					</p>
				</div>
			</div>
		);
	}

	if (!user.codigo_colonia) {
		return (
			<div className="bg-white px-4 py-6 flex items-center justify-center">
				<div className="w-full max-w-xl rounded-2xl bg-bg-card p-8 shadow-md text-center">
					<h1 className="page-title mb-4">Registro de asistencia al retorno</h1>
					<p className="text-text text-lg font-medium">No tienes colonia asignada.</p>
					<p className="text-text-muted mt-2">
						Para inscribirte debes solicitar acceso y quedar afiliado a una colonia.
					</p>
				</div>
			</div>
		);
	}

	if (eligibilityLoading) {
		return (
			<div className="bg-white px-4 py-6 flex items-center justify-center">
				<div className="text-center">
					<Spinner size="lg" className="mx-auto" />
					<p className="mt-4 text-text-muted">Cargando información de inscripción...</p>
				</div>
			</div>
		);
	}

	if (eligibilityError) {
		return (
			<div className="bg-white px-4 py-6 flex items-center justify-center">
				<div className="w-full max-w-xl rounded-2xl bg-bg-card p-8 shadow-md text-center">
					<h1 className="page-title mb-4">Registro de asistencia al retorno</h1>
					<div className="alert-error mb-0">
						<p className="alert-error-text">{eligibilityError}</p>
					</div>
				</div>
			</div>
		);
	}

	if (!activeReturnCode) {
		return (
			<div className="bg-white px-4 py-6 flex items-center justify-center">
				<div className="w-full max-w-xl rounded-2xl bg-bg-card p-8 shadow-md text-center">
					<h1 className="page-title mb-4">Registro de asistencia al retorno</h1>
					<h2 className="section-title mb-4">Estado vacio</h2>
					<p className="text-text font-medium">No hay un retorno activo habilitado.</p>
					<p className="text-text-muted mt-2">
						Cuando un retorno sea habilitado, podras completar este formulario.
					</p>
				</div>
			</div>
		);
	}

	if (alreadyRegistered) {
		return (
			<div className="bg-white px-4 py-6 flex items-center justify-center">
				<div className="w-full max-w-xl rounded-2xl bg-bg-card p-8 shadow-md text-center">
					<h1 className="page-title mb-4">Registro de asistencia al retorno</h1>
					<h2 className="section-title mb-4">Formulario ya registrado</h2>
					<p className="text-text font-medium">
						Ya has confirmado tu asistencia a este retorno.
					</p>
				</div>
			</div>
		);
	}

	if (submittedRecord) {
		return (
			<div className="bg-white px-4 py-6 flex items-center justify-center">
				<div className="w-full max-w-2xl rounded-2xl bg-bg-card p-8 shadow-md">
					<h1 className="page-title">Registro de asistencia al retorno</h1>
					<h2 className="section-title">Inscripción exitosa</h2>

					<div className="alert-success mt-0">
						<p className="alert-success-text">
							Tu asistencia fue registrada correctamente.
						</p>
					</div>

					<ul className="mt-4 list-disc pl-6 text-text space-y-1">
						<li>
							Hospedaje: {submittedRecord.accomodation === "si" ? "Si" : "No"}
						</li>
						<li>
							Transporte: {submittedRecord.transport === "si" ? "Si" : "No"}
						</li>
						<li>Personas a cargo: {submittedRecord.people_in_charge}</li>
					</ul>

					<div className="mt-8 flex justify-center">
						<button type="button" className="btn-primary" onClick={resetForm}>
							Confirmar
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-white px-4 py-6">
			<div className="mx-auto w-full max-w-2xl rounded-2xl bg-bg p-6 shadow-md sm:p-8">
				<h1 className="page-title">Registro de Asistencia al Retorno</h1>
				<h2 className="section-title">Confirma tu disponibilidad de viaje</h2>

				{error && (
					<div className="alert-error">
						<p className="alert-error-text">{error}</p>
					</div>
				)}

				<form className="mt-6 space-y-6" onSubmit={handleSubmit} noValidate>
					<fieldset>
						<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
							<legend className="label-primary mb-0">¿Tiene hospedaje?</legend>
							<div
								className={`inline-flex items-center gap-5 rounded-lg px-3 py-2 ${fieldErrors.accomodation ? "border border-danger" : "border border-transparent"}`}
							>
							<label className="inline-flex items-center gap-2 text-text">
								<input
									type="radio"
									name="accomodation"
									value="si"
									checked={formData.accomodation === "si"}
									onChange={() => handleRadioChange("accomodation", "si")}
								/>
								Sí
							</label>
							<label className="inline-flex items-center gap-2 text-text">
								<input
									type="radio"
									name="accomodation"
									value="no"
									checked={formData.accomodation === "no"}
									onChange={() => handleRadioChange("accomodation", "no")}
								/>
								No
							</label>
							</div>
						</div>
						{fieldErrors.accomodation && (
							<p className="validation-message validation-error">
								{fieldErrors.accomodation}
							</p>
						)}
					</fieldset>

					<fieldset>
						<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
							<legend className="label-primary mb-0">¿Tiene transporte?</legend>
							<div
								className={`inline-flex items-center gap-5 rounded-lg px-3 py-2 ${fieldErrors.transport ? "border border-danger" : "border border-transparent"}`}
							>
							<label className="inline-flex items-center gap-2 text-text">
								<input
									type="radio"
									name="transport"
									value="si"
									checked={formData.transport === "si"}
									onChange={() => handleRadioChange("transport", "si")}
								/>
								Sí
							</label>
							<label className="inline-flex items-center gap-2 text-text">
								<input
									type="radio"
									name="transport"
									value="no"
									checked={formData.transport === "no"}
									onChange={() => handleRadioChange("transport", "no")}
								/>
								No
							</label>
							</div>
						</div>
						{fieldErrors.transport && (
							<p className="validation-message validation-error">
								{fieldErrors.transport}
							</p>
						)}
					</fieldset>

					<div>
						<label htmlFor="people-in-charge" className="label-primary">
							Número de personas a cargo
						</label>
						<p className="validation-message validation-info">
							Menores de edad, personas con discapacidad o cualquier persona que requiera asistencia durante el retorno deben ser registradas como personas a cargo.
							Si no tienes personas a cargo, ingresa 0.
						</p>
						<div
							className={`mt-2 inline-flex items-center gap-2 rounded-lg p-2 ${fieldErrors.people_in_charge ? "border-2 border-danger" : "border border-bg-border"}`}
						>
							<input
								id="people-in-charge"
								name="people-in-charge"
								type="number"
								inputMode="numeric"
								min={0}
								value={formData.people_in_charge}
								onChange={(event) => onPeopleInChargeChange(event.target.value)}
								className="h-9 w-20 rounded-md border border-bg-border bg-white px-2 text-center text-text"
								aria-invalid={Boolean(fieldErrors.people_in_charge)}
							/>
						</div>
						{fieldErrors.people_in_charge && (
							<p className="validation-message validation-error">
								{fieldErrors.people_in_charge}
							</p>
						)}
					</div>

					<div className="flex justify-center pt-1">
						<button
							type="submit"
							className="btn-primary min-w-48 inline-flex items-center justify-center gap-2"
							disabled={loading}
						>
							{loading && <Spinner size="sm" />}
							{loading ? "Enviando..." : "Registrar asistencia"}
						</button>
					</div>
				</form>
			</div>

			<ConfirmModal
				isOpen={showConfirmModal}
				title="¿Confirmas tu registro de asistencia?"
				details={confirmDetails}
				onConfirm={handleConfirmSubmit}
				onCancel={() => setShowConfirmModal(false)}
				loading={loading}
				confirmLabel="Confirmar"
				cancelLabel="Cancelar"
			/>
		</div>
	);
}
