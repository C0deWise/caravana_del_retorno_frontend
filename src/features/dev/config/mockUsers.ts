import { UserData, UserRole } from "@/types/user.types";

const MOCK_USER_BASE: Omit<UserData, "role" | "codigo_colonia"> = {
  documento: "9999999999",
  tipo_doc: "CC",
  nombre: "Pepito",
  apellido: "Pérez MOCK",
  id: 999,
  fecha_creacion: "2026-04-08T00:00:00.000Z",
  celular: "+57 312 345 6789",
  correo: "pepitoperezMOCK@email.com",
  genero: "otro",
  fecha_nacimiento: "1969-07-20",
  pais: "Colombia",
  departamento: "Cauca",
  ciudad: "Popayan",
};

export const buildMockUsers = (
  coloniaId: number | null,
): Record<Exclude<UserRole, undefined>, UserData> => ({
  usuario: {
    ...MOCK_USER_BASE,
    role: "usuario",
    codigo_colonia: coloniaId,
  },
  lider_colonia: {
    ...MOCK_USER_BASE,
    role: "lider_colonia",
    codigo_colonia: coloniaId,
  },
  admin: {
    ...MOCK_USER_BASE,
    role: "admin",
    codigo_colonia: null,
  },
  invitado: {
    ...MOCK_USER_BASE,
    role: "invitado",
    codigo_colonia: null,
  },
});
