import { UserRole } from "@/types/user.types";

export const DEV_ROLES: {
  role: UserRole | undefined;
  label: string;
  color: string;
  neon: string;
}[] = [
  {
    role: undefined,
    label: "GUEST",
    color: "bg-zinc-800",
    neon: "border-zinc-500 shadow-[0_0_10px_rgba(113,113,122,0.5)]",
  },
  { 
    role: "usuario", 
    label: "USER", 
    color: "bg-emerald-950", 
    neon: "border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
  },
  {
    role: "lider_colonia",
    label: "LEAD",
    color: "bg-cyan-950",
    neon: "border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]",
  },
  { 
    role: "admin", 
    label: "ADMIN", 
    color: "bg-rose-950", 
    neon: "border-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]" 
  },
];
