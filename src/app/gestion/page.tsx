"use client";

import Link from "next/link";
import {
  HomeIcon,
  ArrowUturnLeftIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import { useAuth } from "@/auth/context/AuthContext";
import { getMenuByRole } from "@/features/management/layout/utils/getMenuByRole";
import { MenuItem } from "@/features/management/layout/types/menu.types";

const iconByHref: Record<string, React.ReactNode> = {
  "/gestion/usuario": <UserIcon className="w-8 h-8 text-primary" />,
  "/gestion/colonia": <HomeIcon className="w-8 h-8 text-primary" />,
  "/gestion/retorno": <ArrowUturnLeftIcon className="w-8 h-8 text-primary" />,
};

const descriptionByHref: Record<string, string> = {
  "/gestion/usuario":
    "Administra información relacionada con usuarios y configuraciones asociadas.",
  "/gestion/colonia": "Crea colonias y asigna líderes.",
  "/gestion/retorno": "Administra la creación de retornos.",
};

export default function Gestion() {
  const { effectiveRole, isHydrating } = useAuth();

  if (isHydrating) {
    return null;
  }

  const managementModules = getMenuByRole(effectiveRole);

  return (
    <section className="w-full min-h-168 rounded-2xl bg-bg-separator shadow-lg p-8 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-primary">
            Panel de gestión
          </h1>
          <p className="text-lg text-text-muted max-w-3xl">
            Accede a las funcionalidades disponibles de cada módulo desde este
            panel principal, o desde el panel lateral.
          </p>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {managementModules.map((module: MenuItem) => (
            <article
              key={module.href}
              className="rounded-2xl border border-gray-200 bg-white/70 shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div className="p-6 border-b border-gray-200 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                    {iconByHref[module.href]}
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-primary">
                      {module.label}
                    </h2>
                  </div>
                </div>

                <p className="text-text-muted leading-relaxed">
                  {descriptionByHref[module.href]}
                </p>
              </div>

              <div className="p-6 space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-text-muted">
                  Funcionalidades disponibles
                </h3>

                <div className="space-y-2">
                  {module.subitems?.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block rounded-xl px-4 py-3 text-primary bg-gray-50 hover:bg-gray-100 hover:text-secondary transition-all"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
