import axios from "axios";
import { UserApi, UserData, CODE_TO_ROLE } from "@/types/user.types";

// Datos mock --> Eliminar tras probar con la API real
const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === "true";

const MOCK_USER: UserData = {
  id: 101,
  fecha_creacion: "2026-01-01T00:00:00.000Z",
  tipo_doc: "CC",
  documento: "1234567890",
  celular: "3000000000",
  correo: "mock.user@caravana.local",
  codigo_colonia: 1,
  nombre: "Usuario",
  apellido: "Mock",
  genero: "otro",
  fecha_nacimiento: "1990-01-01",
  pais: "Colombia",
  departamento: "Cundinamarca",
  ciudad: "Bogota",
  role: "usuario",
};
// ----------------------------------------------------

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

    //Datos mock --> Eliminar tras probar con la API real
    if (USE_MOCKS) {
      if (document !== MOCK_USER.documento) {
        throw new Error("Usuario mock no encontrado");
      }

      return { ...MOCK_USER };
    }
    // ------------------------------------------------

    const { data } = await api.get<UserApi[]>("/v1/usuario/todos");

    const found = data.find((u: UserApi) => u.documento === document);

    if (!found) throw new Error("Usuario no encontrado");

    return mapFromApi(found);
  },
};
