"use client";

import Breadcrumb from "@/features/management/layout/breadcrumb/components/Breadcrumb";
import Sidebar from "@/features/management/layout/sidebar/components/Sidebar";
import PageTransition from "@/ui/general/PageTransition";
import ErrorBoundary from "@/ui/general/ErrorBoundary";
import { usePathname } from "next/navigation";

export default function GestionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="md:mt-18 w-full flex gap-8">
      <div className="flex flex-col w-auto md:ml-8">
        <Sidebar />
      </div>
      <div className="flex flex-col flex-1 md:gap-6 md:mr-8">
        <Breadcrumb />
        <div className="overflow-clip rounded-xl">
          <PageTransition key={pathname}>
            <ErrorBoundary
              fallback={
                <div className="p-4 bg-red-100 text-red-800 rounded-xl">
                  Error en contenido
                </div>
              }
            >
              {children}
            </ErrorBoundary>
          </PageTransition>
        </div>
      </div>
    </div>
  );
}
