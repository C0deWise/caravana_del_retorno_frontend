"use client";

import Link from "next/link";
import { useAuth } from "@/auth/context/AuthContext";
import { getMenuByRole } from "@/features/management/layout/utils/getMenuByRole";
import { iconMap } from "@/features/management/layout/config/icons";
import React from "react";

const descriptionByHref: Record<string, string> = {
  "/gestion/usuario/parentesco": "Gestiona y visualiza tu red de vínculos familiares.",
  "/gestion/colonia/administrar": "Crea nuevas colonias y edita su información principal.",
  "/gestion/colonia/inscribir-colonia": "Busca y envia una solicitud para unirte a una colonia existente.",
  "/gestion/colonia/miembros": "Administra los miembros actuales de tu colonia.",
  "/gestion/colonia/solicitudes-ingreso": "Revisa, aprueba o rechaza peticiones para unirse a tu colonia.",
  "/gestion/retorno/administrar": "Organiza los eventos de retorno, ajustando fechas y detalles.",
  "/gestion/retorno/registro": "Llena el formulario para asegurar tu cupo en un retorno.",
  "/gestion/retorno/grupos": "Administra la logística de los grupos formados para el retorno.",
  "/gestion/publicaciones/administrar": "Crea reseñas, sube multimedia y compártelas en la página de inicio.",
};

export default function Gestion() {
  const { user, isHydrating } = useAuth();

  if (isHydrating) {
    return null;
  }

  const managementModules = getMenuByRole(user);

  // Flatten all subitems into a single array for direct access
  const allRoutes = managementModules.flatMap(module =>
    (module.subitems || []).map(subitem => ({
      ...subitem,
      category: module.label,
      icon: module.icon
    }))
  );

  return (
    <section className="w-full h-full rounded-2xl bg-bg-separator shadow-lg p-8 md:p-10">
      <div className="max-w-7xl mx-auto space-y-10">
        <header className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-black text-primary tracking-tight">
            ¡Bienvenido, {user?.nombre}!
          </h1>
          <p className="text-lg text-text-muted max-w-3xl font-medium">
            Selecciona el módulo al que deseas acceder para continuar.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {allRoutes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className="group flex flex-col rounded-3xl border border-bg-border bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <div className="p-6 flex flex-col h-full relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 group-hover:bg-primary group-hover:text-white transition-colors duration-300 text-primary">
                    {route.icon && iconMap[route.icon] && React.createElement(iconMap[route.icon], { className: "w-8 h-8" })}
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  <h2 className="text-xl font-black text-primary leading-tight group-hover:text-secondary transition-colors">
                    {route.label}
                  </h2>
                  <p className="text-sm text-text-muted font-medium leading-relaxed">
                    {descriptionByHref[route.href] || "Accede a esta funcionalidad del sistema."}
                  </p>
                </div>

                <div className="mt-6 flex items-center text-sm font-bold text-secondary opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  Ingresar al módulo <span className="ml-2">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
