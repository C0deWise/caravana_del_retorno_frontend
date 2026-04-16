// TODO: ELiminar cuando este el back

import { ColonyData } from "@/types/colony.types";
import { Member } from "../types/member.types";

export const mockColonies: ColonyData[] = [
  {
    codigo: 1,
    ciudad: "Bogotá",
    departamento: "Cundinamarca",
    pais: "Colombia",
    lider: 0,
  },
  {
    codigo: 2,
    ciudad: "Cali",
    departamento: "Valle del Cauca",
    pais: "Colombia",
    lider: 0,
  },
  { codigo: 3, ciudad: "", departamento: "", pais: "España", lider: 0 },
];

const firstNames = [
  "Juan",
  "Carlos",
  "Luis",
  "Andrés",
  "Jorge",
  "Mateo",
  "Santiago",
  "Daniel",
  "María",
  "Ana",
  "Laura",
  "Diana",
  "Camila",
  "Paula",
  "Valentina",
  "Sofía",
];

const secondNames = [
  "David",
  "Alejandro",
  "Fernando",
  "Esteban",
  "Felipe",
  "José",
  "Fernanda",
  "Alejandra",
  "Carolina",
  "Tatiana",
  "Isabel",
  "Juliana",
];

const lastNames = [
  "García",
  "Rodríguez",
  "Martínez",
  "López",
  "González",
  "Pérez",
  "Sánchez",
  "Ramírez",
  "Torres",
  "Flores",
  "Rivera",
  "Gómez",
];

export const mockAllMembers: Member[] = Array.from({ length: 200 }, (_, i) => {
  const role: Member["role"] = i % 10 === 0 ? "lider_colonia" : "usuario";
  const codigo_colonia = ((i % 3) + 1) as 1 | 2 | 3;

  const nombre = `${firstNames[i % firstNames.length]} ${secondNames[i % secondNames.length]}`;
  const apellido = `${lastNames[i % lastNames.length]} ${lastNames[(i + 5) % lastNames.length]}`;
  const correo = `${firstNames[i % firstNames.length].toLowerCase()}.${lastNames[i % lastNames.length].toLowerCase()}${i}@example.com`;

  return {
    id: i + 1,
    documento: `${String(10000000 + i).padStart(8, "0")}`,
    tipo_doc: "CC",
    nombre,
    apellido,
    correo,
    genero: (i % 3 === 0 ? "M" : i % 3 === 1 ? "F" : "O") as Member["genero"],
    fecha_nacimiento: `${1950 + (i % 56)}-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`,
    celular: `(+57) 3${String(10 + i).padStart(2, "0")} ${String(200 + i).padStart(3, "0")} ${String(300 + i).padStart(4, "0")}`,
    role,
    codigo_colonia,
  };
});
