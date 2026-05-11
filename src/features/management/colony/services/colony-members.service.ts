import { apiService } from "@/services/api.services";
import { ColonyMember } from "../types/colony-members.types";

export async function listColonyMembers(
  colonyId: number,
): Promise<ColonyMember[]> {
  const data = await apiService.get<ColonyMember[]>(
    `/api/v1/usuario/colonia/${colonyId}`,
  );
  return data;
}

export async function removeColonyMember(
  colonyCodigo: number,
  memberId: number,
): Promise<void> {
  await apiService.patch<void>(
    `/api/v1/colonias/sacar-miembro/${colonyCodigo}/`,
    { miembro_id: memberId },
  );
}



