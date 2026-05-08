import { UserRole } from "@/types/user.types";

export const rolePermissions: Record<UserRole, string[]> = {
  admin: ["/gestion/colonia/administrar", "/gestion/retorno/crear", "/gestion/publicaciones/crear"],
  lider_colonia: [
    "/gestion/usuario/parentesco",
    "/gestion/colonia/miembros",
    "/gestion/colonia/solicitudes-ingreso",
    "/gestion/retorno/registro/inscripcion",
    "/gestion/retorno/registro/cancelar",
    "/gestion/publicaciones/crear",
  ],
  usuario: [
    "/gestion/usuario/parentesco",
    "/gestion/colonia/inscribir-colonia",
    "/gestion/colonia/miembros",
    "/gestion/retorno/registro",
  ],
};
