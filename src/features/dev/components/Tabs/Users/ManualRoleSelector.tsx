import { ShieldCheck } from "lucide-react";
import { UserRole } from "@/types/user.types";
import { DEV_ROLES } from "../../../constants/roles.constants";

interface ManualRoleSelectorProps {
  readonly apiMode: boolean;
  readonly roleOverride: UserRole | undefined;
  readonly setRoleOverride: (role: UserRole | undefined) => void;
}

export function ManualRoleSelector({ apiMode, roleOverride, setRoleOverride }: ManualRoleSelectorProps) {
  if (apiMode) return null;

  return (
    <div className="space-y-3 mt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] text-fuchsia-500/70 font-bold uppercase tracking-widest">
          <ShieldCheck size={14} />
          <span>Roles de Usuario</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-1.5">
        {DEV_ROLES.map(({ role, label, color, neon }) => (
          <button
            key={role ?? "guest"}
            type="button"
            onClick={() => setRoleOverride(role === roleOverride ? undefined : role)}
            className={`relative px-1 py-1.5 rounded-md border text-[9px] font-black transition-all duration-300 text-center ${color} ${roleOverride === role
                ? `${neon} text-white`
                : "border-zinc-800 text-zinc-500 hover:border-zinc-600"
              }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
