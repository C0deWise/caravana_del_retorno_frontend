import { RelationshipItem, formatKinshipType } from "../types/relationship.type";

export const getMockRelationships = (targetUserId: number): RelationshipItem[] => {
  const rawMocks: RelationshipItem[] = [
    // Mis Parentescos (aceptada)
    { codigo: "mock-1", user: { id: targetUserId, nombre: "Usuario", apellido: "Actual" }, relatedUser: { id: 9001, nombre: "María", apellido: "Gómez" }, relationshipType: "Madre", status: "aceptada" },
    { codigo: "mock-2", user: { id: 9002, nombre: "Carlos", apellido: "Pérez" }, relatedUser: { id: targetUserId, nombre: "Usuario", apellido: "Actual" }, relationshipType: "hermano (a)", status: "aceptada" },
    { codigo: "mock-3", user: { id: targetUserId, nombre: "Usuario", apellido: "Actual" }, relatedUser: { id: 9003, nombre: "Ana", apellido: "López" }, relationshipType: "Cónyuge", status: "aceptada" },
    { codigo: "mock-4", user: { id: 9004, nombre: "Roberto", apellido: "Pérez" }, relatedUser: { id: targetUserId, nombre: "Usuario", apellido: "Actual" }, relationshipType: "Padre", status: "aceptada" },
    { codigo: "mock-5", user: { id: targetUserId, nombre: "Usuario", apellido: "Actual" }, relatedUser: { id: 9005, nombre: "Laura", apellido: "Pérez" }, relationshipType: "Hijo (a)", status: "aceptada" },
    { codigo: "mock-6", user: { id: targetUserId, nombre: "Usuario", apellido: "Actual" }, relatedUser: { id: 9006, nombre: "Pedro", apellido: "Pérez" }, relationshipType: "Hijo (a)", status: "aceptada" },
    { codigo: "mock-7", user: { id: 9007, nombre: "Lucía", apellido: "Mendoza" }, relatedUser: { id: targetUserId, nombre: "Usuario", apellido: "Actual" }, relationshipType: "Abuelo (a)", status: "aceptada" },
    { codigo: "mock-8", user: { id: targetUserId, nombre: "Usuario", apellido: "Actual" }, relatedUser: { id: 9008, nombre: "Andrés", apellido: "Silva" }, relationshipType: "Primo (a)", status: "aceptada" },

    // Solicitudes Recibidas (pendiente, relatedUser es el usuario actual)
    { codigo: "mock-req-rec-1", user: { id: 9101, nombre: "Luis", apellido: "García" }, relatedUser: { id: targetUserId, nombre: "Usuario", apellido: "Actual" }, relationshipType: "Primo (a)", status: "pendiente" },
    { codigo: "mock-req-rec-2", user: { id: 9102, nombre: "Carmen", apellido: "Fernández" }, relatedUser: { id: targetUserId, nombre: "Usuario", apellido: "Actual" }, relationshipType: "Tío (a)", status: "pendiente" },
    { codigo: "mock-req-rec-3", user: { id: 9103, nombre: "Jorge", apellido: "Ramírez" }, relatedUser: { id: targetUserId, nombre: "Usuario", apellido: "Actual" }, relationshipType: "hermano (a)", status: "pendiente" },
    { codigo: "mock-req-rec-4", user: { id: 9104, nombre: "Elena", apellido: "Sánchez" }, relatedUser: { id: targetUserId, nombre: "Usuario", apellido: "Actual" }, relationshipType: "Primo (a)", status: "pendiente" },
    { codigo: "mock-req-rec-5", user: { id: 9105, nombre: "Mario", apellido: "Torres" }, relatedUser: { id: targetUserId, nombre: "Usuario", apellido: "Actual" }, relationshipType: "Sobrino (a)", status: "pendiente" },
    { codigo: "mock-req-rec-6", user: { id: 9106, nombre: "Sofia", apellido: "Castro" }, relatedUser: { id: targetUserId, nombre: "Usuario", apellido: "Actual" }, relationshipType: "Primo (a)", status: "pendiente" },
    { codigo: "mock-req-rec-7", user: { id: 9107, nombre: "Ricardo", apellido: "Ruiz" }, relatedUser: { id: targetUserId, nombre: "Usuario", apellido: "Actual" }, relationshipType: "Tío (a)", status: "pendiente" },
    { codigo: "mock-req-rec-8", user: { id: 9108, nombre: "Patricia", apellido: "Vargas" }, relatedUser: { id: targetUserId, nombre: "Usuario", apellido: "Actual" }, relationshipType: "Primo (a)", status: "pendiente" },

    // Solicitudes Enviadas (pendiente, user es el usuario actual)
    { codigo: "mock-req-sent-1", user: { id: targetUserId, nombre: "Usuario", apellido: "Actual" }, relatedUser: { id: 9201, nombre: "Beatriz", apellido: "Luna" }, relationshipType: "Hijo (a)", status: "pendiente" },
    { codigo: "mock-req-sent-2", user: { id: targetUserId, nombre: "Usuario", apellido: "Actual" }, relatedUser: { id: 9202, nombre: "Fernando", apellido: "Ríos" }, relationshipType: "Padre", status: "pendiente" },
    { codigo: "mock-req-sent-3", user: { id: targetUserId, nombre: "Usuario", apellido: "Actual" }, relatedUser: { id: 9203, nombre: "Marta", apellido: "Soto" }, relationshipType: "Madre", status: "pendiente" },
    { codigo: "mock-req-sent-4", user: { id: targetUserId, nombre: "Usuario", apellido: "Actual" }, relatedUser: { id: 9204, nombre: "Gabriel", apellido: "Díaz" }, relationshipType: "Hermano (a)", status: "pendiente" },
    { codigo: "mock-req-sent-5", user: { id: targetUserId, nombre: "Usuario", apellido: "Actual" }, relatedUser: { id: 9205, nombre: "Isabel", apellido: "Mejía" }, relationshipType: "Cónyuge", status: "pendiente" },
    { codigo: "mock-req-sent-6", user: { id: targetUserId, nombre: "Usuario", apellido: "Actual" }, relatedUser: { id: 9206, nombre: "Hugo", apellido: "Molina" }, relationshipType: "Abuelo (a)", status: "pendiente" },
    { codigo: "mock-req-sent-7", user: { id: targetUserId, nombre: "Usuario", apellido: "Actual" }, relatedUser: { id: 9207, nombre: "Clara", apellido: "Ortiz" }, relationshipType: "Sobrino (a)", status: "pendiente" },
    { codigo: "mock-req-sent-8", user: { id: targetUserId, nombre: "Usuario", apellido: "Actual" }, relatedUser: { id: 9208, nombre: "Oscar", apellido: "Herrera" }, relationshipType: "Primo (a)", status: "pendiente" },
  ];

  return rawMocks.map(mock => ({
    ...mock,
    relationshipType: formatKinshipType(mock.relationshipType)
  }));
};
