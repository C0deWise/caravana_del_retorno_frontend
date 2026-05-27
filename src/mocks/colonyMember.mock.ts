import type { ColonyMember } from "@/features/management/colony/types/colony-members.types";

export const getMockColonyMembers = (targetColonyId: number): ColonyMember[] => {
  const baseMembers = [
    {
      id: 101,
      nombre: "Juan",
      apellido: "Pérez",
      codigo_colonia: 1,
      documento: "1001001001",
      tipo_doc: "CC",
      genero: "M",
      fecha_nacimiento: "1990-01-01",
      celular: "3001234567",
      correo: "juan.perez@example.com",
      role: 2 // Lider
    },
    {
      id: 102,
      nombre: "María",
      apellido: "Gómez",
      codigo_colonia: 1,
      documento: "1001001002",
      tipo_doc: "CC",
      genero: "F",
      fecha_nacimiento: "1992-05-15",
      celular: "3007654321",
      correo: "maria.gomez@example.com",
      role: 1 // Miembro
    },
    {
      id: 103,
      nombre: "Carlos",
      apellido: "López",
      codigo_colonia: 2,
      documento: "1001001003",
      tipo_doc: "CE",
      genero: "M",
      fecha_nacimiento: "1985-08-20",
      celular: "3101234567",
      correo: "carlos.lopez@example.com",
      role: 2 // Lider
    },
    {
      id: 104,
      nombre: "Ana",
      apellido: "Martínez",
      codigo_colonia: 2,
      documento: "1001001004",
      tipo_doc: "CC",
      genero: "F",
      fecha_nacimiento: "1995-11-30",
      celular: "3109876543",
      correo: "ana.martinez@example.com",
      role: 1 // Miembro
    }
  ];

  return baseMembers.filter(member => member.codigo_colonia === targetColonyId);
};
