import { Users } from "lucide-react";
import { useState } from "react";
import { UserData } from "@/types/user.types";
import { useDevUsers } from "../../../hooks/useDevUsers";

interface ApiUserSearchProps {
  readonly apiMode: boolean;
  readonly onLogin: (user: UserData) => void;
}

export function ApiUserSearch({ apiMode, onLogin }: ApiUserSearchProps) {
  const [fetchUsersEnabled, setFetchUsersEnabled] = useState(false);
  const { realUsers, isLoadingUsers } = useDevUsers(apiMode && fetchUsersEnabled);

  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!apiMode) return null;

  const filteredUsers = realUsers.filter(u =>
    `${u.nombre} ${u.apellido} ${u.documento}`.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  return (
    <div className="space-y-3 mt-6">
      <div className="flex items-center gap-2 text-[10px] text-lime-500/70 font-bold uppercase tracking-widest">
        <Users size={14} />
        <span>Seleccionar Usuario Real</span>
      </div>
      {!fetchUsersEnabled ? (
        <button
          type="button"
          onClick={() => setFetchUsersEnabled(true)}
          className="w-full rounded-lg border border-zinc-800 bg-black/40 px-3 py-2 text-[10px] font-mono text-lime-400 hover:border-lime-500/50 hover:bg-zinc-900 transition-all cursor-pointer"
        >
          Buscar usuarios disponibles
        </button>
      ) : isLoadingUsers ? (
        <div className="text-xs text-zinc-500 italic">Cargando usuarios...</div>
      ) : (
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar usuario por nombre o documento..."
            value={userSearchQuery}
            onChange={e => {
              setUserSearchQuery(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-lime-400 focus:outline-none focus:border-lime-500/50 transition-all placeholder:text-zinc-600"
          />
          {isDropdownOpen && (
            <>
              <button
                type="button"
                tabIndex={-1}
                className="fixed inset-0 z-0 w-full h-full cursor-default bg-transparent border-none p-0 outline-none"
                onClick={() => setIsDropdownOpen(false)}
                aria-label="Cerrar sugerencias"
              />
              <div className="dev-dropdown-scrollbar absolute z-10 w-full mt-1 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl max-h-40 overflow-y-auto">
                {filteredUsers.length === 0 ? (
                  <div className="p-3 text-xs text-zinc-500 italic">No se encontraron usuarios</div>
                ) : (
                  filteredUsers.map(u => (
                    <button
                      key={u.documento}
                      onClick={() => {
                        onLogin(u);
                        setIsDropdownOpen(false);
                        setUserSearchQuery("");
                      }}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-zinc-800 transition-colors border-b border-zinc-800/50 last:border-0"
                    >
                      <div className="text-zinc-300 font-bold">{u.nombre} {u.apellido}</div>
                      <div className="text-zinc-500">{u.documento} - <span className="text-lime-500/70 uppercase">{u.role}</span></div>
                    </button>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
