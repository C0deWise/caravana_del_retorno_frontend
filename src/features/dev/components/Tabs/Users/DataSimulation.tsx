import { useState } from "react";
import { Database, MapPin, ChevronDown, LogIn, LogOut } from "lucide-react";
import { UserData, UserRole } from "@/types/user.types";
import { getMockColonies } from "@/mocks/colony.mock";
import { useAuth } from "@/auth/context/AuthContext";

interface DataSimulationProps {
  readonly apiMode: boolean;
  readonly roleOverride: UserRole | undefined;
  readonly mockUserId: number | null;
  readonly setMockUserId: (id: number | null) => void;
  readonly mockColoniaId: number | null;
  readonly setMockColoniaId: (id: number | null) => void;
}

export function DataSimulation({ apiMode, roleOverride, mockUserId, mockColoniaId, setMockColoniaId }: DataSimulationProps) {
  const { user, login, logout } = useAuth();
  const [isColonyOpen, setIsColonyOpen] = useState(false);

  if (apiMode || roleOverride === undefined) return null;

  const showColoniaPicker = roleOverride === "usuario" || roleOverride === "lider_colonia";
  const colonies = getMockColonies();
  const selectedColony = colonies.find((c) => c.codigo === mockColoniaId);
  const selectedLabel = selectedColony
    ? `[${selectedColony.codigo}] ${selectedColony.pais.toLowerCase() === "colombia" ? `${selectedColony.departamento}, ${selectedColony.ciudad}` : selectedColony.pais}`
    : "-- Sin Colonia --";

  const handleMockLogin = () => {
    const mockUser: UserData = {
      ...(user ?? ({} as UserData)),
      id: mockUserId ?? 9999,
      role: roleOverride,
      codigo_colonia: mockColoniaId ?? null,
      fecha_creacion: user?.fecha_creacion ?? new Date().toISOString(),
      tipo_doc: user?.tipo_doc ?? "CC",
      documento: user?.documento ?? "0000000000",
      celular: user?.celular ?? "0000000000",
      correo: user?.correo ?? "mock@dev.com",
      nombre: user?.nombre ?? "Usuario",
      apellido: user?.apellido ?? "Mock",
      genero: user?.genero ?? "otro",
      fecha_nacimiento: user?.fecha_nacimiento ?? "2000-01-01",
      pais: user?.pais ?? "Colombia",
      departamento: user?.departamento ?? null,
      ciudad: user?.ciudad ?? null,
      codigo_retorno: user?.codigo_retorno ?? null,
    };
    login(mockUser);
  };

  return (
    <div className="space-y-3 mt-6">
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={handleMockLogin}
          className="flex items-center justify-center gap-1.5 rounded-lg border border-lime-500/40 bg-lime-500/10 px-2.5 py-2 text-[10px] font-mono font-bold text-lime-400 hover:bg-lime-500/20 transition-colors cursor-pointer"
        >
          <LogIn size={12} />
          <span>Iniciar sesión</span>
        </button>
        <button
          type="button"
          onClick={logout}
          className="flex items-center justify-center gap-1.5 rounded-lg border border-red-500/40 bg-red-500/10 px-2.5 py-2 text-[10px] font-mono font-bold text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
        >
          <LogOut size={12} />
          <span>Cerrar sesión</span>
        </button>
      </div>

      <div className="flex items-center gap-2 text-[10px] text-cyan-500/70 font-bold uppercase tracking-widest pt-1">
        <Database size={14} />
        <span>Simulación de Datos</span>
      </div>

      <div className="flex flex-col gap-2">
        <div className="space-y-1.5 min-w-0 relative">
          <span className="text-[9px] text-zinc-600 block uppercase font-bold tracking-wider">Simular Colonia</span>
          <button
            type="button"
            disabled={!showColoniaPicker}
            onClick={() => setIsColonyOpen((prev) => !prev)}
            className="w-full flex items-center justify-between gap-2 rounded-lg border border-zinc-800 bg-black/40 px-3 py-2 text-[11px] font-mono text-amber-400 hover:border-zinc-700 focus:border-amber-500/60 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <span className="flex items-center gap-2 truncate">
              <MapPin size={13} className="shrink-0 text-zinc-500" />
              <span className="truncate">{selectedLabel}</span>
            </span>
            <ChevronDown
              size={14}
              className={`shrink-0 text-zinc-500 transition-transform duration-200 ${isColonyOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isColonyOpen && showColoniaPicker && (
            <>
              <button
                type="button"
                tabIndex={-1}
                aria-label="Cerrar selector de colonia"
                onClick={() => setIsColonyOpen(false)}
                className="fixed inset-0 z-0 w-full h-full cursor-default bg-transparent border-none p-0 outline-none"
              />
              <div className="dev-dropdown-scrollbar absolute z-10 w-full mt-1 rounded-lg border border-zinc-800 bg-zinc-950 shadow-xl max-h-40 overflow-y-auto">
                <button
                  type="button"
                  onClick={() => {
                    setMockColoniaId(null);
                    setIsColonyOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-[11px] font-mono transition-colors border-b border-zinc-800/50 cursor-pointer ${
                    mockColoniaId === null
                      ? "bg-amber-500/10 text-amber-400"
                      : "text-zinc-300 hover:bg-zinc-900"
                  }`}
                >
                  -- Sin Colonia --
                </button>
                {colonies.map((colony) => {
                  const label = `[${colony.codigo}] ${colony.pais.toLowerCase() === "colombia" ? `${colony.departamento}, ${colony.ciudad}` : colony.pais}`;
                  return (
                    <button
                      key={colony.codigo}
                      type="button"
                      onClick={() => {
                        setMockColoniaId(colony.codigo);
                        setIsColonyOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-[11px] font-mono transition-colors border-b border-zinc-800/50 last:border-0 cursor-pointer truncate ${
                        mockColoniaId === colony.codigo
                          ? "bg-amber-500/10 text-amber-400"
                          : "text-zinc-300 hover:bg-zinc-900"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
