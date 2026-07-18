"use client";

import { useAuth } from "@/auth/context/AuthContext";
import { useRouter } from "next/navigation";
import MainIcon from "@/components/common/MainIcon";
import MainText from "@/components/common/MainText";
import HeaderCurve from "@/components/layout/HeaderCurve";
import Link from "next/link";
import NotificationsDropdown from "@/features/notifications/components/NotificationsDropdown";
import UserMenuDropdown from "@/features/management/user/googleLink/GoogleLinkButton";

export default function ManagementHeaderContent() {
  const { user } = useAuth();
  const router = useRouter();

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

      {/* Info del usuario + menú */}
      {user && (
        <div className="flex items-center gap-4">
          <NotificationsDropdown />
          <UserMenuDropdown />
        </div>
      )}

      <HeaderCurve />
    </div>
  );
}

