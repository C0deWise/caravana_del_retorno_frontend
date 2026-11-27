"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Breadcrumb from "@/features/management/layout/breadcrumb/components/Breadcrumb";
import Sidebar from "@/features/management/layout/sidebar/components/Sidebar";
import { SidebarProvider } from "@/features/management/layout/sidebar/components/SidebarContext";
import ManagementHeader from "@/features/management/layout/header/components/ManagementHeader";
import ManagementFooter from "@/features/management/layout/footer/components/ManagementFooter";
import PageTransition from "@/components/layout/PageTransition";
import ErrorBoundary from "@/components/feedback/ErrorBoundary";
import { usePathname } from "next/navigation";

import { RequireAuth } from "@/auth/components/RequireAuth";

export default function GestionLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow;
    const originalBodyOverscroll = document.body.style.overscrollBehavior;
    const originalBodyBg = document.body.style.backgroundColor;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalHtmlOverscroll = document.documentElement.style.overscrollBehavior;

    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";
    document.body.style.backgroundColor = "#024059";
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.overscrollBehavior = "none";

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.body.style.overscrollBehavior = originalBodyOverscroll;
      document.body.style.backgroundColor = originalBodyBg;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.documentElement.style.overscrollBehavior = originalHtmlOverscroll;
    };
  }, []);

  return (
    <RequireAuth>
      <SidebarProvider>
        <div className="relative flex flex-col h-[100dvh] w-full overflow-hidden overscroll-none">
          <Image
            src="/backgrounds/mesh-gestion.webp"
            alt="Fondo ambiental"
            fill
            sizes="100vw"
            priority
            className="object-cover absolute inset-0 -z-10 blur-3xl scale-140 saturate-200"
            unoptimized
          />

          <ManagementHeader />

          <div className="flex flex-1 min-h-0 gap-0 md:gap-5 px-2.5 sm:px-4 md:px-6 pt-6 sm:pt-9 md:pt-12 pb-5 sm:pb-8 md:pb-10 overflow-hidden">
            <div className="flex flex-col w-auto">
              <Sidebar />
            </div>

            <div className="flex flex-col flex-1 min-w-0 gap-3 md:gap-4">
              <Breadcrumb />
              <div className="flex-1 overflow-y-auto overscroll-none rounded-2xl bg-white/65 backdrop-blur-xl border border-white/50 shadow-md">
                <PageTransition key={pathname}>
                  <ErrorBoundary
                    fallback={
                      <div className="flex items-center justify-center p-4 my-10 mx-auto max-w-xl rounded-xl bg-red-100 text-red-800">
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

          <ManagementFooter />
        </div>
      </SidebarProvider>
    </RequireAuth>
  );
}

