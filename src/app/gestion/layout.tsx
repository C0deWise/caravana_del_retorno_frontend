"use client";

import React, { useEffect } from "react";
import Breadcrumb from "@/features/management/layout/breadcrumb/components/Breadcrumb";
import Sidebar from "@/features/management/layout/sidebar/components/Sidebar";
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
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalHtmlOverscroll = document.documentElement.style.overscrollBehavior;

    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.overscrollBehavior = "none";

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.body.style.overscrollBehavior = originalBodyOverscroll;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.documentElement.style.overscrollBehavior = originalHtmlOverscroll;
    };
  }, []);

  return (
    <RequireAuth>
      <div className="fixed inset-0 flex flex-col overflow-hidden overscroll-none bg-bg">
        <ManagementHeader />

        <div className="flex flex-1 gap-8 overflow-hidden mt-14">
          <div className="flex flex-col w-auto md:ml-8">
            <Sidebar />
          </div>

          <div className="flex flex-col flex-1 md:gap-6 md:mr-8">
            <Breadcrumb />
            <div className="flex-1 overflow-y-auto overscroll-none rounded-xl">
              <PageTransition key={pathname}>
                <ErrorBoundary
                  fallback={
                    <div className="flex items-center justify-center p-4 my-10 mx-auto max-w-xl rounded-xl bg-red-100 text-red-800">
                      Error en contenido
                    </div>
                  }
                >
                  <>
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

