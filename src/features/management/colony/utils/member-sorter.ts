import { ColonyMember } from "../types/colony-members.types";
import { ROLE_TO_CODE } from "@/types/user.types";

/**
 * Ordena una lista de miembros de colonia priorizando al líder.
 * @param members Lista de miembros a ordenar.
 * @returns Nueva lista ordenada.
 */
export const sortColonyMembers = (members: ColonyMember[]): ColonyMember[] => {
  const LEADER_ROLE_CODE = ROLE_TO_CODE.lider_colonia;

  return [...members].sort((a, b) => {
    const isALeader = a.role === LEADER_ROLE_CODE;
    const isBLeader = b.role === LEADER_ROLE_CODE;

    if (isALeader && !isBLeader) return -1;
    if (!isALeader && isBLeader) return 1;

    // Orden secundario por nombre
    return (a.nombre ?? "").localeCompare(b.nombre ?? "");
  });
};
