import { apiService } from "@/services/api.services";
import type {
    Persona,
    PersonaCreateRequest,
    PersonaGrupo,
    PersonaRequest
} from "../types/persona.types";

class PersonaService {
    private readonly endpoint = "/api/v1/personas";

    async create(data: PersonaCreateRequest): Promise<Persona> {
        return apiService.post<Persona>(`${this.endpoint}/`, data);
    }

    async asociarGrupo(data: PersonaRequest): Promise<PersonaGrupo> {
        return apiService.post<PersonaGrupo>(`${this.endpoint}/asociar-grupo`, data);
    }

    async getByGrupo(grupo: number): Promise<Persona[]> {
        return apiService.get<Persona[]>(`${this.endpoint}/grupo/${grupo}`);
    }

    async getByDocumento(documento: string): Promise<Persona | null> {
        return await apiService.get<Persona>(`${this.endpoint}/documento/${documento}`);
    }

    async removerPersona(data: PersonaRequest): Promise<boolean> {
        return await apiService.delete<boolean>(`${this.endpoint}/remover-persona-grupo/${data.pe_codigo}/${data.gr_codigo}`);
    }
}

export const personaService = new PersonaService();