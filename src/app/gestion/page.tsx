"use client";

import Link from "next/link";
import { useAuth } from "@/auth/context/AuthContext";
import { getMenuByRole } from "@/features/management/layout/utils/getMenuByRole";
import { iconMap } from "@/features/management/layout/config/icons";
import HorizontalSeparator from "@/components/layout/HorizontalSeparator";
import { ArrowRight } from "lucide-react";
import React, { useState } from "react";

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
  const [selectedHref, setSelectedHref] = useState<string | null>(null);

  if (isHydrating) {
    return null;
  }

  const managementModules = getMenuByRole(user);

  const tieneColonia = Boolean(user?.codigo_colonia);

  // Flatten all subitems into a single array for direct access
  const allRoutes = managementModules.flatMap(module =>
    (module.subitems || []).map(subitem => ({
      ...subitem,
      category: module.label,
      icon: module.icon
    }))
  ).filter(route => {
    if (route.href === "/gestion/retorno/registro" || route.href === "/gestion/retorno/grupos") {
      return tieneColonia;
    }
    return true;
  });

  return (
    <section className="w-full min-h-full px-4 pt-3.5 pb-5 sm:p-8 md:p-10">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        <header className="space-y-3">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-primary tracking-tight">
            ¡Bienvenido, {user?.nombre}!
          </h1>
          <p className="text-base sm:text-lg text-text-muted max-w-3xl font-medium">
            Selecciona el módulo al que deseas acceder para continuar.
          </p>
          <div className="h-1 w-full rounded-full overflow-hidden pt-0">
            <HorizontalSeparator />
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {allRoutes.map((route) => {
            const isSelected = selectedHref === route.href;
            return (
              <Link
                key={route.href}
                href={route.href}
                onClick={() => setSelectedHref(route.href)}
                className={`group flex flex-col rounded-2xl border shadow-sm md:hover:shadow-md md:hover:-translate-y-0.5 transition-all duration-200 overflow-hidden ${
                  isSelected
                    ? "bg-white border-primary/30 shadow-md"
                    : "border-gray-200/70 bg-white/80 md:hover:bg-white"
                }`}
              >
                <div className="p-4 sm:p-5 flex flex-col h-full gap-2.5">
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl transition-colors duration-200 ${
                        isSelected
                          ? "bg-primary text-white"
                          : "bg-primary/10 text-primary md:group-hover:bg-primary md:group-hover:text-white"
                      }`}
                    >
                      {route.icon && iconMap[route.icon] && React.createElement(iconMap[route.icon], { className: "w-5 h-5 sm:w-6 sm:h-6" })}
                    </div>
                    <h2
                      className={`flex-1 text-base sm:text-lg font-bold leading-tight transition-colors ${
                        isSelected
                          ? "text-secondary"
                          : "text-primary md:group-hover:text-secondary"
                      }`}
                    >
                      {route.label}
                    </h2>
                    <ArrowRight
                      className={`w-4 h-4 shrink-0 transition-all duration-200 ${
                        isSelected
                          ? "text-secondary translate-x-1"
                          : "text-text-muted/60 md:group-hover:text-secondary md:group-hover:translate-x-1"
                      }`}
                    />
                  </div>

                  <p className="text-xs sm:text-sm text-text-muted font-medium leading-relaxed">
                    {descriptionByHref[route.href] || "Accede a esta funcionalidad del sistema."}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
