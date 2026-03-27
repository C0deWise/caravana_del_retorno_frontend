// TODO: ELiminar cuando este el back

import { Colony } from "../types/colony";
import { Member } from "../types/member";

export const mockColonies: Colony[] = [
  { id: 1, city: "Bogotá", department: "Cundinamarca", country: "Colombia" },
  { id: 2, city: "Cali", department: "Valle del Cauca", country: "Colombia" },
  { id: 3, city: "", department: "", country: "España" },
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
  const colonyId = ((i % 3) + 1) as 1 | 2 | 3;

  const firstName = `${firstNames[i % firstNames.length]} ${secondNames[i % secondNames.length]}`;
  const lastName = `${lastNames[i % lastNames.length]} ${lastNames[(i + 5) % lastNames.length]}`;
  const email = `${firstNames[i % firstNames.length].toLowerCase()}.${lastNames[i % lastNames.length].toLowerCase()}${i}@example.com`;

  return {
    id: i + 1,
    documentNumber: `${String(10000000 + i).padStart(8, "0")}`,
    documentType: "CC",
    firstName,
    lastName,
    email,
    gender: (i % 3 === 0 ? "M" : i % 3 === 1 ? "F" : "O") as Member["gender"],
    birthDate: `${1950 + (i % 56)}-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`,
    phone: `(+57) 3${String(10 + i).padStart(2, "0")} ${String(200 + i).padStart(3, "0")} ${String(300 + i).padStart(4, "0")}`,
    role,
    colonyId,
  };
});
