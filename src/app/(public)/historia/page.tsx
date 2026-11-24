import type { Metadata } from "next";
import HistorySection from "@/features/home/history/components/HistorySection";

export const metadata: Metadata = {
  title: "Caravana del Retorno - Historia",
  description:
    "Fotografías, videos y testimonios de cada Retorno a Florencia, Cauca.",
};

/**
 * Página "Historia": galería por Retorno conectada al backend
 * (timeline, filtros por año/tipo y visor con la información de cada publicación).
 */
export default function Historia() {
  return <HistorySection />;
}
