import { Database, Fingerprint, MapPin, X } from "lucide-react";
import { UserRole } from "@/types/user.types";

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

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1.5 min-w-0">
          <span className="text-[9px] text-zinc-600 block uppercase font-bold tracking-wider">ID Usuario</span>
          <div className="relative group">
            <Fingerprint size={14} className="absolute left-2.5 top-2.5 text-zinc-600 group-focus-within:text-cyan-500 transition-colors" />
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={mockUserId ?? ""}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "");
                setMockUserId(val ? Number(val) : null);
              }}
              className="w-full min-w-0 bg-zinc-900 border border-zinc-800 rounded-lg pl-7 pr-8 py-2 text-xs text-cyan-400 focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-zinc-800"
              placeholder="000"
            />
            {mockUserId !== null && (
              <button
                onClick={() => setMockUserId(null)}
                className="absolute right-1 top-1 bottom-1 px-1.5 rounded-md bg-zinc-800/40 border border-zinc-700/50 hover:border-rose-500/50 text-zinc-500 hover:text-rose-500 transition-all flex items-center justify-center"
                title="Limpiar"
              >
                <X size={10} strokeWidth={3} />
              </button>
            )}
          </div>
        </div>

        <div className="space-y-1.5 min-w-0">
          <span className="text-[9px] text-zinc-600 block uppercase font-bold tracking-wider">ID Colonia</span>
          <div className="relative group w-full">
            <MapPin size={14} className="absolute left-2.5 top-2.5 text-zinc-600 group-focus-within:text-amber-500 transition-colors" />
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={mockColoniaId ?? ""}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "");
                setMockColoniaId(val ? Number(val) : null);
              }}
              className="w-full min-w-0 bg-zinc-900 border border-zinc-800 rounded-lg pl-7 pr-8 py-2 text-xs text-amber-400 focus:outline-none focus:border-amber-500/50 transition-all placeholder:text-zinc-800 disabled:opacity-50"
              placeholder="NUL"
              disabled={!showColoniaPicker}
            />
            {mockColoniaId !== null && (
              <button
                onClick={() => setMockColoniaId(null)}
                className="absolute right-1 top-1 bottom-1 px-1.5 rounded-md bg-zinc-800/40 border border-zinc-700/50 hover:border-rose-500/50 text-zinc-500 hover:text-rose-500 transition-all flex items-center justify-center"
                title="Limpiar"
              >
                <X size={10} strokeWidth={3} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
