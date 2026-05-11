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
  colonyId: number,
  memberId: number,
): Promise<void> {
  await apiService.delete<void>(
    `/api/v1/usuario/colonia/${colonyId}/${memberId}`, // TODO: Cambiar a la api real cuando este disponible
  );
}
