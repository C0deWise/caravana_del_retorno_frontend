// TODO Eliminar cuando se integre con el backend

import { ColonyItem } from "@/types/colony.types";
import { Request } from "../types/request.types";

export const mockColonies: ColonyItem[] = [
  {
    codigo: 1,
    ciudad: "Bogotá",
    departamento: "Cundinamarca",
    pais: "Colombia",
  },
  {
    codigo: 2,
    ciudad: "Cali",
    departamento: "Valle del Cauca",
    pais: "Colombia",
  },
  { codigo: 3, ciudad: "", departamento: "", pais: "España" },
];

export const mockRequests: Request[] = [
  {
    requestId: 1,
    user: {
      id: 101,
      nombre: "Juan",
      apellido: "Pérez",
      celular: "1234567890",
    },
    colonyId: 1,
    requestStatus: "pendiente",
    createdAt: "2024-01-01T12:00:00Z",
  },
  {
    requestId: 2,
    user: {
      id: 102,
      nombre: "Maria",
      apellido: "Gonzales",
      celular: "1234567890",
    },
    colonyId: 1,
    requestStatus: "pendiente",
    createdAt: "2024-01-01T12:00:00Z",
  },
  {
    requestId: 3,
    user: {
      id: 103,
      nombre: "Alejandra",
      apellido: "Guzman",
      celular: "1234567890",
    },
    colonyId: 1,
    requestStatus: "pendiente",
    createdAt: "2024-01-01T12:00:00Z",
  },
  {
    requestId: 4,
    user: {
      id: 104,
      nombre: "Yiseni",
      apellido: "Perez",
      celular: "1234567890",
    },
    colonyId: 1,
    requestStatus: "aceptado",
    createdAt: "2024-01-01T12:00:00Z",
  },
  {
    requestId: 5,
    user: {
      id: 105,
      nombre: "Rose",
      apellido: "Bennet",
      celular: "1234567890",
    },
    colonyId: 1,
    requestStatus: "rechazado",
    createdAt: "2024-01-01T12:00:00Z",
  },
  {
    requestId: 6,
    user: {
      id: 106,
      nombre: "Howard",
      apellido: "Gutierrez",
      celular: "1234567890",
    },
    colonyId: 1,
    requestStatus: "pendiente",
    createdAt: "2024-01-01T12:00:00Z",
  },
];
