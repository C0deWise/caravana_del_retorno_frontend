import { useCallback, useState } from "react";
import { ReportParams } from "../types/report.types";
import { reportService } from "../services/report.service";
import { ApiError } from "@/services/api.services";

interface UseGenerateReportReturn {
    generateReport: (params: ReportParams) => Promise<Blob | null>;
    loading: boolean;
    error: string | null;
}

export const UseGenerateReport = (): UseGenerateReportReturn => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateReport = useCallback(
        async (params: ReportParams): Promise<Blob | null> => {
            setLoading(true);
            setError(null);

            try {
                const blob = await reportService.getReport(params);
                return blob;
            } catch (error) {
                let errorMessage = "Error al generar el reporte";
                if (error instanceof ApiError) {
                    errorMessage = error.message;
                }
                setError(errorMessage);
                throw new Error(errorMessage);
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    return { generateReport, loading, error };
} 