import { apiService } from "./api.services";
import { Retorno } from "@/types/retorno.types";

export const getRetornosService = async (): Promise<Retorno[]> => {
  return apiService.get<Retorno[]>("/api/v1/retornos/");
};
