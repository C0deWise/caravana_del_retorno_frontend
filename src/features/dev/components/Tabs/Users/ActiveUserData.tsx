import { Terminal } from "lucide-react";
import { UserData } from "@/types/user.types";
import { Fragment } from "react";

interface ActiveUserDataProps {
  readonly user: UserData | null;
  readonly apiMode: boolean;
  readonly loadingColony: boolean;
  readonly fetchedColony: any;
}

export function ActiveUserData({ user, apiMode, loadingColony, fetchedColony }: ActiveUserDataProps) {
  if (!user) return null;

  const getColonyDisplayString = () => {
    if (!apiMode) return "Colonia Simulada";
    if (loadingColony) return "Cargando...";
    if (fetchedColony) {
      return [fetchedColony.ciudad, fetchedColony.departamento, fetchedColony.pais]
        .filter(Boolean)
        .join(", ");
    }
    return "Desconocida";
  };

  const getColonyTitleString = () => {
    if (!apiMode) return "Colonia Simulada (Mock)";
    if (fetchedColony) {
      return [fetchedColony.ciudad, fetchedColony.departamento, fetchedColony.pais]
        .filter(Boolean)
        .join(", ");
    }
    return "Cargando...";
  };

  return (
    <div className="bg-black/50 border border-zinc-800/50 rounded-xl p-4 space-y-2.5 relative mt-6">
      <div className="flex items-center gap-2 text-[10px] text-zinc-600 font-bold uppercase tracking-widest mb-1">
        <Terminal size={14} />
        <span>Datos del Usuario Activo</span>
      </div>

      <div className="space-y-2 text-[10px] max-h-52 overflow-y-auto pr-2 dev-dropdown-scrollbar">
        {Object.entries(user)
          .sort(([keyA], [keyB]) => {
            const order = [
              "id",
              "nombre",
              "apellido",
              "role",
              "codigo_colonia",
              "tipo_doc",
              "documento",
              "ciudad",
              "departamento",
              "pais",
              "correo",
              "celular",
              "fecha_nacimiento",
              "genero",
              "fecha_creacion"
            ];
            const indexA = order.indexOf(keyA);
            const indexB = order.indexOf(keyB);
            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
            if (indexA !== -1) return -1;
            if (indexB !== -1) return 1;
            return keyA.localeCompare(keyB);
          })
          .map(([key, value]) => {
            let displayValue = "";
            if (value === null || value === undefined) {
              displayValue = "null";
            } else if (typeof value === "string") {
              displayValue = value;
            } else if (typeof value === "number" || typeof value === "boolean") {
              displayValue = value.toString();
            } else {
              displayValue = JSON.stringify(value);
            }
            const isRole = key === "role";
            return (
              <Fragment key={key}>
                <div className="flex justify-between items-center group border-b border-zinc-800/30 pb-1 last:border-0">
                  <span className="text-zinc-600 group-hover:text-zinc-400 transition-colors uppercase whitespace-nowrap">{key}:</span>
                  <span
                    className={isRole ? "text-lime-500 font-black underline decoration-lime-500/30" : "text-zinc-300 font-mono text-right truncate max-w-[60%]"}
                    title={displayValue}
                  >
                    {isRole ? displayValue.toUpperCase() : displayValue}
                  </span>
                </div>
                {key === "codigo_colonia" && value !== null && (
                  <div className="flex justify-between items-center group border-b border-zinc-800/30 pb-1 last:border-0 bg-amber-500/5 px-1 rounded">
                    <span className="text-zinc-500 group-hover:text-amber-500/70 transition-colors uppercase whitespace-nowrap text-[9px]">↳ COLONIA:</span>
                    <span className="text-amber-400 font-mono text-right truncate max-w-[65%] text-[9px]" title={getColonyTitleString()}>
                      {getColonyDisplayString()}
                    </span>
                  </div>
                )}
              </Fragment>
            );
          })}
      </div>
    </div>
  );
}
