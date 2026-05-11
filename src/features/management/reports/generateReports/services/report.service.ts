import { apiService } from "@/services/api.services";
import type { ReportParams } from "../types/report.types";

// TODO: Verificar endpoints para la conexión
export const reportService = {
    getReport: async (params: ReportParams): Promise<Blob> => {
        if (params.type === "colony") {
            return apiService.getBlob(
                `/api/v1/retornos/${params.returnId}/colonias/${params.colonyId}/reporte/`
            );
        }

        return apiService.getBlob(
            `/api/v1/retornos/${params.returnId}/reporte/`
        )
    }
}