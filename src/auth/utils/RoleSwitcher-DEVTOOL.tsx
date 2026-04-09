"use client";

import { useAuth } from "../context/AuthContext";
import { UserRole } from "@/types/user.types";
import { Draggable } from "@/utils/Draggable/components/Draggable";

const ROLES: {
  role: UserRole | undefined;
  label: string;
  color: string;
}[] = [
  {
    role: undefined,
    label: "Guest",
    color: "bg-yellow-500 hover:bg-yellow-400",
  },
  { role: "usuario", label: "User", color: "bg-green-500 hover:bg-green-400" },
  {
    role: "lider_colonia",
    label: "Líder",
    color: "bg-blue-500 hover:bg-blue-400",
  },
  { role: "admin", label: "Admin", color: "bg-red-500 hover:bg-red-400" },
];

export default function RoleSwitcher() {
  const {
    user,
    effectiveRole,
    setRoleOverride,
    mockUserId,
    setMockUserId,
    mockColoniaId,
    setMockColoniaId,
  } = useAuth();

  if (!setRoleOverride) return null;

  const showColoniaPicker =
    effectiveRole === "usuario" || effectiveRole === "lider_colonia";

  return (
    <Draggable
      initialPosition={{ top: "110px", right: "15px" }}
      className="z-50"
    >
      <div className="max-w-sm space-y-2 rounded-md border border-gray-400 bg-gray-300 p-2 shadow-sm">
        <div className="flex items-center gap-1.5 px-2 py-1.5">
          <span className="whitespace-nowrap text-[10px] font-medium tracking-wide text-black">
            Rol: <strong>{effectiveRole ?? "Guest"}</strong>
          </span>

          {ROLES.map(({ role, label, color }) => (
            <button
              key={role ?? "guest"}
              type="button"
              onClick={() =>
                setRoleOverride(role === effectiveRole ? undefined : role)
              }
              disabled={effectiveRole === role}
              className={`rounded-lg px-2 py-0.5 text-[10px] font-semibold text-white transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 ${color}`}
              title={`Cambiar a ${label}`}
            >
              {label.charAt(0)}
            </button>
          ))}
        </div>

        {setMockUserId && (
          <div className="flex items-center gap-1 px-2">
            <span className="whitespace-nowrap text-[10px] font-medium text-black">
              User ID:
            </span>
            <input
              type="number"
              min="1"
              value={mockUserId ?? ""}
              onChange={(e) =>
                setMockUserId(e.target.value ? Number(e.target.value) : 999)
              }
              className="w-16 rounded border border-gray-400 bg-white px-1 py-0.5 font-mono text-[10px] focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
              placeholder="999"
              title="ID del usuario mock"
            />
          </div>
        )}

        {showColoniaPicker && setMockColoniaId && (
          <div className="flex items-center gap-1 px-2">
            <span className="whitespace-nowrap text-[10px] font-medium text-black">
              Colonia:
            </span>
            <input
              type="number"
              min="1"
              value={mockColoniaId ?? ""}
              onChange={(e) =>
                setMockColoniaId(e.target.value ? Number(e.target.value) : null)
              }
              className="w-16 rounded border border-gray-400 bg-white px-1 py-0.5 font-mono text-[10px] focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
              placeholder="ID"
              title="Código de colonia mock"
            />
            <button
              type="button"
              onClick={() => setMockColoniaId(null)}
              className="rounded-lg bg-gray-500 px-1.5 py-0.5 text-[10px] font-semibold text-white transition-all hover:bg-gray-400 active:scale-95"
              title="Sin colonia"
            >
              ∅
            </button>
          </div>
        )}

        <div className="max-h-32 space-y-1 overflow-y-auto rounded bg-gray-100 p-2 text-[9px]">
          <div className="border-b pb-1 font-semibold text-gray-700">
            Datos del usuario:
          </div>

          {user ? (
            <>
              <div>
                Doc: {user.documento} ({user.tipo_doc})
              </div>
              <div>
                Nombre: {user.nombre} {user.apellido}
              </div>
              <div>
                ID: <span className="font-mono">{user.id}</span>
              </div>
              <div>Código colonia: {user.codigo_colonia ?? "null"}</div>
              <div>
                Rol: <span className="font-mono">{user.role}</span>
              </div>
            </>
          ) : (
            <div className="italic text-gray-500">No hay usuario logueado</div>
          )}
        </div>
      </div>
    </Draggable>
  );
}
