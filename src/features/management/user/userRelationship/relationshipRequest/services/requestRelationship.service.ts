import { apiService } from "@/services/api.services";
import { RequestRelationshipDto } from "../types/requestRelationship.type";

export const requestRelationshipService = async (
  payload: RequestRelationshipDto,
): Promise<void> => {
  await apiService.post("/api/v1/usuario/solicitar-parentesco", payload);
};
