import type { ColonyData } from "@/types/colony.types";

export const getMockColonies = (): ColonyData[] => {
  return [
    {
      codigo: 1,
      pais: "Colombia",
      departamento: "Antioquia",
      ciudad: "Medellín",
      lider: 101,
      estado: "activa"
    },
    {
      codigo: 2,
      pais: "Colombia",
      departamento: "Bogotá",
      ciudad: "Bogotá D.C.",
      lider: 101,
      estado: "activa"
    },
    {
      codigo: 3,
      pais: "España",
      departamento: "Madrid",
      ciudad: "Madrid",
      lider: 101,
      estado: "inactiva"
    }
  ];
};
