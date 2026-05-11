import type { ColonyData } from "@/types/colony.types";

export const formatColonyLabel = (colony: ColonyData): string =>
  colony.departamento
    ? `${colony.ciudad}, ${colony.departamento}, ${colony.pais}`
    : colony.pais;

