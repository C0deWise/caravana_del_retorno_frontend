"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/auth/context/AuthContext";
import { ReportParams, ReportType } from "../types/report.types";
import { useListReturn } from "@/features/management/return/hooks/useListReturns";
import { UseGenerateReport } from "../hooks/useGenerateReport";
import { useListColonies } from "@/features/management/colony/hooks/useListColonies";
import { ColonyData } from "@/types/colony.types";
import { RequireAuth } from "@/auth/components/RequireAuth";
import { SearchInput } from "@/components/forms/SearchInput";

function GenerateReportsFeature() {
    const { user } = useAuth();
    const { effectiveRole } = useAuth();
    const isAdmin = effectiveRole === "admin";

    const [reportType, setReportType] = useState<ReportType>("colony");
    const [selectedReturn, setSelectedReturn] = useState<number | null>(null);
    const [selectedColony, setSelectedColony] = useState<number | null>(
        !isAdmin ? (user?.codigo_colonia ?? null) : null
    );
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [colonySearch, setColonySearch] = useState("");
    const [showColonyList, setShowColonyList] = useState(false);

    const { returns, loading: LoadingReturns, error: errorReturns } = useListReturn(true);
    const { listColonies, colonies, loading: loadingColonies, error: errorColonies } = useListColonies();
    const { generateReport, loading: loadingReport, error: errorReport } = UseGenerateReport();

    const loading = LoadingReturns || loadingColonies || loadingReport;
    const error = errorReturns ?? errorColonies ?? errorReport;

    useEffect(() => {
        if (reportType === "colony") {
            listColonies();
        }
    }, [reportType, listColonies])

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setReportType(e.target.value as ReportType);
        setSelectedColony(null);
    }

    const handleGenerate = async () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        if (!selectedReturn) return;
        if (reportType === "colony" && !selectedColony) return;

        const params: ReportParams =
            reportType === "colony"
                ? { type: "colony", returnId: selectedReturn, colonyId: selectedColony! }
                : { type: "general", returnId: selectedReturn };

        try {
            // MOCK TEMPORAL — reemplazar por generateReport(params) cuando el backend esté listo
            const response = await fetch("/mock-report.pdf");
            const blob = await response.blob();
            // FIN MOCK

            // const blob = await generateReport(params);

            const url = URL.createObjectURL(blob);
            setPreviewUrl(url);
        } catch (err) { }

    }

    const formatColonyLabel = (c: ColonyData): string => {
        const colonyLabel = c.pais === "Colombia"
            ? `${c.ciudad}, ${c.departamento}, ${c.pais}`
            : `${c.pais}`;

        return colonyLabel;
    }

    const filteredColonies = useMemo(() => {
        if (!colonySearch.trim()) return colonies;
        const term = colonySearch.toLowerCase();
        return colonies.filter((c) =>
            formatColonyLabel(c).toLowerCase().includes(term)
        );
    }, [colonySearch, colonies]);

    return (
        <div className="flex flex-col min-h-screen w-full items-center px-4 py-8 bg-bg">
            <div className="rounded-lg shadox-xl w-full max-w-4xl bg-bg">
                <h1 className="page-title">Generar Reportes</h1>

                {isAdmin ? (
                <h2 className="section-title">Selecciona el tipo de reporte que deseas generar</h2>
                ) : (
                    <h2 className="section-title">Genera el reporte de tu colonia</h2>
                )}

                <div className="mt-10 flex flex-row flex-wrap items-center justify-center gap-4">

                    {isAdmin && (
                        <label className="label-base">
                            <span className="label-base">Tipo de reporte</span>
                            <select value={reportType} onChange={handleTypeChange} className="select-base rounded-xl border border-bg-border bg-bg w-full">
                                <option value="general">Asistencia general</option>
                                <option value="colony">Asistencia por colonia</option>
                            </select>
                        </label>
                    )}

                    <label className="label-base">
                        <span className="label-base">Retorno</span>
                        <select
                            value={selectedReturn ?? ""}
                            onChange={(e) => setSelectedReturn(Number(e.target.value) || null)}
                            className="select-base rounded-xl border border-bg-border bg-bg w-full"
                        >
                            <option value="" disabled>-- Seleccionar retorno --</option>
                            {returns.map((r) => (
                                <option key={r.codigo} value={r.codigo}>{r.anio}</option>
                            ))}
                        </select>
                    </label>


                    {isAdmin && reportType === "colony" && (
                        <label className="label-base">
                            <span className="label-base">Colonia</span>
                            <div className="relative">
                                <SearchInput
                                    placeholder="Buscar colonia..."
                                    onSearch={setColonySearch}
                                    onChange={setColonySearch}
                                    value={colonySearch}
                                    onFocus={() => setShowColonyList(true)}
                                    loading={loadingColonies}
                                    aria-expanded={showColonyList}
                                    aria-haspopup="listbox"
                                    minLength={0}
                                />

                                {showColonyList && (
                                    <ul className="absolute z-20 mt-2 w-72 max-h-56 overflow-auto rounded-lg border border-bg-border bg-white shadow-md">
                                        {filteredColonies.map((c) => (
                                            <li key={c.codigo}>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedColony(c.codigo);
                                                        setColonySearch(formatColonyLabel(c));
                                                        setShowColonyList(false);
                                                    }}
                                                    className="w-full px-4 py-3 text-left text-sm text-text hover:bg-bg-separator"
                                                >
                                                    {formatColonyLabel(c)}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </label>
                    )}
                </div>

                {error && (
                    <div className="alert-error mb-0">
                        <p className="alert-error-text">{error}</p>
                    </div>
                )}


                <div className="mt-4 flex justify-center">
                    <button
                        type="button"
                        onClick={() => void handleGenerate()}
                        disabled={
                            !selectedReturn ||
                            (isAdmin && reportType === "colony" && !selectedColony) ||
                            loading
                        }
                        className="px-8 py-3 rounded-lg font-semibold transition-opacity disabled:opacity-50 bg-secondary text=text-inverse cursor-pointer"
                    >
                        {loadingReport ? "Generando..." : "Generar reporte"}
                    </button>
                </div>

                {previewUrl && (
                    <div className="mt-6 w-full rounded-lg border border-bg-border overflow-hidden">
                        <iframe
                            src={previewUrl}
                            className="w-full h-96"
                            title="Vista previa del reporte"
                        />
                    </div>
                )}
            </div>
        </div >
    );
}

export default function GenerateReports() {
    return (
        <RequireAuth roles={["admin", "lider_colonia"]}>
            <GenerateReportsFeature />
        </RequireAuth>
    );
}