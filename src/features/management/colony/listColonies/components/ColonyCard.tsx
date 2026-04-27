"use client";

import { MapPinIcon, UserIcon } from "@heroicons/react/24/solid";
import type { ColonyItem } from "@/types/colony.types";
import { DeleteColonyButton } from "../../deleteColony/components/DeleteColonyButton";
import { AssignLeaderButton } from "../../assignLeader/components/AssignLeaderButton";

interface ColonyCardProps {
  readonly colony: ColonyItem;
  readonly index: number;
  readonly onRefresh: () => void;
}

export function ColonyCard({ colony, index, onRefresh }: ColonyCardProps) {
  const colonyName = colony.departamento
    ? `${colony.ciudad}, ${colony.departamento}`
    : colony.pais;

  return (
    <div className="bg-bg border border-gray-100 rounded-4xl px-5 py-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <span className="text-lg font-mono text-text-muted w-6 text-center shrink-0">
            {index + 1}
          </span>
          <div className="w-14 h-14 bg-linear-to-tl from-primary/90 to-secondary/90 rounded-xl flex items-center justify-center shadow-md shrink-0">
            <MapPinIcon className="w-7 h-7 text-text-inverse" />
          </div>
          <div>
            <h3 className="font-bold text-xl text-text">{colonyName}</h3>
            <div className="flex items-center text-sm text-text-muted mt-1">
              <span className="font-medium text-secondary mr-2">{colony.pais}</span>
              {colony.lider > 0 ? (
                <span className="flex items-center bg-accent-green/10 text-accent-green px-2 py-0.5 rounded-full text-xs font-semibold">
                  <UserIcon className="w-3 h-3 mr-1" />
                  Con Líder
                </span>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="flex items-center bg-accent-red/10 text-accent-red px-2 py-0.5 rounded-full text-xs font-semibold animate-pulse shadow-sm">
                    <UserIcon className="w-3 h-3 mr-1" />
                    Sin Líder
                  </span>
                  <AssignLeaderButton colony={colony} onRefresh={onRefresh} />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <DeleteColonyButton
            colonyId={colony.codigo}
            colonyName={colonyName}
            onSuccess={onRefresh}
          />
        </div>
      </div>
    </div>
  );
}
