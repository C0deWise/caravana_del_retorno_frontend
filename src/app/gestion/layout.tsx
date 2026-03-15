"use client";

import Breadcrumb from "@/features/gestion/breadcrumb/components/Breadcrumb";
import Sidebar from "@/features/gestion/sidebar/components/Sidebar";
import PageTransition from "@/ui/general/PageTransition";
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
      <div className="flex flex-col flex-1 md:gap-6 md:pr-8">
        <div className="">
          <Breadcrumb />
        </div>
        <PageTransition key={pathname}>{children}</PageTransition>
      </div>
    </div>
  );
}
