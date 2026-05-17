import { apiService } from "@/services/api.services";
import type { ReportParams } from "../types/report.types";

export const reportService = {
    getReport: async (params: ReportParams): Promise<Blob> => {
        if (params.type === "colony") {
            return apiService.getBlob(
                `/api/v1/reportes/reporte-asistencia-colonia/${params.returnId}/${params.colonyId}`
            );
        }

        return apiService.getBlob(
            `/api/v1/reportes/reporte-general-asistencia/${params.returnId}`
        )
    }
}