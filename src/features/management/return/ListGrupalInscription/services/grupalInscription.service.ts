import { apiService } from "@/services/api.services";
import type {
  GrupalInvitation,
  GrupalInvitationDto,
  ListGrupalInvitationsResponseDto,
} from "../types/grupalInscription.types";
import {
  mapGrupalInvitationDtoToModel,
  mapGrupalInvitationListDtoToModel,
} from "../types/grupalInscription.types";

// ─────────────────────────────────────────────────────────────────────────────
// DEV MOCK — remove this block (and set USE_MOCK = false) when the API is ready
// ─────────────────────────────────────────────────────────────────────────────
const USE_MOCK = true;

const MOCK_STORE: GrupalInvitationDto[] = [
  {
    codigo: 1,
    grupo: 10,
    estado: "pendiente",
    fecha_solicitud: "2026-04-10T08:00:00Z",
    nombre_lider: "Carlos",
    apellido_lider: "Ramírez",
    fecha_retorno: "2028-02-25",
    participantes_confirmados: [
      { usuario: 2, nombre: "Ana", apellido: "Ramírez" },
      { usuario: 3, nombre: "Luis", apellido: "Ramírez" },
    ],
  },
  {
    codigo: 2,
    grupo: 11,
    estado: "pendiente",
    fecha_solicitud: "2026-04-12T10:30:00Z",
    nombre_lider: "Sofía",
    apellido_lider: "Gómez",
    fecha_retorno: "2028-02-25",
    participantes_confirmados: [
      { usuario: 5, nombre: "Marco", apellido: "Gómez" },
    ],
  },
  {
    codigo: 3,
    grupo: 12,
    estado: "expirado",
    fecha_solicitud: "2026-03-01T09:00:00Z",
    nombre_lider: "Pedro",
    apellido_lider: "Torres",
    fecha_retorno: "2028-02-25",
    participantes_confirmados: [
      { usuario: 7, nombre: "Claudia", apellido: "Torres" },
      { usuario: 8, nombre: "Jorge", apellido: "Torres" },
    ],
  },
];

async function mockDelay(ms = 500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
// ─────────────────────────────────────────────────────────────────────────────

export async function listMyGrupalInvitations(): Promise<GrupalInvitation[]> {
  if (USE_MOCK) {
    await mockDelay();
    return mapGrupalInvitationListDtoToModel(MOCK_STORE);
  }

  const data = await apiService.get<ListGrupalInvitationsResponseDto>(
    "/api/v1/grupos/mis-invitaciones",
  );

  return mapGrupalInvitationListDtoToModel(data);
}

export async function acceptGrupalInvitation(
  invitationId: number,
): Promise<GrupalInvitation> {
  if (USE_MOCK) {
    await mockDelay();
    const index = MOCK_STORE.findIndex((i) => i.codigo === invitationId);
    if (index === -1) throw new Error("Invitación no encontrada");

    MOCK_STORE[index] = { ...MOCK_STORE[index], estado: "aprobado" };

    // Rechazar automáticamente las demás invitaciones pendientes (regla de negocio)
    MOCK_STORE.forEach((inv, i) => {
      if (i !== index && inv.estado === "pendiente") {
        MOCK_STORE[i] = { ...inv, estado: "rechazado" };
      }
    });

    return mapGrupalInvitationDtoToModel(MOCK_STORE[index]);
  }

  const data = await apiService.patch<GrupalInvitationDto>(
    `/api/v1/grupos/solicitud-grupo/${invitationId}/aceptar`,
  );

  return mapGrupalInvitationDtoToModel(data);
}

export async function rejectGrupalInvitation(
  invitationId: number,
): Promise<GrupalInvitation> {
  if (USE_MOCK) {
    await mockDelay();
    const index = MOCK_STORE.findIndex((i) => i.codigo === invitationId);
    if (index === -1) throw new Error("Invitación no encontrada");

    MOCK_STORE[index] = { ...MOCK_STORE[index], estado: "rechazado" };

    return mapGrupalInvitationDtoToModel(MOCK_STORE[index]);
  }

  const data = await apiService.patch<GrupalInvitationDto>(
    `/api/v1/grupos/solicitud-grupo/${invitationId}/rechazar`,
  );

  return mapGrupalInvitationDtoToModel(data);
}
