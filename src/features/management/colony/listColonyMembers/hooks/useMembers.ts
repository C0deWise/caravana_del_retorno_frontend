import { useState, useCallback } from "react";
import { Colony } from "../types/colony";
import { Member } from "../types/member";

const mockColonies: Colony[] = [
  {
    id: 1,
    city: "Bogotá",
    department: "Cundinamarca",
    country: "Colombia",
  },
  {
    id: 2,
    city: "Cali",
    department: "Valle del Cauca",
    country: "Colombia",
  },
  {
    id: 3,
    city: "",
    department: "",
    country: "España",
  },
];

const mockAllMembers: Member[] = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  documentNumber: `CC${String(10000000 + i).padStart(8, "0")}`,
  documentType: "CC",
  firstName: `First${i + 1}`,
  lastName: `Last${i + 1}`,
  gender: (i % 2 === 0 ? "M" : "F") as "M" | "F",
  birthDate: "1990-01-01",
  phone: `+573001${String(1000000 + i).padStart(7, "0")}`,
  role: ["usuario", "lider_colonia", "admin"][i % 3] as
    | "usuario"
    | "lider_colonia"
    | "admin",
  colonyId: ((i % 3) + 1) as 1 | 2 | 3,
}));

export function useMembers(colonyId: number) {
  const [members, setMembers] = useState<Member[]>([]);
  const [page, setPage] = useState(1);
  const limit = 20;

  const colony = mockColonies.find((c) => c.id === colonyId);
  const colonyLabel = colony
    ? colony.city && colony.department
      ? `${colony.city}, ${colony.department}`
      : colony.country
    : "Colony not found";

  const loadMore = useCallback(() => {
    const filtered = mockAllMembers.filter((m) => m.colonyId === colonyId);
    const newMembers = filtered.slice(0, page * limit);
    setMembers(newMembers);
    setPage((p) => p + 1);
  }, [colonyId, page]);

  const hasMore =
    page * limit < mockAllMembers.filter((m) => m.colonyId === colonyId).length;

  return {
    members,
    loadMore,
    hasMore,
    colonyLabel,
    colony,
  };
}
