import { UserRole } from "@/types/user.types";

export const rolePermissions: Record<UserRole, string[]> = {
  admin: [
    "/gestion/colonia/administrar",
    "/gestion/retorno/administrar",
    "/gestion/publicaciones/administrar",
  ],
  lider_colonia: [
    "/gestion/usuario/parentesco",
    "/gestion/colonia/miembros",
    "/gestion/colonia/solicitudes-ingreso",
    "/gestion/retorno/registro",
    "/gestion/retorno/grupos",
    "/gestion/reportes",
    "/gestion/publicaciones/administrar",
  ],
  usuario: [
    "/gestion/usuario/parentesco",
    "/gestion/colonia/inscribir-colonia",
    "/gestion/colonia/miembros",
    "/gestion/retorno/registro",
    "/gestion/retorno/grupos",
  ],
  invitado: [],
};
