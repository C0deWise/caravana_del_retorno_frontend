import type { ColonyData } from "@/types/colony.types";
import { normalizeString } from "@/utils/formatting";

export const sortColonies = (colonies: ColonyData[]): ColonyData[] => {
  const TARGET_COUNTRY = "colombia";

  return [...colonies].sort((a, b) => {
    const isAColombia = normalizeString(a.pais) === TARGET_COUNTRY;
    const isBColombia = normalizeString(b.pais) === TARGET_COUNTRY;

    if (isAColombia && !isBColombia) return -1;
    if (!isAColombia && isBColombia) return 1;

    if (!isAColombia && !isBColombia) {
      const countryCompare = a.pais.localeCompare(b.pais);
      if (countryCompare !== 0) return countryCompare;
    }

    const deptCompare = (a.departamento ?? "").localeCompare(b.departamento ?? "");
    if (deptCompare !== 0) return deptCompare;

    return (a.ciudad ?? "").localeCompare(b.ciudad ?? "");
  });
};

