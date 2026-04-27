import { apiService, ApiError } from "@/services/api.services";
import { UserApi, UserData, CODE_TO_ROLE } from "@/types/user.types";

const mapFromApi = (apiUser: UserApi): UserData => {
  const { codigo_rol, ...rest } = apiUser;
  return {
    ...rest,
    role: CODE_TO_ROLE[codigo_rol],
  };
};

export const authService = {
  loginByDocument: async (document: string): Promise<UserData> => {
    const normalizedDocument = document.trim();

    if (!normalizedDocument) {
      throw new ApiError(400, "Debes ingresar un número de documento");
    }

    const usuarios = await apiService.get<UserApi[]>("/api/v1/usuario/todos");

    const found = usuarios.find((u) => u.documento === normalizedDocument);

    if (!found) {
      throw new ApiError(
        404,
        "No se encontró ningún usuario con ese documento",
      );
    }

    return mapFromApi(found);
  },
};
