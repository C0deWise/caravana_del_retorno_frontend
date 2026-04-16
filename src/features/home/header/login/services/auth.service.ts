import { apiService, ApiError } from "@/services/api.services";
import { UserApi, UserData, CODE_TO_ROLE } from "@/types/user.types";

const mapFromApi = (apiUser: UserApi): UserData => ({
  ...apiUser,
  role: CODE_TO_ROLE[apiUser.codigo_rol],
});

export const authService = {
  loginByDocument: async (document: string): Promise<UserData> => {
    const normalizedDocument = document.trim();

    if (!normalizedDocument) {
      throw new ApiError(400, "Debes ingresar un número de documento");
    }

    const user = await apiService.get<UserApi>(
      `/api/v1/usuario/buscar_documento/${encodeURIComponent(normalizedDocument)}`,
    );

    return mapFromApi(user);
  },
};