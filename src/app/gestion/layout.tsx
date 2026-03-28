"use client";

import Breadcrumb from "@/features/management/layout/breadcrumb/components/Breadcrumb";
import Sidebar from "@/features/management/layout/sidebar/components/Sidebar";
import PageTransition from "@/ui/animations/PageTransition";
import ErrorBoundary from "@/ui/general/ErrorBoundary";
import { usePathname } from "next/navigation";
import { AuthProvider } from "@/features/auth/context/AuthContext";
import { RoleSwitcherClient } from "@/features/auth/utils/RoleSwitcherClient-DEVTOOL"; // TODO: Elminar en produccion

export default function GestionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="md:mt-18 w-full flex gap-8 h-[calc(100vh-4.5rem)] overflow-hidden">
      <div className="flex flex-col w-auto md:ml-8">
        <Sidebar />
      </div>

      <div className="flex flex-col flex-1 md:gap-6 md:mr-8">
        <Breadcrumb />
        <div className="flex-1 overflow-y-auto rounded-xl">
          <PageTransition key={pathname}>
            <ErrorBoundary
              fallback={
                <div className="p-4 bg-red-100 text-red-800 rounded-xl">
                  Error en contenido
                </div>
              }
            >
              <AuthProvider>
                <>
                  {/*  TODO: Eliminar en produccion */}
                  <RoleSwitcherClient />

                  {children}
                </>
              </AuthProvider>
            </ErrorBoundary>
          </PageTransition>
        </div>
      </div>
    </div>
  );
}
