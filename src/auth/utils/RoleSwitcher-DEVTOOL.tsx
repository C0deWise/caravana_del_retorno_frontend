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
    mockColoniaId,
    setMockColoniaId,
    mockColonias,
  } = useAuth();

  if (!setRoleOverride) return null;

  const showColoniaPicker =
    effectiveRole === "usuario" || effectiveRole === "lider_colonia";

  return (
    <Draggable
      initialPosition={{ top: "110px", right: "15px" }}
      className="z-50"
    >
      <div className="bg-gray-300 rounded-md shadow-sm border border-gray-400 p-2 space-y-2 max-w-sm">
        {/* Selector de roles */}
        <div className="flex items-center gap-1.5 px-2 py-1.5">
          <span className="text-[10px] font-medium text-black tracking-wide whitespace-nowrap">
            Rol: <strong>{effectiveRole ?? "Guest"}</strong>
          </span>
          {ROLES.map(({ role, label, color }) => (
            <button
              key={role ?? "guest"}
              onClick={() =>
                setRoleOverride(role === effectiveRole ? undefined : role)
              }
              disabled={effectiveRole === role}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold text-white transition-all ${color} disabled:opacity-30 disabled:cursor-not-allowed active:scale-95`}
              title={`Cambiar a ${label}`}
            >
              {label.charAt(0)}
            </button>
          ))}
        </div>

        {/* Selector de colonia */}
        {showColoniaPicker && setMockColoniaId && mockColonias && (
          <div className="flex items-center gap-1.5 px-2">
            <span className="text-[10px] font-medium text-black whitespace-nowrap">
              Colonia: <strong>{mockColoniaId ?? "null"}</strong>
            </span>
            <button
              onClick={() => setMockColoniaId(null)}
              disabled={mockColoniaId === null}
              className="px-2 py-0.5 rounded-lg text-[10px] font-semibold text-white transition-all bg-gray-500 hover:bg-gray-400 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
              title="Sin colonia"
            >
              ∅
            </button>
            {mockColonias.map((id) => (
              <button
                key={id}
                onClick={() => setMockColoniaId(id)}
                disabled={mockColoniaId === id}
                className="px-2 py-0.5 rounded-lg text-[10px] font-semibold text-white transition-all bg-purple-500 hover:bg-purple-400 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
                title={`Colonia ${id}`}
              >
                {id}
              </button>
            ))}
          </div>
        )}

        {/* Datos del usuario */}
        <div className="p-2 bg-gray-100 rounded text-[9px] max-h-32 overflow-y-auto space-y-1">
          <div className="font-semibold text-gray-700 border-b pb-1">
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
              <div>Código colonia: {user.codigo_colonia ?? "null"}</div>
              <div>
                Rol: <span className="font-mono">{user.role}</span>
              </div>
            </>
          ) : (
            <div className="text-gray-500 italic">No hay usuario logueado</div>
          )}
        </div>
      </div>
    </Draggable>
  );
}
