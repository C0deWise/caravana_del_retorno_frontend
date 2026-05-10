import { UserIcon, ChevronDownIcon, CakeIcon, IdentificationIcon, CalendarDaysIcon, PhoneIcon, EnvelopeIcon } from "@heroicons/react/24/solid";
import { MarqueeText } from "@/components/common/MarqueeText";
import { RoleTag } from "@/components/common/RoleTag";
import { ExpandableContent } from "@/components/layout/ExpandableContent";
import { calculateAge } from "@/utils/formatting";
import { CODE_TO_ROLE } from "@/types/user.types";
import { ColonyMember } from "../../types/colony-members.types";
import { MemberDetailCard } from "./MemberDetailCard";

interface MemberListItemProps {
  readonly member: ColonyMember;
  readonly isExpanded: boolean;
  readonly onToggle: (id: number) => void;
}

export function MemberListItem({ member, isExpanded, onToggle }: MemberListItemProps) {
  const roleName = CODE_TO_ROLE[member.role as keyof typeof CODE_TO_ROLE];
  const isAdmin = roleName === "admin";

  return (
    <div 
      className={`group flex flex-col rounded-xl border transition-all duration-300 mb-2 last:mb-0 overflow-hidden ${
        isExpanded 
          ? "bg-primary/5 border-primary/20 shadow-md shadow-primary/5" 
          : "bg-bg border-transparent hover:bg-bg-card hover:border-bg-border"
      }`}
    >
      <button 
        onClick={() => onToggle(member.id)}
        className="flex items-center gap-4 p-3 w-full text-left transition-colors"
      >
        <div className="relative shrink-0">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
            isExpanded ? "bg-primary text-text-inverse scale-110" : "bg-bg-card border border-bg-border text-primary"
          }`}>
            {member.nombre ? (
              <span className="text-sm font-bold">
                {member.nombre.charAt(0)}{member.apellido?.charAt(0)}
              </span>
            ) : (
              <UserIcon className="w-5 h-5" />
            )}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <MarqueeText 
            text={`${member.nombre} ${member.apellido}`}
            className={`text-sm font-bold transition-colors ${
              isExpanded ? "text-primary" : "text-text group-hover:text-primary"
            }`}
          />
          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <CakeIcon className="w-3 h-3 text-secondary" />
            <span>{calculateAge(member.fecha_nacimiento)} años</span>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-3">
          <RoleTag roleId={member.role} />
          <ChevronDownIcon className={`w-4 h-4 text-text-muted transition-transform duration-300 ${
            isExpanded ? "rotate-180 text-primary" : ""
          }`} />
        </div>
      </button>

      <ExpandableContent isOpen={isExpanded} className="px-3">
        <div className={`pt-3 grid gap-2 border-t border-primary/10 ${isAdmin ? "grid-cols-1" : "grid-cols-2"}`}>
          {!isAdmin && (
            <>
              <MemberDetailCard 
                label="Identificación"
                value={`${member.tipo_doc} ${member.documento}`}
                copyValue={member.documento}
                icon={IdentificationIcon}
              />

              <MemberDetailCard 
                label="Género"
                value={member.genero}
                icon={UserIcon}
              />

              <MemberDetailCard 
                label="Nacimiento"
                value={member.fecha_nacimiento}
                copyValue={member.fecha_nacimiento}
                icon={CalendarDaysIcon}
              />

              <MemberDetailCard 
                label="Celular"
                value={member.celular}
                copyValue={member.celular}
                icon={PhoneIcon}
              />
            </>
          )}

          <MemberDetailCard 
            label="Correo Electrónico"
            value={member.correo || 'No registrado'}
            copyValue={member.correo}
            icon={EnvelopeIcon}
            fullWidth
          />
        </div>
      </ExpandableContent>
    </div>
  );
}
