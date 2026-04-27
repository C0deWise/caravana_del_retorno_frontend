"use client";

import Breadcrumb from "@/features/management/layout/breadcrumb/components/Breadcrumb";
import Sidebar from "@/features/management/layout/sidebar/components/Sidebar";
import ManagementHeader from "@/features/management/layout/header/components/ManagementHeader";
import ManagementFooter from "@/features/management/layout/footer/components/ManagementFooter";
import PageTransition from "@/ui/animations/PageTransition";
import ErrorBoundary from "@/ui/general/ErrorBoundary";
import { usePathname } from "next/navigation";
import { RoleSwitcherClient } from "@/auth/utils/RoleSwitcherClient-DEVTOOL";
import { RequireAuth } from "@/auth/components/RequireAuth";

export default function GestionLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <RequireAuth>
      <div className="flex flex-col h-screen overflow-hidden">
        <ManagementHeader />

        <div className="flex flex-1 gap-8 overflow-hidden mt-14">
          <div className="flex flex-col w-auto md:ml-8">
            <Sidebar />
          </div>

          <div className="flex flex-col flex-1 md:gap-6 md:mr-8">
            <Breadcrumb />
            <div className="flex-1 overflow-y-scroll rounded-xl">
              <PageTransition key={pathname}>
                <ErrorBoundary
                  fallback={
                    <div className="flex items-center justify-center p-4 my-10 mx-auto max-w-xl rounded-xl bg-red-100 text-red-800">
                      Error en contenido
                    </div>
                  }
                >
                  <>
                    <RoleSwitcherClient />
                    {children}
                  </>
                </ErrorBoundary>
              </PageTransition>
            </div>
          </div>
        </div>

        <ManagementFooter />
      </div>
    </RequireAuth>
  );
}
