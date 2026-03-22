"use client";
import { useAuth } from "../context/AuthContext";
import { LoggedUserRole } from "../types/roles";
import { Draggable } from "@/utils/Draggable/components/Draggable";

const ROLES: {
  role: LoggedUserRole | undefined;
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
  const { user, updateUser } = useAuth();

  return (
    <Draggable
      initialPosition={{ top: "110px", right: "15px" }}
      className="z-50"
    >
      <div className="flex items-center gap-1.5 bg-gray-300 rounded-md px-2 py-1.5 shadow-sm border border-gray-400">
        <span className="text-[10px] font-medium text-Black tracking-wide">
          Rol:
        </span>
        {ROLES.map(({ role, label, color }) => (
          <button
            key={role ?? "guest"}
            onClick={() => updateUser({ role })}
            disabled={user?.role === role}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold text-white transition-all ${color} disabled:opacity-30 disabled:cursor-not-allowed active:scale-95`}
          >
            {label}
          </button>
        ))}
      </div>
    </Draggable>
  );
}
