"use client";

import { useAuth } from "../context/AuthContext";
import { UserRole } from "@/types/user.types";

type RequireAuthProps = {
  children: React.ReactNode;
  roles?: UserRole[];
};

export function RequireAuth({ children, roles }: RequireAuthProps) {
  const { user } = useAuth();

  const allowed =
    !!user?.role && (!roles || roles.includes(user.role as UserRole));

  if (!allowed) {
    return (
      <div className="w-full h-full flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text mb-4">Acceso Denegado</h1>
          <p className="text-text-muted">
            No tienes permiso para ver este contenido.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
