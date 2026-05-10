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
