import axios from "axios";
import { UserApi, UserData, CODE_TO_ROLE } from "@/types/user.types";

const api = axios.create({
  baseURL: "/api",
  timeout: 10000,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("🚨 API Error:", {
      url: err.config?.url,
      status: err.response?.status,
      headers: err.response?.headers,
    });
    return Promise.reject(err);
  },
);

const mapFromApi = (apiUser: UserApi): UserData => ({
  ...apiUser,
  role: CODE_TO_ROLE[apiUser.codigo_rol],
});

export const authService = {
  loginByDocument: async (document: string): Promise<UserData> => {
    const { data } = await api.get<UserApi[]>("/v1/usuario/todos");

    const found = data.find((u: UserApi) => u.documento === document);

    if (!found) throw new Error("Usuario no encontrado");

    return mapFromApi(found);
  },
};
