import type { Metadata } from "next";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import ComingSoon from "@/ui/general/ComingSoon";
import { SCHEDULE_COPY } from "@/features/home/schedule/config/schedule.config";

export const metadata: Metadata = {
  title: "Caravana del Retorno - Programación",
};

/** Página "Programación": aviso de que aún no hay programación publicada. */
export default function Programacion() {
  return <ComingSoon icon={CalendarDaysIcon} {...SCHEDULE_COPY} />;
}
