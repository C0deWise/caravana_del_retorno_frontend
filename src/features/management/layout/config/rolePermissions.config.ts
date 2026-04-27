import { UserRole } from "@/types/user.types";

export const rolePermissions: Record<UserRole, string[]> = {
  admin: [
    "/gestion/colonia/administrar",
    "/gestion/colonia/crear",
    "/gestion/colonia/asignar-lider",
    "/gestion/retorno/crear",
  ],
  lider_colonia: [
    "/gestion/usuario/parentesco",
    "/gestion/colonia/miembros",
    "/gestion/colonia/solicitudes-ingreso",
    "/gestion/retorno/registro",
  ],
  usuario: [
    "/gestion/usuario/parentesco",
    "/gestion/colonia/inscribir-colonia",
    "/gestion/colonia/miembros",
    "/gestion/retorno/registro",
  ],
};
