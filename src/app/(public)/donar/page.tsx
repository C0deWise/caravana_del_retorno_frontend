import type { Metadata } from "next";
import { HeartIcon } from "@heroicons/react/24/outline";
import ComingSoon from "@/ui/general/ComingSoon";
import { DONATION_COPY } from "@/features/home/donation/config/donation.config";

export const metadata: Metadata = {
  title: "Caravana del Retorno - Donar",
};

/** Página "Donar": el módulo de donaciones aún no está disponible. */
export default function Donar() {
  return <ComingSoon icon={HeartIcon} {...DONATION_COPY} />;
}
