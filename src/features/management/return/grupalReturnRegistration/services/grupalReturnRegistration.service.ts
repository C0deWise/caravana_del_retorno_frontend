import { apiService } from "@/services/api.services";
import type {
    GruposRetorno,
    GruposRetornoCreateRequest,
    MiembroGrupo,
    RegistroGrupoRetorno,
    RegistroGrupoRetornoRequest,
    SolicitudMiembro,
    SolicitudMiembroRequest,
} from "../types/grupalReturnRegistration"

class GrupalReturnRegistrationService {
    private readonly endpoint = "/api/v1/grupoRetorno";

    async createGrupo(data: GruposRetornoCreateRequest): Promise<GruposRetorno> {
        return apiService.post<GruposRetorno>(`${this.endpoint}/`, data);
    }

    async getGruposPorLider(lider: number): Promise<GruposRetorno[]> {
        return apiService.get<GruposRetorno[]>(
            `${this.endpoint}/lider/${lider}`
        );
    }

    async getLiderPorGrupo(grupo: number): Promise<MiembroGrupo> {
        return apiService.get<MiembroGrupo>(`${this.endpoint}/${grupo}/lider`);
    }

    async solicitarMiembro(data: SolicitudMiembroRequest): Promise<SolicitudMiembro> {
        return apiService.post<SolicitudMiembro>(`${this.endpoint}/solicitar-miembro`, data);
    }

    async registrarGrupo(data: RegistroGrupoRetornoRequest): Promise<RegistroGrupoRetorno> {
        return apiService.post<RegistroGrupoRetorno>(`${this.endpoint}/registro`, data);
    }

    async getMiembros(grupo: number): Promise<MiembroGrupo[]> {
        return apiService.get<MiembroGrupo[]>(`${this.endpoint}/${grupo}/miembros`)
    }
}

export const grupalReturnRegistrationService = new GrupalReturnRegistrationService();