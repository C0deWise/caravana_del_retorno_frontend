import { Database, MapPin, ChevronDown } from "lucide-react";
import { UserRole } from "@/types/user.types";
import { getMockColonies } from "@/mocks/colony.mock";

interface DataSimulationProps {
  readonly apiMode: boolean;
  readonly roleOverride: UserRole | undefined;
  readonly mockUserId: number | null;
  readonly setMockUserId: (id: number | null) => void;
  readonly mockColoniaId: number | null;
  readonly setMockColoniaId: (id: number | null) => void;
}

export function DataSimulation({ apiMode, roleOverride, mockUserId, setMockUserId, mockColoniaId, setMockColoniaId }: DataSimulationProps) {
  if (apiMode || roleOverride === undefined) return null;

  const showColoniaPicker = roleOverride === "usuario" || roleOverride === "lider_colonia";

  return (
    <div className="space-y-3 mt-6">
      <div className="flex items-center gap-2 text-[10px] text-cyan-500/70 font-bold uppercase tracking-widest">
        <Database size={14} />
        <span>Simulación de Datos</span>
      </div>

      <div className="flex flex-col gap-2">
        <div className="space-y-1.5 min-w-0">
          <span className="text-[9px] text-zinc-600 block uppercase font-bold tracking-wider">Simular Colonia</span>
          <div className="relative group w-full">
            <MapPin size={14} className="absolute left-2.5 top-2.5 text-zinc-600 group-focus-within:text-amber-500 transition-colors pointer-events-none z-10" />
            <select
              value={mockColoniaId ?? ""}
              onChange={(e) => {
                const val = e.target.value;
                setMockColoniaId(val ? Number(val) : null);
              }}
              className="w-full min-w-0 bg-zinc-900 border border-zinc-800 rounded-lg pl-7 pr-8 py-2 text-xs text-amber-400 focus:outline-none focus:border-amber-500/50 transition-all appearance-none disabled:opacity-50"
              disabled={!showColoniaPicker}
            >
              <option value="">-- Sin Colonia --</option>
              {getMockColonies().map((colony) => (
                <option key={colony.codigo} value={colony.codigo}>
                  [{colony.codigo}] {colony.pais.toLowerCase() === "colombia" ? `${colony.departamento}, ${colony.ciudad}` : colony.pais}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-2.5 text-zinc-600 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
