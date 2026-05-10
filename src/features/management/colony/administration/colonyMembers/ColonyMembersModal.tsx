"use client";

import { useState } from "react";
import { UserIcon, XMarkIcon } from "@heroicons/react/24/solid";
import Spinner from "@/components/feedback/Spinner";
import { AnimatedList } from "@/components/common/AnimatedList";
import type { ColonyData } from "@/types/colony.types";
import { useColonyMembers } from "@/features/management/colony/hooks/useColonyMembers";
import { ColonyMembersHeader } from "./ColonyMembersHeader";
import { MemberListItem } from "./MemberListItem";

interface ColonyMembersModalProps {
  readonly colony: ColonyData;
  readonly onClose: () => void;
}

export function ColonyMembersModal({ colony, onClose }: ColonyMembersModalProps) {
  const { members, isLoading, error, totalMembers } = useColonyMembers(colony.codigo);
  const [expandedMemberId, setExpandedMemberId] = useState<number | null>(null);

  const fullLocation = colony.departamento
    ? `${colony.ciudad}, ${colony.departamento}, ${colony.pais}`
    : colony.pais;

  const toggleExpand = (id: number) => {
    setExpandedMemberId((prev) => (prev === id ? null : id));
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full py-12 gap-4">
          <Spinner size="lg" />
          <p className="text-sm font-medium text-text-muted animate-pulse">
            Recuperando información de miembros...
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <div className="w-16 h-16 bg-accent-red/10 rounded-full flex items-center justify-center mb-4">
            <XMarkIcon className="w-8 h-8 text-accent-red" />
          </div>
          <p className="text-sm text-text-muted">{error}</p>
        </div>
      );
    }

    if (members.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <div className="w-16 h-16 bg-bg-card rounded-full flex items-center justify-center mb-4">
            <UserIcon className="w-8 h-8 text-text-muted" />
          </div>
          <p className="text-sm text-text-muted font-medium">
            Esta colonia no tiene miembros registrados aún.
          </p>
        </div>
      );
    }

    return (
      <AnimatedList
        items={members}
        keyExtractor={(member) => member.id.toString()}
        renderItem={(member) => (
          <MemberListItem 
            member={member}
            isExpanded={expandedMemberId === member.id}
            onToggle={toggleExpand}
          />
        )}
      />
    );
  };

  return (
    <div className="flex flex-col h-[80vh] max-h-[700px] w-full bg-bg overflow-hidden rounded-2xl shadow-2xl">
      <ColonyMembersHeader 
        fullLocation={fullLocation}
        isLoading={isLoading}
        error={error}
        totalMembers={totalMembers}
      />

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {renderContent()}
      </div>

      <footer className="p-4 border-t border-bg-border bg-bg-card/50">
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl font-bold border border-bg-border text-text hover:bg-bg-card transition-all active:scale-95"
        >
          Cerrar
        </button>
      </footer>
    </div>
  );
}
