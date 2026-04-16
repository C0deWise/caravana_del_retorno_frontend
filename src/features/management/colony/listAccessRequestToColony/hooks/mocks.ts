// TODO Eliminar cuando se integre con el backend

import { Colony } from '../types/colony.types';
import { Request } from '../types/request.types';

export const mockColonies: Colony[] = [
  { id: 1, city: "Bogotá", department: "Cundinamarca", country: "Colombia" },
  { id: 2, city: "Cali", department: "Valle del Cauca", country: "Colombia" },
  { id: 3, city: "", department: "", country: "España" },
];

export const mockRequests: Request[] = [
  { 
    requestId: 1, 
    user: {
      codigo: "101",
      nombre: "Juan",
      apellido: "Pérez",
      celular: "1234567890"
    }, 
    colonyId: 1, 
    requestStatus: "pendiente", 
    createdAt: "2024-01-01T12:00:00Z" 
  },
  { 
    requestId: 2, 
    user: {
      codigo: "102",
      nombre: "Maria",
      apellido: "Gonzales",
      celular: "1234567890"
    }, 
    colonyId: 1, 
    requestStatus: "pendiente", 
    createdAt: "2024-01-01T12:00:00Z" 
  },
  { 
    requestId: 3, 
    user: {
      codigo: "103",
      nombre: "Alejandra",
      apellido: "Guzman",
      celular: "1234567890"
    }, 
    colonyId: 1, 
    requestStatus: "pendiente", 
    createdAt: "2024-01-01T12:00:00Z" 
  },
  { 
    requestId: 4, 
    user: {
      codigo: "104",
      nombre: "Yiseni",
      apellido: "Perez",
      celular: "1234567890"
    }, 
    colonyId: 1, 
    requestStatus: "aceptado", 
    createdAt: "2024-01-01T12:00:00Z" 
  },
  { 
    requestId: 5, 
    user: {
      codigo: "105",
      nombre: "Rose",
      apellido: "Bennet",
      celular: "1234567890"
    }, 
    colonyId: 1, 
    requestStatus: "rechazado", 
    createdAt: "2024-01-01T12:00:00Z" 
  },
  { 
    requestId: 6, 
    user: {
      codigo: "106",
      nombre: "Howard",
      apellido: "Gutierrez",
      celular: "1234567890"
    }, 
    colonyId: 1, 
    requestStatus: "pendiente", 
    createdAt: "2024-01-01T12:00:00Z" 
  },
];