"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "@/types/user.types";

type RequireAuthProps = {
  readonly children: React.ReactNode;
  readonly roles?: UserRole[];
  readonly requireColony?: boolean;
  readonly redirectTo?: string;
};

export function RequireAuth({
  children,
  roles,
  requireColony = false,
  redirectTo = "/",
}: RequireAuthProps) {
  const { user, isAuthenticated, isHydrating, effectiveRole } = useAuth();
  const router = useRouter();

  const hasRole = !roles || roles.includes(effectiveRole as UserRole);
  const hasColony = !requireColony || !!user?.codigo_colonia;
  const hasAccess = isAuthenticated && hasRole && hasColony;

  useEffect(() => {
    if (isHydrating) return;

    if (!isAuthenticated) {
      router.replace(redirectTo);
      return;
    }

    if (roles && !roles.includes(effectiveRole as UserRole)) {
      router.replace("/gestion");
      return;
    }

    if (requireColony && !user?.codigo_colonia) {
      router.replace("/gestion");
    }
  }, [isHydrating, isAuthenticated, effectiveRole, roles, requireColony, user?.codigo_colonia, redirectTo, router]);

  if (isHydrating) {
    return (
      <div className="w-full h-full flex items-center justify-center p-8">
        <p className="text-text-muted text-sm animate-pulse">
          Cargando sesión...
        </p>
      </div>
    );
  }

  if (!hasAccess) {
    return null;
  }

  return <>{children}</>;
}
