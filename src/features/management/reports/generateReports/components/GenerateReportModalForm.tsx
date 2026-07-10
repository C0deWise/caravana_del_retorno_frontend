"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/auth/context/AuthContext";
import { ReportType, ReportParams } from "../types/report.types";
import { UseGenerateReport } from "../hooks/useGenerateReport";
import { useListColonies } from "@/features/management/colony/hooks/useListColonies";
import { ColonyData } from "@/types/colony.types";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";
import { SelectField } from "@/components/forms/SelectField";
import { Autocomplete } from "@/components/forms/Autocomplete";
import { useToast } from "@/components/feedback/Toast";

interface GenerateReportModalFormProps {
    readonly retornoId: number;
    readonly retornoAnio: number;
    readonly onCancel?: () => void;
}

export function GenerateReportModalForm({ retornoId, retornoAnio, onCancel }: GenerateReportModalFormProps) {
    const { user, effectiveRole } = useAuth();
    const isAdmin = effectiveRole === "admin";
    const { showToast } = useToast();

    const [reportType, setReportType] = useState<ReportType>("general");
    const [selectedColony, setSelectedColony] = useState<number | null>(
        isAdmin ? null : (user?.codigo_colonia ?? null)
    );
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [colonySearch, setColonySearch] = useState("");

    const { listColonies, colonies, loading: loadingColonies } = useListColonies();
    const { generateReport, loading: loadingReport } = UseGenerateReport();

    const loading = loadingColonies || loadingReport;
    const userColony = colonies.find(c => c.codigo === selectedColony);

    useEffect(() => {
        if (reportType === "colony") {
            listColonies();
        }
    }, [reportType, listColonies]);

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);



    const formatColonyLabel = (c: ColonyData): string => {
        return c.pais === "Colombia"
            ? `${c.ciudad}, ${c.departamento}, ${c.pais}`
            : `${c.pais}`;
    };

    const handleGenerate = async () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);

        let params: ReportParams;

        if (reportType === "colony") {
            if (!selectedColony) return;
            params = { type: "colony", returnId: retornoId, colonyId: selectedColony };
        } else {
            params = { type: "general", returnId: retornoId };
        }

        try {
            const blob = await generateReport(params);
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            setPreviewUrl(url);
        } catch {
            onCancel?.();
            
            let customMessage = `Aún no hay nadie registrado para el Retorno ${retornoAnio}.`;
            if (reportType === "colony") {
                const colonyName = userColony ? formatColonyLabel(userColony) : "seleccionada";
                customMessage = `La colonia ${colonyName} no tiene a nadie registrado para el Retorno ${retornoAnio}.`;
            }
            
            showToast(customMessage, "error");
        }
    };

    const filteredColonies = useMemo(() => {
        if (!colonySearch.trim()) return colonies;
        const term = colonySearch.toLowerCase();
        return colonies.filter((c) =>
            formatColonyLabel(c).toLowerCase().includes(term)
        );
    }, [colonySearch, colonies]);

    const handleOpenFullscreen = () => {
        if (previewUrl) {
            window.open(previewUrl, "_blank");
        }
    };

    const getSubtitleText = () => {
        if (isAdmin) {
            return "Selecciona el tipo de reporte que deseas generar.";
        }
        if (userColony) {
            return `Genera el reporte de tu colonia: ${formatColonyLabel(userColony)}`;
        }
        return "Genera el reporte de tu colonia";
    };

    return (
        <div className="p-6 bg-bg flex flex-col h-full max-h-[85vh] rounded-xl shadow-lg">
            <h2 className="text-xl font-bold text-primary mb-1 outline-none">
                Generar Reporte - Retorno {retornoAnio}
            </h2>
            <p className="text-sm text-text-muted mb-6">
                {getSubtitleText()}
            </p>

            <div className="space-y-4 mb-6">
                {isAdmin && (
                    <SelectField
                        label="Tipo de reporte"
                        instanceId="report-type-select"
                        inputId="report-type"
                        options={[
                            { value: "general", label: "Asistencia general" },
                            { value: "colony", label: "Asistencia por colonia" },
                        ]}
                        value={
                            reportType === "general"
                                ? { value: "general", label: "Asistencia general" }
                                : { value: "colony", label: "Asistencia por colonia" }
                        }
                        onChange={(option) => {
                            if (option?.value) {
                                setReportType(option.value as ReportType);
                                setSelectedColony(null);
                                setPreviewUrl(null);
                            }
                        }}
                        isSearchable={false}
                    />
                )}

                {isAdmin && reportType === "colony" && (
                    <div className="relative">
                        <Autocomplete
                            label="Colonia"
                            placeholder="Buscar colonia..."
                            onSearch={setColonySearch}
                            results={filteredColonies}
                            loading={loadingColonies}
                            minLength={0}
                            getDisplayValue={(c) => formatColonyLabel(c)}
                            onSelect={(c) => {
                                setSelectedColony(c.codigo);
                                setColonySearch(formatColonyLabel(c));
                            }}
                            renderItem={(c) => (
                                <div className="px-4 py-3 text-sm">
                                    {formatColonyLabel(c)}
                                </div>
                            )}
                        />
                    </div>
                )}
            </div>

            <div className="flex gap-3 mb-4">
                <button
                    type="button"
                    onClick={() => void handleGenerate()}
                    disabled={
                        (isAdmin && reportType === "colony" && !selectedColony) ||
                        loading
                    }
                    className="flex-1 py-3 rounded-xl font-bold bg-secondary text-text-inverse hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg"
                >
                    {loadingReport ? "Generando..." : "Generar reporte"}
                </button>

                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 py-3 rounded-xl font-bold border border-bg-border text-text hover:bg-bg-card transition-all"
                >
                    Cerrar
                </button>
            </div>

            {previewUrl && (
                <div className="mt-4 w-full flex-1 flex flex-col rounded-lg border border-bg-border overflow-hidden min-h-[40vh]">
                    <div className="bg-bg-card px-4 py-2 border-b border-bg-border flex justify-between items-center">
                        <span className="text-sm font-semibold text-text-muted">Vista previa</span>
                        <button
                            type="button"
                            onClick={handleOpenFullscreen}
                            className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                            title="Abrir en pantalla completa (nueva pestaña)"
                        >
                            <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                            <span>Pantalla Completa</span>
                        </button>
                    </div>
                    <iframe
                        src={previewUrl}
                        className="w-full h-full flex-1 bg-white"
                        title="Vista previa del reporte"
                    />
                </div>
            )}
        </div>
    );
}
