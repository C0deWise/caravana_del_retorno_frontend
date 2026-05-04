"use client";

import { MapPinIcon } from "@heroicons/react/24/solid";
import type { ColonyData } from "@/types/colony.types";
import { DeleteColonyButton } from "../deleteColony/components/DeleteColonyButton";
import { AssignLeaderButton } from "../assignLeader/components/AssignLeaderButton";
import ListCard from "@/components/common/ListCard";

interface ColonyCardProps {
  readonly colony: ColonyData;
  readonly index: number;
  readonly onRefresh: () => void;
}

export function ColonyCard({ colony, index, onRefresh }: ColonyCardProps) {
  const colonyName = colony.departamento
    ? `${colony.ciudad}, ${colony.departamento}`
    : colony.pais;

  const fullLocation = colony.departamento
    ? `${colonyName}, ${colony.pais}`
    : colony.pais;

  return (
    <ListCard
      index={index}
      icon={<MapPinIcon className="w-7 h-7 text-text-inverse" />}
      badgeConfig={{
        show: colony.lider === 0,
        title: "Pendiente de asignar líder",
        color: "bg-accent-red",
      }}
      title={colonyName}
      subtitle={colony.pais}
      actions={
        <>
          <AssignLeaderButton colony={colony} onRefresh={onRefresh} />
          <DeleteColonyButton
            colonyId={colony.codigo}
            fullLocation={fullLocation}
            onSuccess={onRefresh}
          />
        </>
      }
    />
  );
}

