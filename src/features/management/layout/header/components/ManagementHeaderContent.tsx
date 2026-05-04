"use client";

import { useAuth } from "@/auth/context/AuthContext";
import { useRouter } from "next/navigation";
import MainIcon from "@/components/common/MainIcon";
import MainText from "@/components/common/MainText";
import HeaderCurve from "@/components/layout/HeaderCurve";
import Link from "next/link";
import { ArrowLeftEndOnRectangleIcon } from "@heroicons/react/24/outline";

const ROLE_LABEL: Record<string, string> = {
  admin: "Administrador",
  lider_colonia: "Líder de colonia",
  usuario: "Usuario",
};

export default function ManagementHeaderContent() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/inicio");
  };

  return (
    <div className="flex items-center justify-between px-8 py-2 bg-primary relative">
      {/* Volver a página pública */}
      <Link href="/inicio" className="flex items-center gap-4">
        <MainIcon className="shrink-0" size={50} />
        <span className="self-stretch w-1.5 rounded-4xl bg-bg my-1" />
        <MainText className="mt-2 -ml-2" size={120} />
      </Link>
      <span className="text-text-inverse text-2xl font-semibold tracking-widest uppercase ml-10">
        {user?.role === "usuario" ? "Panel de usuario" : "Panel de gestión"}
      </span>

      {/* Info del usuario + logout */}
      {user && (
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end gap-1">
            <span className="text-md font-medium text-text-inverse leading-tight">
              {user.nombre} {user.apellido}
            </span>
            <span className="text-md font-medium text-primary bg-bg px-2 rounded-full leading-tight">
              {ROLE_LABEL[user.role] ?? user.role}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xl font-medium px-3 py-2 bg-accent-yellow rounded-lg text-text-inverse transition-all hover:brightness-110 active:scale-[0.98]"
          >
            <ArrowLeftEndOnRectangleIcon className="w-8 h-8" />
            Cerrar sesión
          </button>
        </div>
      )}

      <HeaderCurve />
    </div>
  );
}

